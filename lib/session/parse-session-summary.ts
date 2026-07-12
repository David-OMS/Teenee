import type { SessionSummaryPayload } from "@/types/session/session-summary-payload";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function clampScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 50;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function parseSessionSummary(raw: string): SessionSummaryPayload {
  const parsed = JSON.parse(raw) as Partial<SessionSummaryPayload>;

  return {
    grammarMistakes: asStringArray(parsed.grammarMistakes),
    pronunciationImprovements: asStringArray(parsed.pronunciationImprovements),
    vocabularyUsed: asStringArray(parsed.vocabularyUsed),
    expressionsIntroduced: asStringArray(parsed.expressionsIntroduced),
    speakingScore: clampScore(parsed.speakingScore),
    suggestedRevision: asStringArray(parsed.suggestedRevision),
    nextSessionRecommendations: asStringArray(parsed.nextSessionRecommendations),
    conceptOutcomes: Array.isArray(parsed.conceptOutcomes)
      ? parsed.conceptOutcomes
          .filter(
            (item): item is { label: string; success: boolean } =>
              typeof item === "object" &&
              item !== null &&
              typeof (item as { label?: unknown }).label === "string" &&
              typeof (item as { success?: unknown }).success === "boolean",
          )
          .map((item) => ({ label: item.label.trim(), success: item.success }))
      : [],
  };
}

export function emptySessionSummary(): SessionSummaryPayload {
  return {
    grammarMistakes: [],
    pronunciationImprovements: [],
    vocabularyUsed: [],
    expressionsIntroduced: [],
    speakingScore: 0,
    suggestedRevision: [],
    nextSessionRecommendations: ["Dump today's class notes, then explain and practice."],
    conceptOutcomes: [],
  };
}
