import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { lessons } from "@/lib/db/schema/lessons";
import { users } from "@/lib/db/schema/users";
import type { ConceptConfidence } from "@/types/knowledge/concept-confidence";
import type { ConceptKind } from "@/types/knowledge/concept-kind";

export type KnowledgePayload = {
  french?: string;
  english?: string;
  normalizedForm?: string;
  topic?: string;
  description?: string;
  commonMistakes?: string[];
  register?: "formal" | "informal" | "neutral";
};

/** Knowledge Graph node — vocabulary, grammar, or expression from a lesson. */
export const knowledgeItems = pgTable("knowledge_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  kind: text("kind").$type<ConceptKind>().notNull(),
  label: text("label").notNull(),
  mastery: integer("mastery").notNull().default(0),
  confidence: jsonb("confidence").$type<ConceptConfidence>().notNull(),
  payload: jsonb("payload").$type<KnowledgePayload>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type KnowledgeItemRow = typeof knowledgeItems.$inferSelect;
export type NewKnowledgeItemRow = typeof knowledgeItems.$inferInsert;
