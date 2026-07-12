/** Format lesson date for list rows — e.g. "Jul 12, 2026". */
export function formatLessonDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
