import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { TemplateSlotKind } from "@/types/practice-template/template-id";

export type SlotPhraseValues = {
  placeholders: Record<string, string>;
  conceptIds: string[];
};

function pickFormalInformal(content: ConfirmedLessonContent) {
  const formal =
    content.expressions.find((item) => item.register === "formal") ?? content.expressions[0];
  const informal =
    content.expressions.find((item) => item.register === "informal") ?? content.expressions[1];

  return { formal, informal };
}

function pickVocab(content: ConfirmedLessonContent, index: number) {
  return content.vocabulary[index] ?? content.vocabulary[0];
}

function collectConceptIds(content: ConfirmedLessonContent): string[] {
  return [
    ...content.vocabulary.slice(0, 3).map((item) => item.id),
    ...content.expressions.slice(0, 2).map((item) => item.id),
    ...content.grammar.slice(0, 1).map((item) => item.id),
  ];
}

/** Resolve placeholder values for a template slot from confirmed lesson content. */
export function resolveSlotPhrases(
  slotKind: TemplateSlotKind,
  content: ConfirmedLessonContent,
): SlotPhraseValues {
  const primary = content.expressions[0] ?? content.vocabulary[0];
  const secondary = content.expressions[1] ?? content.vocabulary[1] ?? primary;
  const variation = content.vocabulary[2] ?? content.vocabulary[1] ?? primary;
  const close = content.vocabulary[content.vocabulary.length - 1] ?? primary;
  const { formal, informal } = pickFormalInformal(content);
  const objectOne = pickVocab(content, 0);
  const objectTwo = pickVocab(content, 1) ?? objectOne;
  const objectNew = pickVocab(content, 2) ?? objectTwo;
  const topic = content.grammar[0]?.topic ?? content.title;

  const placeholders: Record<string, string> = {
    phrase: primary?.french ?? "Bonjour",
    phrase_en: primary?.english ?? "Hello",
    ask_back: secondary?.french ?? "Comment allez-vous ?",
    ask_back_en: secondary?.english ?? "How are you?",
    formal: formal?.french ?? "Comment allez-vous ?",
    formal_en: formal?.english ?? "How are you? (formal)",
    informal: informal?.french ?? "Comment vas-tu ?",
    informal_en: informal?.english ?? "How are you? (informal)",
    variation: variation?.french ?? "Salut",
    variation_en: variation?.english ?? "Hi",
    close: close?.french ?? "Au revoir",
    close_en: close?.english ?? "Goodbye",
    object: objectOne?.french ?? "le crayon",
    object_en: objectOne?.english ?? "the pencil",
    object_two: objectTwo?.french ?? objectOne?.french ?? "le livre",
    object_two_en: objectTwo?.english ?? objectOne?.english ?? "the book",
    object_new: objectNew?.french ?? "la gomme",
    object_new_en: objectNew?.english ?? "the eraser",
    topic,
    lesson_title: content.title,
  };

  if (slotKind === "student_answers") {
    placeholders.phrase = placeholders.object;
    placeholders.phrase_en = placeholders.object_en;
  }

  return {
    placeholders,
    conceptIds: collectConceptIds(content),
  };
}
