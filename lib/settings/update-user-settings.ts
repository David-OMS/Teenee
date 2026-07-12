import type { AppSettingsPatch } from "@/lib/settings/app-settings";
import { fetchUserSettings } from "@/lib/settings/fetch-user-settings";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function updateUserSettings(patch: AppSettingsPatch) {
  const current = await fetchUserSettings();
  const supabase = createServerClient();

  const { error } = await supabase
    .from("users")
    .update({
      default_conversation_mode: patch.defaultConversationMode ?? current.defaultConversationMode,
      correction_style: patch.correctionStyle ?? current.correctionStyle,
      target_cefr: patch.targetCefr ?? current.targetCefr,
      silence_timeout_seconds: patch.silenceTimeoutSeconds ?? current.silenceTimeoutSeconds,
      trigger_phrases: patch.triggerPhrases ?? current.triggerPhrases,
      transcript_visible: patch.transcriptVisible ?? current.transcriptVisible,
      updated_at: new Date().toISOString(),
    })
    .eq("id", current.userId);

  if (error) {
    throw new Error(`Could not save settings: ${error.message}`);
  }

  return fetchUserSettings();
}
