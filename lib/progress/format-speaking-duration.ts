/** Format seconds as a human-readable speaking duration (e.g. "12m", "1h 5m"). */
export function formatSpeakingDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) {
    return "0m";
  }

  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}
