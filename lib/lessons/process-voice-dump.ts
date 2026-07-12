import { guessAudioExtension } from "@/lib/audio/guess-audio-extension";
import { createLessonId } from "@/lib/lessons/create-lesson-id";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { insertDraftLesson } from "@/lib/lessons/insert-draft-lesson";
import { parseLessonById } from "@/lib/lessons/parse-lesson-by-id";
import { transcribeAudio } from "@/lib/openai/transcribe-audio";
import { createServerClient } from "@/lib/supabase/create-server-client";
import { buildLessonStorageKey } from "@/lib/storage/build-lesson-storage-key";
import { uploadLessonArtifact } from "@/lib/storage/upload-lesson-artifact";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

export type ProcessVoiceDumpInput = {
  audioBuffer: Buffer;
  mimeType: string;
  durationSeconds: number;
};

export type ProcessVoiceDumpResult = {
  lessonId: string;
  transcript: string;
  storageKey: string;
  parsed: ParsedLessonSummary;
};

/** Orchestrator — R2 upload → Whisper → parse → Supabase. */
export async function processVoiceDump(
  input: ProcessVoiceDumpInput,
): Promise<ProcessVoiceDumpResult> {
  const supabase = createServerClient();
  const userId = await getDefaultUserId(supabase);
  const lessonId = createLessonId();
  const extension = guessAudioExtension(input.mimeType);
  const filename = `dump.${extension}`;
  const storageKey = buildLessonStorageKey(userId, lessonId, "audio", filename);
  const recordedAt = new Date().toISOString();

  await uploadLessonArtifact({
    key: storageKey,
    body: input.audioBuffer,
    contentType: input.mimeType,
  });

  const transcript = await transcribeAudio({
    buffer: input.audioBuffer,
    filename,
    mimeType: input.mimeType,
  });

  await insertDraftLesson(supabase, {
    lessonId,
    userId,
    raw: {
      inputType: "voice",
      storageKey,
      audioDurationSeconds: input.durationSeconds,
      textContent: transcript,
      recordedAt,
    },
  });

  const parsed = await parseLessonById(lessonId);
  return { lessonId, transcript, storageKey, parsed };
}
