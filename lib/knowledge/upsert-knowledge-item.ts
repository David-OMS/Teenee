import { defaultConceptConfidence } from "@/lib/knowledge/default-concept-confidence";
import { insertReviewSchedule } from "@/lib/knowledge/insert-review-schedule";
import type { ConceptDraft } from "@/lib/knowledge/build-concept-drafts-from-lesson";
import type { KnowledgePayload } from "@/lib/db/schema/knowledge-items";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { ConceptKind } from "@/types/knowledge/concept-kind";

type KnowledgeItemRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  kind: ConceptKind;
  label: string;
  mastery: number;
  confidence: ReturnType<typeof defaultConceptConfidence>;
  payload: KnowledgePayload;
  created_at: string;
  updated_at: string;
};

export async function findExistingKnowledgeItem(
  supabase: ServerClient,
  userId: string,
  kind: ConceptKind,
  normalizedForm: string,
): Promise<KnowledgeItemRow | null> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("id, user_id, lesson_id, kind, label, mastery, confidence, payload, created_at, updated_at")
    .eq("user_id", userId)
    .eq("kind", kind);

  if (error) {
    throw new Error(`Could not look up knowledge item: ${error.message}`);
  }

  const match = (data ?? []).find((item) => item.payload?.normalizedForm === normalizedForm);
  return match ?? null;
}

export async function insertKnowledgeItem(
  supabase: ServerClient,
  userId: string,
  lessonId: string,
  draft: ConceptDraft,
): Promise<KnowledgeItemRow> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      kind: draft.kind,
      label: draft.label,
      mastery: 0,
      confidence: defaultConceptConfidence(),
      payload: draft.payload,
    })
    .select("id, user_id, lesson_id, kind, label, mastery, confidence, payload, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Could not insert knowledge item: ${error?.message ?? "Unknown error"}`);
  }

  await insertReviewSchedule(supabase, data.id);
  return data;
}

export type { KnowledgeItemRow };
