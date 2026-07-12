import { readOpenAiApiKey } from "@/lib/openai/read-openai-api-key";

export type TranscribeAudioInput = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
};

/** Sends audio to OpenAI Whisper and returns the transcript text. */
export async function transcribeAudio(input: TranscribeAudioInput): Promise<string> {
  const formData = new FormData();
  formData.append(
    "file",
    new File([new Uint8Array(input.buffer)], input.filename, { type: input.mimeType }),
  );
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${readOpenAiApiKey()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Transcription failed: ${message}`);
  }

  const data = (await response.json()) as { text: string };
  return data.text.trim();
}
