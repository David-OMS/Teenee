import { scoreTemplateMatch } from "@/lib/practice-graph/score-template-match";
import { templateLibrary } from "@/lib/practice-graph/templates/template-library";
import type { TemplateDetectionResult } from "@/types/practice-template/template-detection-result";
import type { TemplateId } from "@/types/practice-template/template-id";
import type { TemplateInstantiationInput } from "@/types/practice-template/template-instantiation-input";

type ScoredTemplate = {
  id: TemplateId;
  score: number;
};

function pickSecondary(primary: ScoredTemplate, ranked: ScoredTemplate[]): TemplateId | undefined {
  const runnerUp = ranked[1];
  if (!runnerUp || runnerUp.score === 0) {
    return undefined;
  }

  if (runnerUp.score >= primary.score * 0.5) {
    return runnerUp.id;
  }

  return undefined;
}

/** Score templates against lesson content and pick primary (+ optional secondary). */
export function detectTemplate(input: TemplateInstantiationInput): TemplateDetectionResult {
  const ranked: ScoredTemplate[] = templateLibrary
    .map((template) => ({
      id: template.id,
      score: scoreTemplateMatch(template, input),
    }))
    .sort((left, right) => right.score - left.score);

  const primary = ranked[0]?.id ?? "greeting_flow";
  const primaryScore = ranked[0]?.score ?? 0;
  const totalScore = ranked.reduce((sum, item) => sum + item.score, 0);
  const confidence = totalScore > 0 ? primaryScore / totalScore : 0.3;

  return {
    primary,
    secondary: pickSecondary({ id: primary, score: primaryScore }, ranked),
    confidence,
  };
}
