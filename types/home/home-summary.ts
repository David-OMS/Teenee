import type { CefrLevel } from "@/types/common/cefr-level";
import type { WordOfTheDay } from "@/types/home/word-of-the-day";

export type HomeSummary = {
  displayName: string;
  profileSetupComplete: boolean;
  currentLevel: CefrLevel;
  targetLevel: CefrLevel;
  wordOfTheDay: WordOfTheDay;
  streakDays: number;
  speakingTimeLabel: string;
  nextSessionRecommendation: string | null;
  hasLessons: boolean;
  latestLessonTitle: string | null;
  latestLessonAction: { href: string; label: string } | null;
};
