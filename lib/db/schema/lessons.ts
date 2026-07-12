import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "@/lib/db/schema/users";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";
import type { RawLessonDump } from "@/types/lesson/raw-lesson-dump";

/** Lesson lifecycle: voice dump → parse → confirm. */
export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("draft"),
  raw: jsonb("raw").$type<RawLessonDump>().notNull(),
  parsed: jsonb("parsed").$type<ParsedLessonSummary>(),
  confirmed: jsonb("confirmed").$type<ConfirmedLessonContent>(),
  classDate: timestamp("class_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type LessonRow = typeof lessons.$inferSelect;
export type NewLessonRow = typeof lessons.$inferInsert;
