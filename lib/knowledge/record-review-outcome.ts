import { addDays, nextReviewIntervalDays } from "@/lib/knowledge/next-review-interval";
import { querySingle } from "@/lib/supabase/query-single";
import type { ServerClient } from "@/lib/supabase/create-server-client";

type ReviewRow = {
  id: string;
  concept_id: string;
  due_at: string;
  interval_days: number;
  success_count: number;
  failure_count: number;
  last_reviewed_at: string | null;
};

/** Advance or reset SRS interval after a review attempt. */
export async function recordReviewOutcome(
  supabase: ServerClient,
  reviewId: string,
  success: boolean,
): Promise<ReviewRow> {
  const review = await querySingle<ReviewRow>(
    supabase.from("reviews").select("*").eq("id", reviewId).single(),
    "Review not found",
  );

  const nextInterval = nextReviewIntervalDays(review.interval_days, success);
  const dueAt = addDays(new Date(), nextInterval);

  const { data, error } = await supabase
    .from("reviews")
    .update({
      interval_days: nextInterval,
      due_at: dueAt.toISOString(),
      success_count: success ? review.success_count + 1 : review.success_count,
      failure_count: success ? review.failure_count : review.failure_count + 1,
      last_reviewed_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Could not update review: ${error?.message ?? "Unknown error"}`);
  }

  return data;
}
