export const DEFAULT_TTS_MODEL = "tts-1";
export const DEFAULT_TTS_VOICE = "coral";

export function readTtsModel(): string {
  return process.env.OPENAI_TTS_MODEL ?? DEFAULT_TTS_MODEL;
}

export function readTtsVoice(): string {
  return process.env.OPENAI_TTS_VOICE ?? DEFAULT_TTS_VOICE;
}
