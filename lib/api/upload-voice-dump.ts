import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export type VoiceDumpUploadResult = {
  lessonId: string;
  transcript: string;
  storageKey: string;
  parsed: ParsedLessonSummary;
};

export async function uploadVoiceDump(
  audioBlob: Blob,
  durationSeconds: number,
): Promise<VoiceDumpUploadResult> {
  const formData = new FormData();
  const mimeType = audioBlob.type || "audio/webm";
  const extension = mimeType.includes("webm") ? "webm" : "m4a";

  formData.append("audio", audioBlob, `dump.${extension}`);
  formData.append("durationSeconds", String(durationSeconds));

  const response = await fetch("/api/lessons/dump/voice", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as VoiceDumpUploadResult & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Upload failed.");
  }

  return payload;
}
