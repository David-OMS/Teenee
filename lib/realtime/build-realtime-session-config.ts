import { readRealtimeModel, readRealtimeVoice } from "@/lib/realtime/read-realtime-config";
import type { AppSettings } from "@/lib/settings/app-settings";
import type { VoiceInputMode } from "@/types/conversation/voice-input-mode";

export function buildRealtimeSessionConfig(
  instructions: string,
  settings: AppSettings,
  voiceInputMode: VoiceInputMode = "auto",
) {
  const turnDetection =
    voiceInputMode === "push_to_talk"
      ? null
      : {
          type: "server_vad" as const,
          silence_duration_ms: settings.silenceTimeoutSeconds * 1000,
          prefix_padding_ms: 300,
          threshold: 0.5,
        };

  return {
    type: "realtime",
    model: readRealtimeModel(),
    instructions,
    truncation: {
      type: "retention_ratio",
      retention_ratio: 0.8,
      token_limits: {
        post_instructions: 4096,
      },
    },
    audio: {
      input: {
        turn_detection: turnDetection,
      },
      output: {
        voice: readRealtimeVoice(),
      },
    },
  };
}
