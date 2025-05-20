import { 
  type User, type InsertUser, type UpsertUser,
  type Content, type InsertContent,
  type Vote, type InsertVote, 
  type Favorite, type InsertFavorite,
  type ChartData, type InsertChartData
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Content methods
  getAllContent(): Promise<any[]>;
  getContentById(id: number): Promise<any | undefined>;
  getTrendingContent(limit?: number): Promise<any[]>;
  getLatestContent(limit?: number): Promise<any[]>;
  createContent(content: InsertContent): Promise<any>;
  resetContent(): Promise<void>; // New method to reset content
  
  // Vote methods
  getVotesByContentId(contentId: number): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  
  // Favorite methods
  getFavoritesByUserId(userId: string): Promise<any[]>;
  saveFavorite(userId: string, contentId: number): Promise<Favorite>;
  removeFavorite(userId: string, contentId: number): Promise<void>;
  
  // Leaderboard and chart methods
  getLeaderboard(timeFrame: "daily" | "weekly" | "monthly"): Promise<any[]>;
  getChartData(timeFrame: "24H" | "7D" | "30D"): Promise<any>;
  createChartData(chartData: InsertChartData): Promise<ChartData>;
}

// Emoji rating scores for calculating averages
const emojiScores: Record<string, number> = {
  "😐": 1,
  "😊": 2,
  "😄": 3, 
  "🤯": 4,
  "🔥": 5
};

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private content: Map<number, Content>;
  private votes: Map<number, Vote>;
  private favorites: Map<number, Favorite>;
  private chartData: Map<number, ChartData>;
  
  private contentIdCounter: number;
  private voteIdCounter: number;
  private favoriteIdCounter: number;
  private chartDataIdCounter: number;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.votes = new Map();
    this.favorites = new Map();
    this.chartData = new Map();
    
    this.contentIdCounter = 1;
    this.voteIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.chartDataIdCounter = 1;
    
    // Initialize with sample chart data only
    this.initializeSampleData();
  }
  
  // Method to reset all content
  async resetContent(): Promise<void> {
    // Clear all content
    this.content.clear();
    this.votes.clear();
    this.favorites.clear();
    
    // Reset counters
    this.contentIdCounter = 1;
    this.voteIdCounter = 1;
    this.favoriteIdCounter = 1;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const createdAt = new Date();
    const updatedAt = new Date();
    const user: User = { ...insertUser, createdAt, updatedAt };
    this.users.set(user.id, user);
    return user;
  }
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUser(userData.id);
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date()
      };
      this.users.set(updatedUser.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const createdAt = new Date();
      const updatedAt = new Date();
      const newUser: User = {
        ...userData,
        createdAt,
        updatedAt,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  // Content methods
  async getAllContent(): Promise<any[]> {
    const contentArray = Array.from(this.content.values());
    return Promise.all(contentArray.map(content => this.enrichContent(content)));
  }

  async getContentById(id: number): Promise<any | undefined> {
    const content = this.content.get(id);
    if (!content) return undefined;
    return this.enrichContent(content);
  }

  async getTrendingContent(limit: number = 6): Promise<any[]> {
    const enrichedContent = await this.getAllContent();
    return enrichedContent
      .sort((a, b) => b.totalVotes - a.totalVotes || b.averageRating - a.averageRating)
      .slice(0, limit);
  }

  async getLatestContent(limit: number = 6): Promise<any[]> {
    const enrichedContent = await this.getAllContent();
    return enrichedContent
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createContent(insertContent: InsertContent): Promise<any> {
    const id = this.contentIdCounter++;
    const createdAt = new Date();
    const content: Content = { id, ...insertContent, createdAt };
    this.content.set(id, content);
    return this.enrichContent(content);
  }

  // Vote methods
  async getVotesByContentId(contentId: number): Promise<Vote[]> {
    return Array.from(this.votes.values())
      .filter(vote => vote.contentId === contentId);
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.voteIdCounter++;
    const createdAt = new Date();
    const vote: Vote = { id, ...insertVote, createdAt };
    this.votes.set(id, vote);
    return vote;
  }

  // Favorite methods
  async getFavoritesByUserId(userId: string): Promise<any[]> {
    const favorites = Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId);
    
    const enrichedFavorites = await Promise.all(
      favorites.map(async fav => {
        const content = await this.getContentById(fav.contentId);
        return {
          ...fav,
          content
        };
      })
    );
    
    return enrichedFavorites;
  }

  async saveFavorite(userId: string, contentId: number): Promise<Favorite> {
    // Check if already favorited
    const existing = Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.contentId === contentId);
    
    if (existing) {
      return existing;
    }
    
    const id = this.favoriteIdCounter++;
    const createdAt = new Date();
    const favorite: Favorite = { id, userId, contentId, createdAt };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, contentId: number): Promise<void> {
    const favorites = Array.from(this.favorites.values());
    const favorite = favorites.find(fav => fav.userId === userId && fav.contentId === contentId);
    
    if (favorite) {
      this.favorites.delete(favorite.id);
    }
  }

  // Leaderboard and chart methods
  async getLeaderboard(timeFrame: "daily" | "weekly" | "monthly"): Promise<any[]> {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeFrame) {
      case "daily":
        cutoffDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case "weekly":
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "monthly":
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
    }
    
    const enrichedContent = await this.getAllContent();
    const filteredContent = enrichedContent.filter(
      content => new Date(content.createdAt) >= cutoffDate
    );
    
    const sortedContent = filteredContent.sort(
      (a, b) => b.averageRating - a.averageRating || b.totalVotes - a.totalVotes
    );
    
    return sortedContent.map((content, index) => ({
      ...content,
      rank: index + 1
    }));
  }

  async getChartData(timeFrame: "24H" | "7D" | "30D"): Promise<any> {
    // Find chart data for the given time frame or create new one
    const chartData = Array.from(this.chartData.values())
      .find(data => data.timeFrame === timeFrame);
    
    if (chartData) {
      return {
        labels: chartData.labels,
        coreDopamine: chartData.coreDopamine,
        liquidationMoments: chartData.liquidationMoments,
        chillPotent: chartData.chillPotent,
        funFastHits: chartData.funFastHits
      };
    }
    
    // If no data exists, create sample data
    return this.createSampleChartData(timeFrame);
  }

  async createChartData(insertChartData: InsertChartData): Promise<ChartData> {
    const id = this.chartDataIdCounter++;
    const createdAt = new Date().toISOString();
    const chartData: ChartData = { id, ...insertChartData, createdAt };
    this.chartData.set(id, chartData);
    return chartData;
  }

  // Private helper methods
  private async enrichContent(content: Content): Promise<any> {
    const votes = await this.getVotesByContentId(content.id);
    const totalVotes = votes.length;
    
    let averageRating = 0;
    const emojiCounts: Record<string, number> = {};
    
    if (totalVotes > 0) {
      // Count votes for each emoji and calculate average rating
      votes.forEach(vote => {
        emojiCounts[vote.emoji] = (emojiCounts[vote.emoji] || 0) + 1;
        averageRating += emojiScores[vote.emoji] || 0;
      });
      
      averageRating /= totalVotes;
    }
    
    // Find the most common emoji
    let topEmoji = "😐";
    let maxCount = 0;
    
    for (const [emoji, count] of Object.entries(emojiCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topEmoji = emoji;
      }
    }
    
    return {
      ...content,
      totalVotes,
      averageRating,
      topEmoji
    };
  }

  private createSampleChartData(timeFrame: "24H" | "7D" | "30D"): any {
    let labels: string[] = [];
    const pointCount = timeFrame === "24H" ? 24 : timeFrame === "7D" ? 7 : 30;
    
    // Generate labels
    if (timeFrame === "24H") {
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    } else if (timeFrame === "7D") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date().getDay();
      labels = Array.from({ length: 7 }, (_, i) => days[(today - 6 + i + 7) % 7]);
    } else {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    }
    
    // Generate random data points with realistic patterns
    const generateData = (base: number, variance: number) => {
      return Array.from({ length: pointCount }, () => 
        Math.floor(base + (Math.random() * variance * 2 - variance))
      );
    };
    
    const coreDopamine = generateData(35, 15);
    const liquidationMoments = generateData(40, 20);
    const chillPotent = generateData(30, 10);
    const funFastHits = generateData(25, 15);
    
    // Add spikes to make it more interesting
    const addSpikes = (data: number[]) => {
      const spikeCount = Math.floor(data.length / 5);
      for (let i = 0; i < spikeCount; i++) {
        const index = Math.floor(Math.random() * data.length);
        data[index] = Math.min(90, data[index] + 20 + Math.floor(Math.random() * 10));
      }
      return data;
    };
    
    addSpikes(coreDopamine);
    addSpikes(liquidationMoments);
    addSpikes(chillPotent);
    addSpikes(funFastHits);
    
    // Store the generated data
    this.createChartData({
      timeFrame,
      labels,
      coreDopamine,
      liquidationMoments,
      chillPotent,
      funFastHits
    });
    
    return {
      labels,
      coreDopamine,
      liquidationMoments,
      chillPotent,
      funFastHits
    };
  }

  // Initialize sample data
  private initializeSampleData() {
    // Create sample user with string ID
    const demoUser = this.upsertUser({
      id: "demo-user-1",
      username: "demo_user",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=demo"
    });

    // Sample content URLs
    const sampleUrls = [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500", // Funny cat
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500", // Brain activity
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500", // Abstract
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500", // Viral
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500", // Meme
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500", // Tweet
    ];

    // Sample content types
    const contentTypes = ["meme", "image", "tweet", "video"];

    // Create sample content
    sampleUrls.forEach((url, index) => {
      const type = contentTypes[index % contentTypes.length];
      this.createContent({
        userId: "demo-user-1", // Using string ID
        type,
        url
      });
    });

    // Create sample votes
    const emojis = ["😐", "😊", "😄", "🤯", "🔥"];
    
    // For each content, add 10-50 random votes
    for (let contentId = 1; contentId <= sampleUrls.length; contentId++) {
      const voteCount = 10 + Math.floor(Math.random() * 40);
      
      for (let i = 0; i < voteCount; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        this.createVote({
          userId: "demo-user-1", // Using string ID
          contentId,
          emoji
        });
      }
    }

    // Create sample favorites
    this.saveFavorite("demo-user-1", 1);
    this.saveFavorite("demo-user-1", 3);

    // Create sample chart data for all time frames
    this.createSampleChartData("24H");
    this.createSampleChartData("7D");
    this.createSampleChartData("30D");
  }
}

// Export the storage instance
export const storage = new MemStorage();
