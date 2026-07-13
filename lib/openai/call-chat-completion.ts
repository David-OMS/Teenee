import { readOpenAiApiKey } from "@/lib/openai/read-openai-api-key";
import { readChatModel } from "@/lib/openai/read-chat-model";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function callChatCompletion(
  messages: ChatMessage[],
  options: { model?: string; temperature?: number } = {},
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${readOpenAiApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? readChatModel(),
      messages,
      temperature: options.temperature ?? 0.4,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI request failed: ${message}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  const content = data.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}
