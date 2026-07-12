import { recordReviewOutcome } from "@/lib/knowledge/record-review-outcome";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { SessionConceptOutcome } from "@/types/session/session-summary-payload";

type ReviewLookupRow = {
  id: string;
  concept_id: string;
  knowledge_items: { label: string } | { label: string }[] | null;
};

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase();
}

function labelFromJoin(
  knowledgeItems: ReviewLookupRow["knowledge_items"],
): string | null {
  if (!knowledgeItems) {
    return null;
  }

  if (Array.isArray(knowledgeItems)) {
    return knowledgeItems[0]?.label ?? null;
  }

  return knowledgeItems.label;
}

/** Advance or reset SRS intervals for concepts practiced in the session. */
export async function applySrsFromSession(
  supabase: ServerClient,
  userId: string,
  conceptOutcomes: SessionConceptOutcome[],
): Promise<void> {
  if (conceptOutcomes.length === 0) {
    return;
  }

  const { data: concepts, error: conceptError } = await supabase
    .from("knowledge_items")
    .select("id")
    .eq("user_id", userId);

  if (conceptError || !concepts || concepts.length === 0) {
    return;
  }

  const conceptIds = concepts.map((concept) => concept.id);
  const { data, error } = await supabase
    .from("reviews")
    .select("id, concept_id, knowledge_items(label)")
    .in("concept_id", conceptIds);

  if (error || !data) {
    return;
  }

  const outcomeByLabel = new Map(
    conceptOutcomes.map((outcome) => [normalizeLabel(outcome.label), outcome.success]),
  );

  for (const row of data as ReviewLookupRow[]) {
    const label = labelFromJoin(row.knowledge_items);
    if (!label) {
      continue;
    }

    const success = outcomeByLabel.get(normalizeLabel(label));
    if (success === undefined) {
      continue;
    }

    await recordReviewOutcome(supabase, row.id, success);
  }
}
