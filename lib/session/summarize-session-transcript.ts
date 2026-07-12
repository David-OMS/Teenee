import { callJsonChatCompletion } from "@/lib/openai/call-json-chat-completion";
import { buildSessionSummarizerPrompt } from "@/lib/session/build-session-summarizer-prompt";
import {
  emptySessionSummary,
  parseSessionSummary,
} from "@/lib/session/parse-session-summary";
import type { SessionSummaryPayload } from "@/types/session/session-summary-payload";

type SummarizeSessionInput = {
  lessonTitle: string;
  phase: string;
  transcriptSummary: string;
  nodesCovered: string[];
};

/** Generate structured session review via Chat Completions JSON mode. */
export async function summarizeSessionTranscript(
  input: SummarizeSessionInput,
): Promise<SessionSummaryPayload> {
  if (!input.transcriptSummary.trim()) {
    return emptySessionSummary();
  }

  const raw = await callJsonChatCompletion([
    {
      role: "system",
      content:
        "You are Teenee's session reviewer. Output valid JSON matching the requested schema.",
    },
    {
      role: "user",
      content: buildSessionSummarizerPrompt(input),
    },
  ]);

  return parseSessionSummary(raw);
}
