import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { TemplateInstantiationInput } from "@/types/practice-template/template-instantiation-input";

export function buildTemplateInstantiationInput(
  content: ConfirmedLessonContent,
): TemplateInstantiationInput {
  return {
    templateId: "greeting_flow",
    lessonTitle: content.title,
    vocabulary: content.vocabulary.map((item) => ({
      french: item.french,
      english: item.english,
    })),
    grammar: content.grammar.map((item) => ({
      topic: item.topic,
      description: item.description,
    })),
    expressions: content.expressions.map((item) => ({
      french: item.french,
      english: item.english,
      register: item.register,
    })),
    pronunciationTargets: content.pronunciationTargets,
  };
}
