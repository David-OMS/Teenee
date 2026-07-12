import type { ServerClient } from "@/lib/supabase/create-server-client";
import { querySingle } from "@/lib/supabase/query-single";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export type ParsedLessonRow = {
  id: string;
  status: string;
  parsed: ParsedLessonSummary;
};

type ParsedLessonQueryRow = {
  id: string;
  status: string;
  parsed: ParsedLessonSummary | null;
};

export async function fetchParsedLesson(
  supabase: ServerClient,
  lessonId: string,
): Promise<ParsedLessonRow> {
  const data = await querySingle<ParsedLessonQueryRow>(
    supabase.from("lessons").select("id, status, parsed").eq("id", lessonId).single(),
    "Could not load lesson",
  );

  if (!data.parsed) {
    throw new Error("Lesson has not been parsed yet.");
  }

  return {
    id: data.id,
    status: data.status,
    parsed: data.parsed,
  };
}
