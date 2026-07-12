import { querySingle } from "@/lib/supabase/query-single";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { SessionReview } from "@/types/session/session-review";

type SessionReviewRow = {
  id: string;
  lesson_id: string;
  phase: string;
  duration_seconds: number | null;
  review: SessionReview | null;
  lessons: { title: string } | { title: string }[] | null;
};

function lessonTitleFromJoin(
  lessons: SessionReviewRow["lessons"],
): string {
  if (!lessons) {
    return "Session";
  }

  if (Array.isArray(lessons)) {
    return lessons[0]?.title ?? "Session";
  }

  return lessons.title;
}

export type SessionReviewPayload = {
  sessionId: string;
  lessonId: string;
  lessonTitle: string;
  phase: string;
  durationSeconds: number;
  review: SessionReview;
};

export async function fetchSessionReview(
  supabase: ServerClient,
  sessionId: string,
): Promise<SessionReviewPayload> {
  const row = await querySingle<SessionReviewRow>(
    supabase
      .from("sessions")
      .select("id, lesson_id, phase, duration_seconds, review, lessons(title)")
      .eq("id", sessionId)
      .single(),
    "Session not found",
  );

  if (!row.review) {
    throw new Error("Session review not available yet.");
  }

  return {
    sessionId: row.id,
    lessonId: row.lesson_id,
    lessonTitle: lessonTitleFromJoin(row.lessons),
    phase: row.phase,
    durationSeconds: row.duration_seconds ?? 0,
    review: row.review,
  };
}
