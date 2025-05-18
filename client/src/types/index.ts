export type EmojiRating = '😐' | '😊' | '😄' | '🤯' | '🔥';

export type EmojiScoreMap = {
  '😐': 1;
  '😊': 2;
  '😄': 3;
  '🤯': 4;
  '🔥': 5;
};

export type ContentType = 'meme' | 'image' | 'tweet' | 'video' | 'other';

export interface Content {
  id: number;
  type: ContentType;
  url: string;
  createdAt: string;
  totalVotes: number;
  averageRating: number;
  topEmoji: EmojiRating;
}

export interface LeaderboardEntry extends Content {
  rank: number;
}

export interface ChartData {
  time: string;
  coreDopamine: number;
  liquidationMoments: number;
  chillPotent: number;
  funFastHits: number;
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly';
export type ChartTimeFrame = '24H' | '7D' | '30D';
