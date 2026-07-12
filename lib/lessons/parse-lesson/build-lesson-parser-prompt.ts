import type { Difficulty } from "@/types/common/difficulty";

export type LessonParserOutput = {
  title: string;
  difficulty: Difficulty;
  vocabulary: {
    french: string;
    english: string;
    notes?: string;
  }[];
  grammar: {
    topic: string;
    description: string;
    examples: string[];
  }[];
  expressions: {
    french: string;
    english: string;
    register?: "formal" | "informal" | "neutral";
  }[];
  pronunciationTargets: string[];
  conversationPatterns: string[];
};

export function buildLessonParserPrompt(text: string): string {
  return `Extract structured French lesson content from this class dump.

Return JSON with:
- title: short lesson title
- difficulty: beginner | elementary | intermediate | advanced
- vocabulary: array of { french, english, notes? }
- grammar: array of { topic, description, examples[] }
- expressions: array of { french, english, register? }
- pronunciationTargets: French words/sounds worth practicing
- conversationPatterns: short patterns like "greeting → response → ask back"

Only extract what the student mentioned. Do not invent curriculum.

Class dump:
${text}`;
}
