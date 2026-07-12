import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";
import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { PronunciationFocus } from "@/types/session/pronunciation-focus";

function exampleWords(items: KnowledgeItem[]): string[] {
  return items
    .slice(0, 3)
    .map((item) => {
      if (item.kind === "grammar") {
        return item.topic;
      }

      return item.french;
    })
    .filter(Boolean);
}

export function buildSessionPronunciationFocus(
  practiceGraph: PracticeGraph,
  lessonItems: KnowledgeItem[],
): PronunciationFocus {
  return {
    sound: practiceGraph.pronunciationFocus,
    reason: "Focused sound from today's lesson",
    exampleWords: exampleWords(lessonItems),
  };
}
