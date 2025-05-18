import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull().references(() => content.id),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  contentId: integer("content_id").notNull().references(() => content.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chartData = pgTable("chart_data", {
  id: serial("id").primaryKey(),
  timeFrame: text("time_frame").notNull(),
  labels: text("labels").array().notNull(),
  coreDopamine: integer("core_dopamine").array().notNull(),
  liquidationMoments: integer("liquidation_moments").array().notNull(),
  chillPotent: integer("chill_potent").array().notNull(),
  funFastHits: integer("fun_fast_hits").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content Insert Schema
export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

// Vote Insert Schema
export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

// Favorite Insert Schema
export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

// ChartData Insert Schema
export const insertChartDataSchema = createInsertSchema(chartData).omit({
  id: true,
  createdAt: true,
});

// User Insert Schema
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertChartData = z.infer<typeof insertChartDataSchema>;

export type User = typeof users.$inferSelect;
export type Content = typeof content.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type ChartData = typeof chartData.$inferSelect;
