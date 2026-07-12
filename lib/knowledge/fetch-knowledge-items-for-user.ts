import {
  mapKnowledgeRowToItem,
  type KnowledgeItemQueryRow,
} from "@/lib/knowledge/map-knowledge-row-to-item";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";

const knowledgeSelect = `
  id, user_id, lesson_id, kind, label, mastery, confidence, payload, created_at, updated_at,
  reviews (id, due_at, interval_days, success_count, failure_count, last_reviewed_at)
`;

export async function fetchKnowledgeItemsForUser(
  supabase: ServerClient,
  userId: string,
  lessonId?: string,
): Promise<KnowledgeItem[]> {
  let query = supabase
    .from("knowledge_items")
    .select(knowledgeSelect)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (lessonId) {
    query = query.eq("lesson_id", lessonId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Could not load knowledge items: ${error.message}`);
  }

  return ((data ?? []) as KnowledgeItemQueryRow[]).map(mapKnowledgeRowToItem);
}
