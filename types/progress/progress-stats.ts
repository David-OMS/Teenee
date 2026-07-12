/** Aggregated learner activity for the Progress dashboard. */
export type ProgressStats = {
  speakingTimeSeconds: number;
  speakingTimeLabel: string;
  lessonCount: number;
  streakDays: number;
  weakestTopics: string[];
  strongestTopics: string[];
  nextSessionRecommendation: string | null;
};
