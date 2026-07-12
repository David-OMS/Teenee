import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { CefrLevel } from "@/types/common/cefr-level";
import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";
import type { KnowledgeSnapshot } from "@/types/knowledge/knowledge-snapshot";

export type KnowledgeComplexity = "minimal" | "building" | "conversational";

export type KnowledgeBaseScope = {
  allowedFrench: string[];
  todayFrench: string[];
  grammarTopics: string[];
  phraseCount: number;
  confirmedLessonCount: number;
  estimatedCefr: CefrLevel;
  targetCefr: CefrLevel;
  complexity: KnowledgeComplexity;
};

function uniquePhrases(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function frenchFromItem(item: KnowledgeItem): string | null {
  if (item.kind === "grammar") {
    return null;
  }

  return item.french;
}

function phrasesFromLesson(lesson: ConfirmedLessonContent): string[] {
  return uniquePhrases([
    ...lesson.vocabulary.map((item) => item.french),
    ...lesson.expressions.map((item) => item.french),
  ]);
}

function deriveComplexity(phraseCount: number, lessonCount: number): KnowledgeComplexity {
  if (phraseCount <= 12 || lessonCount <= 1) {
    return "minimal";
  }

  if (phraseCount <= 35) {
    return "building";
  }

  return "conversational";
}

/** Build allow-list from the full knowledge graph — grows with every confirmed dump. */
export function buildKnowledgeBaseScope(input: {
  knowledge: KnowledgeSnapshot;
  todayLesson: ConfirmedLessonContent;
  targetCefr: string;
  confirmedLessonCount: number;
}): KnowledgeBaseScope {
  const allowedFrench = uniquePhrases(
    input.knowledge.items
      .map(frenchFromItem)
      .filter((phrase): phrase is string => Boolean(phrase)),
  );

  const todayFrench = phrasesFromLesson(input.todayLesson);

  const grammarTopics = uniquePhrases(
    input.knowledge.items
      .filter((item) => item.kind === "grammar")
      .map((item) => (item.kind === "grammar" ? item.topic : "")),
  );

  const phraseCount = allowedFrench.length;

  return {
    allowedFrench,
    todayFrench,
    grammarTopics,
    phraseCount,
    confirmedLessonCount: input.confirmedLessonCount,
    estimatedCefr: input.knowledge.estimatedCefr,
    targetCefr: input.targetCefr as CefrLevel,
    complexity: deriveComplexity(phraseCount, input.confirmedLessonCount),
  };
}

function formatComplexityGuidance(scope: KnowledgeBaseScope): string {
  switch (scope.complexity) {
    case "minimal":
      return [
        "Session complexity: MINIMAL (small knowledge base).",
        "- ONE phrase or ONE short question per turn, then stop and listen.",
        "- Greeting ping-pong: rotate phrases from the list — greet, respond, greet, respond.",
        "- English ONLY if the student is stuck on a phrase they already learned.",
      ].join("\n");
    case "building":
      return [
        "Session complexity: BUILDING (knowledge base growing).",
        "- Short sentences (max 2) combining phrases from the knowledge base only.",
        "- Prioritize today's focus phrases; weave in prior dumps when natural.",
        "- English only to clarify or correct — not after every line.",
      ].join("\n");
    case "conversational":
      return [
        "Session complexity: CONVERSATIONAL (rich knowledge base).",
        "- Natural dialogue, but every content word must come from the knowledge base.",
        "- Combine vocabulary across lessons (e.g. greetings + work + feelings) because the student dumped them.",
        "- Still one turn at a time — no monologues.",
      ].join("\n");
  }
}

export function formatKnowledgeScopeInstructions(scope: KnowledgeBaseScope): string {
  const allFrench = scope.allowedFrench.map((phrase) => `- ${phrase}`).join("\n");
  const todayFrench =
    scope.todayFrench.length > 0
      ? scope.todayFrench.map((phrase) => `- ${phrase}`).join("\n")
      : "- (none listed)";

  return [
    "KNOWLEDGE BASE RULE (always — non-negotiable):",
    "The student can ONLY understand French they have dumped and confirmed.",
    `You may ONLY use French from their knowledge base (${scope.phraseCount} phrases, ${scope.confirmedLessonCount} lesson${scope.confirmedLessonCount === 1 ? "" : "s"}):`,
    allFrench,
    "",
    "Today's focus — prioritize these in practice:",
    todayFrench,
    scope.grammarTopics.length > 0
      ? `\nGrammar topics in base (reference only, don't lecture): ${scope.grammarTopics.join(", ")}`
      : "",
    "",
    "FORBIDDEN:",
    "- Any French word or phrase NOT in the knowledge base list above.",
    "- Inventing vocabulary because it 'fits the conversation'.",
    "- Long monologues, lists, or teaching new material unprompted.",
    "",
    formatComplexityGuidance(scope),
    "",
    "When the student uses something outside the base:",
    "- Brief English: « We haven't covered that yet — let's use what you know. »",
    "- Model ONE phrase from the list. Explain in English only if they ask or are stuck.",
    "",
    "As they dump more lessons, this list grows — that's the ONLY way conversations get richer.",
  ]
    .filter(Boolean)
    .join("\n");
}
