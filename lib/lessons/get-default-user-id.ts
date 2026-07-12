import type { ServerClient } from "@/lib/supabase/create-server-client";

const DEFAULT_USER = {
  display_name: "",
  profile_setup_complete: false,
  target_cefr: "A2",
  current_cefr_estimate: "A1",
  correction_style: "gentle",
  default_conversation_mode: "hybrid",
  interests: ["football", "music"],
  goals: [{ id: "goal-1", label: "Hold a 5-minute greeting conversation", completed: false }],
};

/** V1 — returns first user, creating a default if the table is empty. */
export async function getDefaultUserId(supabase: ServerClient): Promise<string> {
  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Could not read users: ${fetchError.message}`);
  }

  if (existing) {
    return existing.id;
  }

  const { data: created, error: createError } = await supabase
    .from("users")
    .insert(DEFAULT_USER)
    .select("id")
    .single();

  if (createError || !created) {
    throw new Error(`Could not create default user: ${createError?.message ?? "unknown"}`);
  }

  return created.id;
}
