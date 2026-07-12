import { upsertKnowledgeFromLesson } from "@/lib/knowledge/upsert-knowledge-from-lesson";
import { fetchLessonById } from "@/lib/lessons/fetch-lesson-by-id";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import { mapKnowledgeRowToItem } from "@/lib/knowledge/map-knowledge-row-to-item";

/** Upsert knowledge graph nodes when a lesson is confirmed. */
export async function compileAndPersistKnowledge(
  supabase: ServerClient,
  lessonId: string,
  content: ConfirmedLessonContent,
): Promise<KnowledgeItem[]> {
  const lesson = await fetchLessonById(supabase, lessonId);
  const rows = await upsertKnowledgeFromLesson(supabase, lesson.user_id, lessonId, content);

  return rows.map((row) =>
    mapKnowledgeRowToItem({
      ...row,
      reviews: null,
    }),
  );
}
