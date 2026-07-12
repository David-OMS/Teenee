import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";

export function buildPronunciationFocus(content: ConfirmedLessonContent): string {
  if (content.pronunciationTargets.length > 0) {
    return content.pronunciationTargets[0];
  }

  const firstWord = content.vocabulary[0]?.french ?? content.expressions[0]?.french;
  return firstWord ?? "general French pronunciation";
}
