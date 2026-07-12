export const DEFAULT_REALTIME_MODEL = "gpt-realtime-2.1";

/** Female-leaning Realtime voices: coral, shimmer, sage */
export const DEFAULT_REALTIME_VOICE = "coral";

export function readRealtimeModel(): string {
  return process.env.OPENAI_REALTIME_MODEL ?? DEFAULT_REALTIME_MODEL;
}

export function readRealtimeVoice(): string {
  return process.env.OPENAI_REALTIME_VOICE ?? DEFAULT_REALTIME_VOICE;
}
