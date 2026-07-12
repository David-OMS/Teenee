import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export type TextDumpSubmitResult = {
  lessonId: string;
  textContent: string;
  parsed: ParsedLessonSummary;
};

export async function submitTextDump(text: string): Promise<TextDumpSubmitResult> {
  const response = await fetch("/api/lessons/dump/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const payload = (await response.json()) as TextDumpSubmitResult & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Submit failed.");
  }

  return payload;
}
