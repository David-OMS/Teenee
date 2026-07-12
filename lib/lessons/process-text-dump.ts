import { createLessonId } from "@/lib/lessons/create-lesson-id";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { insertDraftLesson } from "@/lib/lessons/insert-draft-lesson";
import { parseLessonById } from "@/lib/lessons/parse-lesson-by-id";
import { normalizeDumpText, validateDumpText } from "@/lib/lessons/normalize-dump-text";
import { createServerClient } from "@/lib/supabase/create-server-client";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export type ProcessTextDumpInput = {
  text: string;
};

export type ProcessTextDumpResult = {
  lessonId: string;
  textContent: string;
  parsed: ParsedLessonSummary;
};

/** Orchestrator — save text dump → parse → parsed lesson. */
export async function processTextDump(
  input: ProcessTextDumpInput,
): Promise<ProcessTextDumpResult> {
  const textContent = normalizeDumpText(input.text);
  const validationError = validateDumpText(textContent);

  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = createServerClient();
  const userId = await getDefaultUserId(supabase);
  const lessonId = createLessonId();

  await insertDraftLesson(supabase, {
    lessonId,
    userId,
    raw: {
      inputType: "text",
      textContent,
      recordedAt: new Date().toISOString(),
    },
  });

  const parsed = await parseLessonById(lessonId);
  return { lessonId, textContent, parsed };
}
