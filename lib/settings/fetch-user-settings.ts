import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import type { AppSettings } from "@/lib/settings/app-settings";
import { createServerClient } from "@/lib/supabase/create-server-client";
import { querySingle } from "@/lib/supabase/query-single";
import { DEFAULT_TURN_DETECTION } from "@/types/conversation/turn-detection-config";
import type { ConversationMode } from "@/types/conversation/conversation-mode";
import type { CorrectionStyle } from "@/types/user/correction-style";

type UserSettingsRow = {
  id: string;
  default_conversation_mode: string;
  correction_style: string;
  target_cefr: string;
  silence_timeout_seconds: number | null;
  trigger_phrases: string[] | null;
  transcript_visible: boolean | null;
};

export async function fetchUserSettings(): Promise<AppSettings> {
  const supabase = createServerClient();
  const userId = await getDefaultUserId(supabase);

  const data = await querySingle<UserSettingsRow>(
    supabase
      .from("users")
      .select(
        "id, default_conversation_mode, correction_style, target_cefr, silence_timeout_seconds, trigger_phrases, transcript_visible",
      )
      .eq("id", userId)
      .single(),
    "Could not load settings",
  );

  return {
    userId: data.id,
    defaultConversationMode: data.default_conversation_mode as ConversationMode,
    correctionStyle: data.correction_style as CorrectionStyle,
    targetCefr: data.target_cefr,
    silenceTimeoutSeconds:
      data.silence_timeout_seconds ?? DEFAULT_TURN_DETECTION.silenceTimeoutSeconds,
    triggerPhrases: data.trigger_phrases ?? DEFAULT_TURN_DETECTION.triggerPhrases,
    transcriptVisible: data.transcript_visible ?? false,
  };
}
