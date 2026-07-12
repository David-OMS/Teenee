import type { PracticeTemplate } from "@/types/practice-template/practice-template";

/** Student explains aloud — AI corrects misunderstandings only. */
export const explainLessonFlowTemplate: PracticeTemplate = {
  id: "explain_lesson_flow",
  name: "Explain Lesson Flow",
  description: "Student explains the lesson; AI corrects genuine misunderstandings only",
  matchKeywords: [
    "explain",
    "explanation",
    "describe",
    "summary",
    "recap",
    "review",
    "understand",
  ],
  slots: [
    {
      id: "student_explains",
      kind: "student_explains",
      nodeKind: "exchange",
      weight: "revision",
      objectiveTemplate: "Explain {topic}",
      promptTemplate:
        "Ask the student to explain today's lesson on {topic} in their own words. Listen fully before responding.",
    },
    {
      id: "correct_misunderstanding",
      kind: "correct_misunderstanding",
      nodeKind: "exchange",
      weight: "revision",
      objectiveTemplate: "Correct misunderstandings only",
      promptTemplate:
        "If the student has a genuine misunderstanding about {topic}, correct it once. Do not nitpick.",
    },
  ],
};
