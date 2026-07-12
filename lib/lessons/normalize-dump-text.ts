export function normalizeDumpText(text: string): string {
  return text.trim();
}

export function validateDumpText(text: string): string | null {
  if (text.length < 10) {
    return "Please enter at least a few words about today's lesson.";
  }
  return null;
}
