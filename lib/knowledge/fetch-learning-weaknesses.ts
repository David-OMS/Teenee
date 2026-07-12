import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { LearningWeakness } from "@/types/knowledge/learning-weakness";

type WeaknessRow = {
  id: string;
  user_id: string;
  concept_id: string | null;
  category: LearningWeakness["category"];
  description: string;
  occurrence_count: number;
  last_seen_at: string;
};

export async function fetchLearningWeaknesses(
  supabase: ServerClient,
  userId: string,
): Promise<LearningWeakness[]> {
  const { data, error } = await supabase
    .from("learning_weaknesses")
    .select("id, user_id, concept_id, category, description, occurrence_count, last_seen_at")
    .eq("user_id", userId)
    .order("occurrence_count", { ascending: false });

  if (error) {
    throw new Error(`Could not load weaknesses: ${error.message}`);
  }

  return ((data ?? []) as WeaknessRow[]).map((row) => ({
    id: row.id,
    userId: row.user_id,
    conceptId: row.concept_id ?? undefined,
    category: row.category,
    description: row.description,
    occurrenceCount: row.occurrence_count,
    lastSeenAt: row.last_seen_at,
  }));
}
