import { buildPracticeGraphFromLesson } from "@/lib/practice-graph/build-practice-graph-from-lesson";
import { persistPracticeGraph } from "@/lib/practice-graph/persist-practice-graph";
import { fetchLessonById } from "@/lib/lessons/fetch-lesson-by-id";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { ServerClient } from "@/lib/supabase/create-server-client";

/** Compile and persist a Practice Graph after lesson confirmation. */
export async function compileAndPersistPracticeGraph(
  supabase: ServerClient,
  lessonId: string,
  content: ConfirmedLessonContent,
): Promise<PracticeGraph> {
  const lesson = await fetchLessonById(supabase, lessonId);
  const graph = buildPracticeGraphFromLesson(lessonId, lesson.user_id, content);
  return persistPracticeGraph(supabase, graph);
}
