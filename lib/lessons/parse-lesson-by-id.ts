import { fetchLessonById } from "@/lib/lessons/fetch-lesson-by-id";
import { parseLessonFromText } from "@/lib/lessons/parse-lesson/parse-lesson-from-text";
import { updateLessonParsed } from "@/lib/lessons/update-lesson-parsed";
import { createServerClient } from "@/lib/supabase/create-server-client";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

/** Orchestrator — fetch draft lesson → parse text → save parsed summary. */
export async function parseLessonById(lessonId: string): Promise<ParsedLessonSummary> {
  const supabase = createServerClient();
  const lesson = await fetchLessonById(supabase, lessonId);
  const text = lesson.raw.textContent;

  if (!text) {
    throw new Error("Lesson has no text to parse.");
  }

  const parsed = await parseLessonFromText(text, text);
  await updateLessonParsed(supabase, lessonId, parsed);
  return parsed;
}
