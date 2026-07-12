import { buildConfirmedContent } from "@/lib/lessons/build-confirmed-content";
import { compileAndPersistKnowledge } from "@/lib/knowledge/compile-and-persist-knowledge";
import { compileAndPersistPracticeGraph } from "@/lib/practice-graph/compile-and-persist-practice-graph";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function confirmLesson(lessonId: string, content: ConfirmedLessonContent) {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("lessons")
    .update({
      status: "confirmed",
      confirmed: content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lessonId);

  if (error) {
    throw new Error(`Could not confirm lesson: ${error.message}`);
  }

  const [practiceGraph, knowledgeItems] = await Promise.all([
    compileAndPersistPracticeGraph(supabase, lessonId, content),
    compileAndPersistKnowledge(supabase, lessonId, content),
  ]);

  return { lessonId, content, practiceGraph, knowledgeItems };
}

export async function confirmLessonFromParsed(
  lessonId: string,
  parsed: Parameters<typeof buildConfirmedContent>[0],
) {
  return confirmLesson(lessonId, buildConfirmedContent(parsed));
}
