import type { KnowledgePayload } from "@/lib/db/schema/knowledge-items";
import { normalizeConceptForm } from "@/lib/knowledge/normalize-concept-form";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { ConceptKind } from "@/types/knowledge/concept-kind";

export type ConceptDraft = {
  kind: ConceptKind;
  label: string;
  payload: KnowledgePayload;
  lessonItemId: string;
};

export function buildConceptDraftsFromLesson(content: ConfirmedLessonContent): ConceptDraft[] {
  const vocabulary = content.vocabulary.map((item) => ({
    kind: "vocabulary" as const,
    label: item.french,
    lessonItemId: item.id,
    payload: {
      french: item.french,
      english: item.english,
      normalizedForm: normalizeConceptForm(item.french),
    },
  }));

  const grammar = content.grammar.map((item) => ({
    kind: "grammar" as const,
    label: item.topic,
    lessonItemId: item.id,
    payload: {
      topic: item.topic,
      description: item.description,
      normalizedForm: normalizeConceptForm(item.topic),
      commonMistakes: item.examples,
    },
  }));

  const expressions = content.expressions.map((item) => ({
    kind: "expression" as const,
    label: item.french,
    lessonItemId: item.id,
    payload: {
      french: item.french,
      english: item.english,
      normalizedForm: normalizeConceptForm(item.french),
      register: item.register ?? "neutral",
    },
  }));

  return [...vocabulary, ...grammar, ...expressions];
}
