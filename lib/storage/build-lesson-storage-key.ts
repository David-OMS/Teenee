export type LessonArtifactKind = "audio" | "pdf" | "image" | "transcript";

/** Builds the R2 object key for a lesson artifact under /users/{userId}/lessons/. */
export function buildLessonStorageKey(
  userId: string,
  lessonId: string,
  kind: LessonArtifactKind,
  filename: string,
) {
  return `users/${userId}/lessons/${lessonId}/${kind}/${filename}`;
}
