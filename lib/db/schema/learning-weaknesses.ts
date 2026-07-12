import { pgTable, integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { knowledgeItems } from "@/lib/db/schema/knowledge-items";
import { users } from "@/lib/db/schema/users";

/** Recurring mistake linked to a knowledge concept. */
export const learningWeaknesses = pgTable("learning_weaknesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conceptId: uuid("concept_id").references(() => knowledgeItems.id, { onDelete: "set null" }),
  category: text("category").notNull(),
  description: text("description").notNull(),
  occurrenceCount: integer("occurrence_count").notNull().default(1),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LearningWeaknessRow = typeof learningWeaknesses.$inferSelect;
