import { addDays } from "@/lib/knowledge/next-review-interval";
import type { ServerClient } from "@/lib/supabase/create-server-client";

export async function insertReviewSchedule(supabase: ServerClient, conceptId: string) {
  const dueAt = addDays(new Date(), 1);

  const { error } = await supabase.from("reviews").insert({
    concept_id: conceptId,
    due_at: dueAt.toISOString(),
    interval_days: 1,
    success_count: 0,
    failure_count: 0,
  });

  if (error) {
    throw new Error(`Could not create review schedule: ${error.message}`);
  }
}
