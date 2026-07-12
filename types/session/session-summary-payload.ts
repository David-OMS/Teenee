/** Structured output from the post-session summarizer. */
export type SessionConceptOutcome = {
  label: string;
  success: boolean;
};

export type SessionSummaryPayload = {
  grammarMistakes: string[];
  pronunciationImprovements: string[];
  vocabularyUsed: string[];
  expressionsIntroduced: string[];
  speakingScore: number;
  suggestedRevision: string[];
  nextSessionRecommendations: string[];
  conceptOutcomes: SessionConceptOutcome[];
};
