import { pgTable, text, serial, integer, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Updated user table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Replit user ID is a string
  username: text("username").notNull().unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  contentId: integer("content_id").notNull().references(() => content.id),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
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
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

// Define schema for upserting user
export const upsertUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertChartData = z.infer<typeof insertChartDataSchema>;

export type User = typeof users.$inferSelect;
export type Content = typeof content.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type ChartData = typeof chartData.$inferSelect;
