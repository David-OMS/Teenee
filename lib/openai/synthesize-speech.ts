import { readOpenAiApiKey } from "@/lib/openai/read-openai-api-key";
import { readTtsModel, readTtsVoice } from "@/lib/openai/read-tts-config";

/** Synthesize speech from text — returns MP3 bytes. */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${readOpenAiApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: readTtsModel(),
      voice: readTtsVoice(),
      input: text,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Speech synthesis failed: ${message}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
