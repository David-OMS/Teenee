import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { knowledgeItems } from "@/lib/db/schema/knowledge-items";
import type { PracticeEdge } from "@/types/practice-graph/practice-edge";
import type { PracticeNode } from "@/types/practice-graph/practice-node";

import { lessons } from "@/lib/db/schema/lessons";
import { users } from "@/lib/db/schema/users";

/** Lesson-scoped Practice Graph — how today's lesson becomes conversation. */
export const practiceGraphs = pgTable("practice_graphs", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  templateIds: jsonb("template_ids").$type<string[]>().notNull().default([]),
  nodes: jsonb("nodes").$type<PracticeNode[]>().notNull().default([]),
  edges: jsonb("edges").$type<PracticeEdge[]>().notNull().default([]),
  pronunciationFocus: text("pronunciation_focus").notNull(),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PracticeGraphRow = typeof practiceGraphs.$inferSelect;
export type NewPracticeGraphRow = typeof practiceGraphs.$inferInsert;
