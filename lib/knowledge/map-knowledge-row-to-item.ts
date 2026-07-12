import type { KnowledgeItemRow } from "@/lib/knowledge/upsert-knowledge-item";
import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";
import type { MasteryLevel } from "@/types/knowledge/mastery-level";
import type { ReviewSchedule } from "@/types/knowledge/review-schedule";

type ReviewJoinRow = {
  id: string;
  due_at: string;
  interval_days: number;
  success_count: number;
  failure_count: number;
  last_reviewed_at: string | null;
};

type KnowledgeItemQueryRow = KnowledgeItemRow & {
  reviews: ReviewJoinRow[] | ReviewJoinRow | null;
};

function pickReview(reviews: ReviewJoinRow[] | ReviewJoinRow | null): ReviewJoinRow | null {
  if (!reviews) {
    return null;
  }

  return Array.isArray(reviews) ? (reviews[0] ?? null) : reviews;
}

function mapReviewSchedule(review: ReviewJoinRow): ReviewSchedule {
  return {
    id: review.id,
    conceptId: "",
    dueAt: review.due_at,
    intervalDays: review.interval_days,
    successCount: review.success_count,
    failureCount: review.failure_count,
    lastReviewedAt: review.last_reviewed_at ?? undefined,
  };
}

export function mapKnowledgeRowToItem(row: KnowledgeItemQueryRow): KnowledgeItem {
  const review = pickReview(row.reviews);
  const base = {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    kind: row.kind,
    label: row.label,
    mastery: row.mastery as MasteryLevel,
    confidence: row.confidence,
    reviewScheduleId: review?.id ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.kind === "vocabulary") {
    return {
      ...base,
      kind: "vocabulary",
      french: row.payload.french ?? row.label,
      english: row.payload.english ?? "",
      normalizedForm: row.payload.normalizedForm ?? row.label,
    };
  }

  if (row.kind === "grammar") {
    return {
      ...base,
      kind: "grammar",
      topic: row.payload.topic ?? row.label,
      description: row.payload.description ?? "",
      commonMistakes: row.payload.commonMistakes ?? [],
    };
  }

  return {
    ...base,
    kind: "expression",
    french: row.payload.french ?? row.label,
    english: row.payload.english ?? "",
    register: row.payload.register ?? "neutral",
  };
}

export function mapReviewWithConceptId(
  review: ReviewJoinRow,
  conceptId: string,
): ReviewSchedule {
  return {
    ...mapReviewSchedule(review),
    conceptId,
  };
}

export type { KnowledgeItemQueryRow };
