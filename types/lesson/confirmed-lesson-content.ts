import type { Difficulty } from "@/types/common/difficulty";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { ParsedExpressionItem } from "@/types/lesson/parsed-expression-item";
import type { ParsedGrammarItem } from "@/types/lesson/parsed-grammar-item";
import type { ParsedVocabularyItem } from "@/types/lesson/parsed-vocabulary-item";

/** Student-approved content — ground truth for Knowledge + Practice Graph compilers. */
export type ConfirmedLessonContent = {
  title: string;
  difficulty: Difficulty;
  vocabulary: ParsedVocabularyItem[];
  grammar: ParsedGrammarItem[];
  expressions: ParsedExpressionItem[];
  pronunciationTargets: string[];
  conversationPatterns: string[];
  confirmedAt: IsoDateTime;
};
