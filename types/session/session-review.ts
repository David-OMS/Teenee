import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";

export type SessionReview = {
  sessionId: EntityId;
  grammarMistakes: string[];
  pronunciationImprovements: string[];
  vocabularyUsed: string[];
  expressionsIntroduced: string[];
  speakingScore: number;
  suggestedRevision: string[];
  nextSessionRecommendations: string[];
  summarizedAt: IsoDateTime;
  transcriptSummary?: string;
  nodesCovered?: string[];
  correctionsMade?: number;
};
