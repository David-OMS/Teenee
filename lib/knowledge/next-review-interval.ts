import { REVIEW_INTERVALS_DAYS } from "@/types/knowledge/review-intervals";
import type { ReviewIntervalDay } from "@/types/knowledge/review-intervals";

export function nextReviewIntervalDays(currentIntervalDays: number, success: boolean): number {
  if (!success) {
    return REVIEW_INTERVALS_DAYS[0];
  }

  const currentIndex = REVIEW_INTERVALS_DAYS.indexOf(currentIntervalDays as ReviewIntervalDay);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = Math.min(safeIndex + 1, REVIEW_INTERVALS_DAYS.length - 1);

  return REVIEW_INTERVALS_DAYS[nextIndex];
}

export function addDays(from: Date, days: number): Date {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next;
}
