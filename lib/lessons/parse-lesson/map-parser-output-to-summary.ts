import { randomUUID } from "crypto";

import type { LessonParserOutput } from "@/lib/lessons/parse-lesson/build-lesson-parser-prompt";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export function mapParserOutputToSummary(
  output: LessonParserOutput,
  transcript?: string,
): ParsedLessonSummary {
  return {
    title: output.title,
    difficulty: output.difficulty,
    vocabulary: output.vocabulary.map((item) => ({
      id: randomUUID(),
      french: item.french,
      english: item.english,
      notes: item.notes,
    })),
    grammar: output.grammar.map((item) => ({
      id: randomUUID(),
      topic: item.topic,
      description: item.description,
      examples: item.examples,
    })),
    expressions: output.expressions.map((item) => ({
      id: randomUUID(),
      french: item.french,
      english: item.english,
      register: item.register,
    })),
    pronunciationTargets: output.pronunciationTargets,
    conversationPatterns: output.conversationPatterns,
    transcript,
    parsedAt: new Date().toISOString(),
  };
}
