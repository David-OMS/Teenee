import type { CefrLevel } from "@/types/common/cefr-level";
import type { EntityId } from "@/types/common/entity-id";
import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";
import type { LearningWeakness } from "@/types/knowledge/learning-weakness";
import type { ReviewSchedule } from "@/types/knowledge/review-schedule";

/** Fetched by the orchestrator before building a session agenda. */
export type KnowledgeSnapshot = {
  userId: EntityId;
  todayLessonId?: EntityId;
  items: KnowledgeItem[];
  dueReviews: ReviewSchedule[];
  weaknesses: LearningWeakness[];
  estimatedCefr: CefrLevel;
};
