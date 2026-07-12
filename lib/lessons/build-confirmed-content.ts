import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export function buildConfirmedContent(parsed: ParsedLessonSummary): ConfirmedLessonContent {
  return {
    title: parsed.title,
    difficulty: parsed.difficulty,
    vocabulary: parsed.vocabulary,
    grammar: parsed.grammar,
    expressions: parsed.expressions,
    pronunciationTargets: parsed.pronunciationTargets,
    conversationPatterns: parsed.conversationPatterns,
    confirmedAt: new Date().toISOString(),
  };
}
