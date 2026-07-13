import type { ChatMessage } from "@/lib/openai/call-chat-completion";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";

const MAX_HISTORY_TURNS = 8;

export function buildBudgetChatMessages(input: {
  stableInstructions: string;
  turnBeat: string;
  history: TranscriptLine[];
  userText?: string;
  opening?: boolean;
}): ChatMessage[] {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `${input.stableInstructions}\n\n${input.turnBeat}`,
    },
  ];

  const recentHistory = input.history.slice(-MAX_HISTORY_TURNS * 2);
  for (const line of recentHistory) {
    messages.push({
      role: line.role === "user" ? "user" : "assistant",
      content: line.text,
    });
  }

  if (input.opening) {
    messages.push({
      role: "user",
      content:
        "Start the practice turn now. ONE short French phrase or question from the knowledge base, then stop.",
    });
    return messages;
  }

  if (input.userText?.trim()) {
    messages.push({
      role: "user",
      content: input.userText.trim(),
    });
  }

  return messages;
}
