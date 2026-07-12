import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { RawLessonDump } from "@/types/lesson/raw-lesson-dump";

export type InsertDraftLessonInput = {
  lessonId: string;
  userId: string;
  raw: RawLessonDump;
};

export async function insertDraftLesson(supabase: ServerClient, input: InsertDraftLessonInput) {
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      id: input.lessonId,
      user_id: input.userId,
      status: "draft",
      raw: input.raw,
      class_date: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
