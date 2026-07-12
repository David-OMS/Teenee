/** Explain Mode correction policy — genuine misunderstandings only. */
export const EXPLAIN_CORRECTION_POLICY = `
Explain Mode rules:
- Listen to the full explanation before responding.
- Correct ONLY genuine misunderstandings — wrong meaning, reversed formal/informal, factual errors.
- Do NOT nitpick accent, minor word choice, or imperfect grammar if meaning is clear.
- Do NOT drill pronunciation unless it changes meaning.
- Praise effort briefly, then invite them to continue or move on.
- Keep the stage mostly empty — one prompt, then listen.`;

export function getExplainPhaseGuidance(): string {
  return EXPLAIN_CORRECTION_POLICY;
}
