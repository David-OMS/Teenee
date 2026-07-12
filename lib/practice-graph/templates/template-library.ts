import { classroomObjectsFlowTemplate } from "@/lib/practice-graph/templates/classroom-objects-flow-template";
import { explainLessonFlowTemplate } from "@/lib/practice-graph/templates/explain-lesson-flow-template";
import { greetingFlowTemplate } from "@/lib/practice-graph/templates/greeting-flow-template";
import type { PracticeTemplate } from "@/types/practice-template/practice-template";
import type { TemplateId } from "@/types/practice-template/template-id";

export const templateLibrary: PracticeTemplate[] = [
  greetingFlowTemplate,
  classroomObjectsFlowTemplate,
  explainLessonFlowTemplate,
];

export function getTemplateById(templateId: TemplateId): PracticeTemplate {
  const template = templateLibrary.find((item) => item.id === templateId);
  if (!template) {
    throw new Error(`Unknown template: ${templateId}`);
  }
  return template;
}
