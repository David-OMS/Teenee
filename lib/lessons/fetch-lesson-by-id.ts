import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { RawLessonDump } from "@/types/lesson/raw-lesson-dump";

export type LessonRow = {
  id: string;
  user_id: string;
  status: string;
  raw: RawLessonDump;
  parsed: unknown;
  confirmed: unknown;
};

export async function fetchLessonById(supabase: ServerClient, lessonId: string) {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, user_id, status, raw, parsed, confirmed")
    .eq("id", lessonId)
    .single();

  if (error || !data) {
    throw new Error("Lesson not found.");
  }

  return data as LessonRow;
}
