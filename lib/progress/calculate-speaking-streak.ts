type SessionDayRow = {
  ended_at: string | null;
};

function toDayKey(iso: string): string {
  return iso.slice(0, 10);
}

/** Count consecutive calendar days with at least one completed session. */
export function calculateSpeakingStreak(sessionEndDates: string[]): number {
  if (sessionEndDates.length === 0) {
    return 0;
  }

  const uniqueDays = [...new Set(sessionEndDates.map(toDayKey))].sort().reverse();
  const today = toDayKey(new Date().toISOString());
  const yesterday = toDayKey(new Date(Date.now() - 86_400_000).toISOString());

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const current = new Date(`${uniqueDays[index - 1]}T12:00:00Z`);
    const previous = new Date(`${uniqueDays[index]}T12:00:00Z`);
    const diffDays = Math.round((current.getTime() - previous.getTime()) / 86_400_000);

    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function extractSessionEndDates(rows: SessionDayRow[]): string[] {
  return rows
    .map((row) => row.ended_at)
    .filter((value): value is string => typeof value === "string");
}
