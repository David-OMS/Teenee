export const DEFAULT_CHAT_MODEL = "gpt-4.1-mini";

export function readChatModel(): string {
  return process.env.OPENAI_CHAT_MODEL ?? DEFAULT_CHAT_MODEL;
}
