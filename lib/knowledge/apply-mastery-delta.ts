import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { ConceptConfidence } from "@/types/knowledge/concept-confidence";
import type { MasteryLevel } from "@/types/knowledge/mastery-level";

type KnowledgeItemRow = {
  id: string;
  mastery: number;
  confidence: ConceptConfidence;
};

function clampMastery(value: number): MasteryLevel {
  return Math.max(0, Math.min(5, Math.round(value))) as MasteryLevel;
}

function bumpConfidence(confidence: ConceptConfidence, success: boolean): ConceptConfidence {
  const delta = success ? 8 : -5;

  return {
    speaking: Math.max(0, Math.min(100, confidence.speaking + delta)),
    recognition: Math.max(0, Math.min(100, confidence.recognition + (success ? 4 : -2))),
    pronunciation: Math.max(0, Math.min(100, confidence.pronunciation + (success ? 4 : -2))),
  };
}

/** Shift mastery and confidence after a session attempt. */
export async function applyMasteryDelta(
  supabase: ServerClient,
  conceptId: string,
  success: boolean,
): Promise<void> {
  const { data: item, error: fetchError } = await supabase
    .from("knowledge_items")
    .select("id, mastery, confidence")
    .eq("id", conceptId)
    .single();

  if (fetchError || !item) {
    return;
  }

  const row = item as KnowledgeItemRow;
  const masteryDelta = success ? 1 : row.mastery > 0 ? -1 : 0;

  const { error } = await supabase
    .from("knowledge_items")
    .update({
      mastery: clampMastery(row.mastery + masteryDelta),
      confidence: bumpConfidence(row.confidence, success),
      updated_at: new Date().toISOString(),
    })
    .eq("id", conceptId);

  if (error) {
    throw new Error(`Could not update mastery: ${error.message}`);
  }
}
