import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export async function updateLessonParsed(
  supabase: ServerClient,
  lessonId: string,
  parsed: ParsedLessonSummary,
) {
  const { error } = await supabase
    .from("lessons")
    .update({
      status: "parsed",
      parsed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lessonId);

  if (error) {
    throw error;
  }
}
