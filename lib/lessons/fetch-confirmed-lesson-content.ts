import { querySingle } from "@/lib/supabase/query-single";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";

type ConfirmedLessonRow = {
  id: string;
  status: string;
  confirmed: ConfirmedLessonContent | null;
};

export async function fetchConfirmedLessonContent(
  supabase: ServerClient,
  lessonId: string,
): Promise<ConfirmedLessonContent> {
  const data = await querySingle<ConfirmedLessonRow>(
    supabase.from("lessons").select("id, status, confirmed").eq("id", lessonId).single(),
    "Could not load lesson",
  );

  if (data.status !== "confirmed" || !data.confirmed) {
    throw new Error("Lesson must be confirmed before starting a session.");
  }

  return data.confirmed;
}
