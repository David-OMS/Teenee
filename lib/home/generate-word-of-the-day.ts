import { callJsonChatCompletion } from "@/lib/openai/call-json-chat-completion";
import type { CefrLevel } from "@/types/common/cefr-level";

export type GeneratedWord = {
  french: string;
  english: string;
  example: string;
};

function normalizeFrench(word: string): string {
  return word.trim().toLowerCase();
}

function parseGeneratedWord(raw: string): GeneratedWord {
  const parsed = JSON.parse(raw) as Partial<GeneratedWord>;

  if (!parsed.french?.trim() || !parsed.english?.trim()) {
    throw new Error("Word generator returned an invalid payload.");
  }

  return {
    french: parsed.french.trim(),
    english: parsed.english.trim(),
    example: parsed.example?.trim() ?? "",
  };
}

/** Generate a fresh French word not present in the user's history. */
export async function generateWordOfTheDay(
  level: CefrLevel,
  excludeWords: string[],
): Promise<GeneratedWord> {
  const excludeList =
    excludeWords.length > 0 ? excludeWords.join(", ") : "(none yet — pick anything suitable)";

  const raw = await callJsonChatCompletion([
    {
      role: "system",
      content:
        'Return JSON only: { "french": string, "english": string, "example": string }. The example is one short French sentence using the word.',
    },
    {
      role: "user",
      content: [
        `Pick one useful French word or short expression for a ${level} learner.`,
        "Do NOT repeat any word from this list (match ignoring accents/case):",
        excludeList,
        "Prefer practical vocabulary — not ultra-rare literary words.",
      ].join("\n"),
    },
  ]);

  const word = parseGeneratedWord(raw);

  if (excludeWords.some((seen) => normalizeFrench(seen) === normalizeFrench(word.french))) {
    throw new Error("Generated word was already shown.");
  }

  return word;
}

export { normalizeFrench };
