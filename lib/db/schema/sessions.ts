import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { lessons } from "@/lib/db/schema/lessons";
import { users } from "@/lib/db/schema/users";
import type { SessionAgenda } from "@/types/session/session-agenda";
import type { SessionReview } from "@/types/session/session-review";
import type { SessionPhase, SessionStatus } from "@/types/session/session-phase";

/** Voice session record — explain, practice, or review phase. */
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  agendaId: uuid("agenda_id").notNull(),
  agenda: jsonb("agenda").$type<SessionAgenda>(),
  phase: text("phase").$type<SessionPhase>().notNull().default("practice"),
  status: text("status").$type<SessionStatus>().notNull().default("active"),
  review: jsonb("review").$type<SessionReview>(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  durationSeconds: integer("duration_seconds"),
});

export type SessionRow = typeof sessions.$inferSelect;
export type NewSessionRow = typeof sessions.$inferInsert;
