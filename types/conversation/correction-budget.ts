export type CorrectionBudget = {
  maxGrammar: number;
  maxPronunciation: number;
  grammarUsed: number;
  pronunciationUsed: number;
};

export const DEFAULT_CORRECTION_BUDGET: CorrectionBudget = {
  maxGrammar: 1,
  maxPronunciation: 1,
  grammarUsed: 0,
  pronunciationUsed: 0,
};
