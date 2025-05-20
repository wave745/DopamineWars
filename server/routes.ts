import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Anonymous app - no auth required
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertContentSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Set up multer storage configuration for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function(_req, _file, cb) {
      // Ensure uploads directory exists
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function(_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter(_req, file, cb) {
    // Accept only images and videos
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Helper function to determine content type based on mimetype
function getContentType(mimetype: string): string {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "image"; // Default to image instead of other
}

// Emoji validation schema
const emojiSchema = z.enum(["😐", "😊", "😄", "🤯", "🔥"]);

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Public version - No authentication needed
  // This endpoint returns null since we don't require user info for anonymous app
  app.get('/api/auth/user', async (_req, res) => {
    res.status(401).json({ message: "Unauthorized" });
  });
  
  // API endpoints
  app.get("/api/content", async (_req, res) => {
    try {
      const contents = await storage.getAllContent();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const trendingContent = await storage.getTrendingContent(limit);
      res.json(trendingContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending content" });
    }
  });

  app.get("/api/content/latest", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const latestContent = await storage.getLatestContent(limit);
      res.json(latestContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest content" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContentById(id);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/content/upload", upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Set a generic anonymous user ID
      const userId = "anonymous-user";
      
      // Get the filename from the uploaded file
      const fileName = req.file.filename;
      
      // Create content in database
      const contentType = req.body.type || getContentType(req.file.mimetype);
      
      const validatedData = insertContentSchema.parse({
        userId,
        type: contentType,
        url: `/uploads/${fileName}`,
      });
      
      const newContent = await storage.createContent(validatedData);
      
      res.status(201).json(newContent);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload content" });
    }
  });

  app.post("/api/content/import", async (req: any, res) => {
    try {
      const { url, type } = req.body;
      const userId = "anonymous-user";
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      // Only allow image or video type
      if (type !== 'image' && type !== 'video') {
        return res.status(400).json({ message: "Content type must be image or video" });
      }
      
      const validatedData = insertContentSchema.parse({
        userId,
        type: type || "image",
        url,
      });
      
      const newContent = await storage.createContent(validatedData);
      
      res.status(201).json(newContent);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to import content" });
    }
  });

  app.post("/api/content/:id/vote", async (req: any, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const { emoji } = req.body;
      const userId = "anonymous-user";
      
      // Validate emoji
      const validEmoji = emojiSchema.parse(emoji);
      
      const content = await storage.getContentById(contentId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      const validatedData = insertVoteSchema.parse({
        userId,
        contentId,
        emoji: validEmoji,
      });
      
      const vote = await storage.createVote(validatedData);
      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  app.post("/api/content/:id/save", async (_req, res) => {
    try {
      const userId = "anonymous-user";
      const contentId = parseInt(_req.params.id);
      
      const content = await storage.getContentById(contentId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      await storage.saveFavorite(userId, contentId);
      
      res.status(200).json({ message: "Content saved to favorites", saved: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to save content" });
    }
  });

  app.post("/api/content/:id/unsave", async (_req, res) => {
    try {
      const userId = "anonymous-user";
      const contentId = parseInt(_req.params.id);
      
      await storage.removeFavorite(userId, contentId);
      
      res.status(200).json({ message: "Content removed from favorites", saved: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove content from favorites" });
    }
  });

  app.post("/api/content/:id/share", async (_req, res) => {
    res.status(200).json({ message: "Content shared" });
  });

  app.get("/api/leaderboard/:timeFrame", async (req, res) => {
    try {
      const timeFrame = req.params.timeFrame as "daily" | "weekly" | "monthly";
      const leaderboard = await storage.getLeaderboard(timeFrame);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/chart/:timeFrame", async (req, res) => {
    try {
      const timeFrame = req.params.timeFrame as "24H" | "7D" | "30D";
      const chartData = await storage.getChartData(timeFrame);
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chart data" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  return httpServer;
}
