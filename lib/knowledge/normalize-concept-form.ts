/** Normalize French text for dedupe lookups. */
export function normalizeConceptForm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
