import type { Difficulty } from "@/types/common/difficulty";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { ParsedExpressionItem } from "@/types/lesson/parsed-expression-item";
import type { ParsedGrammarItem } from "@/types/lesson/parsed-grammar-item";
import type { ParsedVocabularyItem } from "@/types/lesson/parsed-vocabulary-item";

/** AI extraction output — unconfirmed until the student reviews. */
export type ParsedLessonSummary = {
  title: string;
  difficulty: Difficulty;
  vocabulary: ParsedVocabularyItem[];
  grammar: ParsedGrammarItem[];
  expressions: ParsedExpressionItem[];
  pronunciationTargets: string[];
  conversationPatterns: string[];
  transcript?: string;
  parsedAt: IsoDateTime;
};
