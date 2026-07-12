export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30, 60] as const;

export type ReviewIntervalDay = (typeof REVIEW_INTERVALS_DAYS)[number];
