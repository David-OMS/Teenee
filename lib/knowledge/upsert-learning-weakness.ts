import type { ServerClient } from "@/lib/supabase/create-server-client";

type UpsertWeaknessInput = {
  userId: string;
  conceptId?: string;
  category: "grammar" | "pronunciation" | "vocabulary" | "register";
  description: string;
};

export async function upsertLearningWeakness(
  supabase: ServerClient,
  input: UpsertWeaknessInput,
): Promise<void> {
  const { data: existing, error: lookupError } = await supabase
    .from("learning_weaknesses")
    .select("id, occurrence_count")
    .eq("user_id", input.userId)
    .eq("description", input.description)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Could not look up weakness: ${lookupError.message}`);
  }

  if (existing) {
    const { error } = await supabase
      .from("learning_weaknesses")
      .update({
        occurrence_count: existing.occurrence_count + 1,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        concept_id: input.conceptId ?? null,
      })
      .eq("id", existing.id);

    if (error) {
      throw new Error(`Could not update weakness: ${error.message}`);
    }
    return;
  }

  const { error } = await supabase.from("learning_weaknesses").insert({
    user_id: input.userId,
    concept_id: input.conceptId ?? null,
    category: input.category,
    description: input.description,
  });

  if (error) {
    throw new Error(`Could not insert weakness: ${error.message}`);
  }
}
