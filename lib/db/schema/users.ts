import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Layer 1 profile — goals, CEFR target, correction preferences. */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name").notNull(),
  targetCefr: text("target_cefr").notNull().default("A1"),
  currentCefrEstimate: text("current_cefr_estimate").notNull().default("A1"),
  correctionStyle: text("correction_style").notNull().default("gentle"),
  defaultConversationMode: text("default_conversation_mode").notNull().default("hybrid"),
  interests: jsonb("interests").$type<string[]>().notNull().default([]),
  goals: jsonb("goals")
    .$type<{ id: string; label: string; completed: boolean }[]>()
    .notNull()
    .default([]),
  silenceTimeoutSeconds: integer("silence_timeout_seconds").notNull().default(2),
  triggerPhrases: jsonb("trigger_phrases").$type<string[]>().notNull().default([
    "Your turn.",
    "Go ahead.",
    "That's all.",
  ]),
  transcriptVisible: boolean("transcript_visible").notNull().default(false),
  profileSetupComplete: boolean("profile_setup_complete").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
