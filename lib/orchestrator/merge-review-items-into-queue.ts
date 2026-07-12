import type { AgendaItem } from "@/types/session/agenda-item";

const reviewInsertInterval = 4;
const maxReviewItems = 3;

/** Weave cross-lesson review items into today's primary queue. */
export function mergeReviewItemsIntoQueue(
  lessonItems: AgendaItem[],
  reviewItems: AgendaItem[],
): AgendaItem[] {
  if (reviewItems.length === 0) {
    return lessonItems;
  }

  const cappedReviews = reviewItems.slice(0, maxReviewItems);
  const merged: AgendaItem[] = [];
  let reviewIndex = 0;

  for (let index = 0; index < lessonItems.length; index += 1) {
    merged.push(lessonItems[index]);

    const isInsertPoint = (index + 1) % reviewInsertInterval === 0;
    if (isInsertPoint && reviewIndex < cappedReviews.length) {
      merged.push(cappedReviews[reviewIndex]);
      reviewIndex += 1;
    }
  }

  while (reviewIndex < cappedReviews.length) {
    merged.push(cappedReviews[reviewIndex]);
    reviewIndex += 1;
  }

  return merged;
}
