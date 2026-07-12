import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { mapLessonRowToListItem } from "@/lib/lessons/map-lesson-row-to-list-item";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { LessonListItem } from "@/types/lesson/lesson-list-item";

export async function fetchLessonList(supabase: ServerClient): Promise<LessonListItem[]> {
  const userId = await getDefaultUserId(supabase);

  const { data, error } = await supabase
    .from("lessons")
    .select("id, status, class_date, parsed, confirmed")
    .eq("user_id", userId)
    .order("class_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load lessons: ${error.message}`);
  }

  return (data ?? []).map(mapLessonRowToListItem);
}
