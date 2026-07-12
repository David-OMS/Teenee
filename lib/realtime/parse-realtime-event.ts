export type TranscriptLine = {
  role: "user" | "assistant";
  text: string;
};

export function appendTranscriptDelta(
  lines: TranscriptLine[],
  role: "user" | "assistant",
  delta: string,
): TranscriptLine[] {
  if (!delta) {
    return lines;
  }

  const last = lines.at(-1);
  if (last?.role === role) {
    return [...lines.slice(0, -1), { role, text: last.text + delta }];
  }

  return [...lines, { role, text: delta }];
}

export function extractTranscriptFromEvent(event: Record<string, unknown>): TranscriptLine[] {
  const type = String(event.type ?? "");

  if (type === "response.output_audio_transcript.delta") {
    const delta = String(event.delta ?? "");
    return [{ role: "assistant", text: delta }];
  }

  if (type === "conversation.item.input_audio_transcription.completed") {
    const transcript = String(event.transcript ?? "");
    return transcript ? [{ role: "user", text: transcript }] : [];
  }

  if (type === "response.output_text.delta") {
    const delta = String(event.delta ?? "");
    return [{ role: "assistant", text: delta }];
  }

  return [];
}

export function isAssistantTurnComplete(event: Record<string, unknown>): boolean {
  return String(event.type ?? "") === "response.done";
}

export function isUserSpeechCommitted(event: Record<string, unknown>): boolean {
  const type = String(event.type ?? "");
  return (
    type === "conversation.item.input_audio_transcription.completed" ||
    type === "input_audio_buffer.committed"
  );
}
