import { callChatCompletion } from "@/lib/openai/call-chat-completion";
import { synthesizeSpeech } from "@/lib/openai/synthesize-speech";
import { transcribeAudio } from "@/lib/openai/transcribe-audio";
import { buildInstructionsForSession } from "@/lib/realtime/build-instructions-for-session";
import { buildBudgetChatMessages } from "@/lib/voice/build-budget-chat-messages";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";

export type BudgetVoiceTurnInput = {
  sessionId: string;
  userId: string;
  currentItemId?: string;
  turnsOnNode?: number;
  promptOverride?: string;
  history: TranscriptLine[];
  audio?: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
  };
  opening?: boolean;
};

export type BudgetVoiceTurnResult = {
  userText: string | null;
  assistantText: string;
  audioBase64: string;
  mimeType: "audio/mpeg";
};

export async function runBudgetVoiceTurn(
  supabase: ServerClient,
  input: BudgetVoiceTurnInput,
): Promise<BudgetVoiceTurnResult> {
  const instructions = await buildInstructionsForSession(supabase, input.userId, input.sessionId, {
    currentItemId: input.currentItemId,
    turnsOnNode: input.turnsOnNode,
    promptOverride: input.promptOverride,
  });

  let userText: string | null = null;
  if (input.audio) {
    userText = await transcribeAudio(input.audio);
  }

  if (!input.opening && !userText?.trim()) {
    throw new Error("Could not understand your speech. Try again.");
  }

  const messages = buildBudgetChatMessages({
    stableInstructions: instructions.stable,
    turnBeat: instructions.turnBeat,
    history: input.history,
    userText: userText ?? undefined,
    opening: input.opening,
  });

  const assistantText = await callChatCompletion(messages);
  const audioBuffer = await synthesizeSpeech(assistantText);

  return {
    userText,
    assistantText,
    audioBase64: audioBuffer.toString("base64"),
    mimeType: "audio/mpeg",
  };
}
