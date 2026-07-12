type BuildSummarizerPromptInput = {
  lessonTitle: string;
  phase: string;
  transcriptSummary: string;
  nodesCovered: string[];
};

export function buildSessionSummarizerPrompt(input: BuildSummarizerPromptInput): string {
  const nodes = input.nodesCovered.length > 0 ? input.nodesCovered.join(", ") : "unknown";

  return [
    "You analyze French learning voice sessions for Teenee.",
    "Return JSON only with this shape:",
    "{",
    '  "grammarMistakes": string[],',
    '  "pronunciationImprovements": string[],',
    '  "vocabularyUsed": string[],',
    '  "expressionsIntroduced": string[],',
    '  "speakingScore": number,',
    '  "suggestedRevision": string[],',
    '  "nextSessionRecommendations": string[],',
    '  "conceptOutcomes": [{ "label": string, "success": boolean }]',
    "}",
    "",
    "Rules:",
    "- speakingScore is 0-100 based on fluency, accuracy, and effort.",
    "- grammarMistakes: short French-focused notes (e.g. 'past tense with avoir').",
    "- pronunciationImprovements: actionable tips, not harsh criticism.",
    "- vocabularyUsed / expressionsIntroduced: French forms the learner used or was taught.",
    "- suggestedRevision: 2-4 concrete items to revisit tomorrow.",
    "- nextSessionRecommendations: 1-3 actionable next steps (dump, explain, drill).",
    "- conceptOutcomes: one entry per practice node or vocab item touched; success=true if used well.",
    "",
    `Lesson: ${input.lessonTitle}`,
    `Phase: ${input.phase}`,
    `Practice nodes covered: ${nodes}`,
    "",
    "Transcript:",
    input.transcriptSummary || "(No transcript captured — infer lightly from context.)",
  ].join("\n");
}
