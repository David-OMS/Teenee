import { mapReviewWithConceptId } from "@/lib/knowledge/map-knowledge-row-to-item";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { ReviewSchedule } from "@/types/knowledge/review-schedule";

type DueReviewRow = {
  id: string;
  concept_id: string;
  due_at: string;
  interval_days: number;
  success_count: number;
  failure_count: number;
  last_reviewed_at: string | null;
};

export async function fetchDueReviews(
  supabase: ServerClient,
  userId: string,
): Promise<ReviewSchedule[]> {
  const { data: concepts, error: conceptError } = await supabase
    .from("knowledge_items")
    .select("id")
    .eq("user_id", userId);

  if (conceptError) {
    throw new Error(`Could not load concepts for reviews: ${conceptError.message}`);
  }

  const conceptIds = (concepts ?? []).map((concept) => concept.id);
  if (conceptIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, concept_id, due_at, interval_days, success_count, failure_count, last_reviewed_at")
    .in("concept_id", conceptIds)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true });

  if (error) {
    throw new Error(`Could not load due reviews: ${error.message}`);
  }

  return ((data ?? []) as DueReviewRow[]).map((review) =>
    mapReviewWithConceptId(review, review.concept_id),
  );
}
