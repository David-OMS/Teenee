import { applyMasteryDelta } from "@/lib/knowledge/apply-mastery-delta";
import { upsertLearningWeakness } from "@/lib/knowledge/upsert-learning-weakness";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { SessionSummaryPayload } from "@/types/session/session-summary-payload";

type KnowledgeItemRow = {
  id: string;
  label: string;
};

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase();
}

async function findKnowledgeItemByLabel(
  supabase: ServerClient,
  userId: string,
  label: string,
): Promise<KnowledgeItemRow | null> {
  const normalized = normalizeLabel(label);
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("id, label")
    .eq("user_id", userId);

  if (error || !data) {
    return null;
  }

  return (
    (data as KnowledgeItemRow[]).find((item) => normalizeLabel(item.label) === normalized) ?? null
  );
}

/** Apply mastery deltas and record weaknesses from session summary. */
export async function updateKnowledgeFromSession(
  supabase: ServerClient,
  userId: string,
  summary: SessionSummaryPayload,
): Promise<void> {
  for (const mistake of summary.grammarMistakes) {
    await upsertLearningWeakness(supabase, {
      userId,
      category: "grammar",
      description: mistake,
    });
  }

  for (const tip of summary.pronunciationImprovements) {
    await upsertLearningWeakness(supabase, {
      userId,
      category: "pronunciation",
      description: tip,
    });
  }

  for (const outcome of summary.conceptOutcomes) {
    const item = await findKnowledgeItemByLabel(supabase, userId, outcome.label);
    if (!item) {
      continue;
    }

    await applyMasteryDelta(supabase, item.id, outcome.success);
  }
}
