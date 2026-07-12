import { readRealtimeModel, readRealtimeVoice } from "@/lib/realtime/read-realtime-config";
import type { AppSettings } from "@/lib/settings/app-settings";

export function buildRealtimeSessionConfig(instructions: string, settings: AppSettings) {
  return {
    type: "realtime",
    model: readRealtimeModel(),
    instructions,
    audio: {
      input: {
        turn_detection: {
          type: "server_vad",
          silence_duration_ms: settings.silenceTimeoutSeconds * 1000,
          prefix_padding_ms: 300,
          threshold: 0.5,
        },
      },
      output: {
        voice: readRealtimeVoice(),
      },
    },
  };
}
