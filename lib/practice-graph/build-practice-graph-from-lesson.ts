import { buildTemplateInstantiationInput } from "@/lib/practice-graph/build-template-instantiation-input";
import { compilePracticeGraph } from "@/lib/practice-graph/compile-practice-graph";
import { detectTemplate } from "@/lib/practice-graph/detect-template";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { TemplateId } from "@/types/practice-template/template-id";

function collectTemplateIds(primary: TemplateId, secondary?: TemplateId): TemplateId[] {
  return secondary ? [primary, secondary] : [primary];
}

/** Detect templates and compile a full Practice Graph from confirmed lesson content. */
export function buildPracticeGraphFromLesson(
  lessonId: string,
  userId: string,
  content: ConfirmedLessonContent,
): PracticeGraph {
  const input = buildTemplateInstantiationInput(content);
  const detection = detectTemplate(input);
  const templateIds = collectTemplateIds(detection.primary, detection.secondary);

  return compilePracticeGraph(lessonId, userId, content, templateIds);
}
