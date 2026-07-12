import type { ServerClient } from "@/lib/supabase/create-server-client";

export async function insertDevUser(supabase: ServerClient) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      display_name: "",
      profile_setup_complete: false,
      target_cefr: "A2",
      current_cefr_estimate: "A1",
      correction_style: "gentle",
      default_conversation_mode: "hybrid",
      interests: ["football", "music"],
      goals: [{ id: "goal-1", label: "Hold a 5-minute greeting conversation", completed: false }],
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
