import type { PracticeTemplate } from "@/types/practice-template/practice-template";

/** open → respond → ask back → formal/informal switch → variation → close */
export const greetingFlowTemplate: PracticeTemplate = {
  id: "greeting_flow",
  name: "Greeting Flow",
  description: "Open, respond, ask back, register switch, variation, close",
  matchKeywords: [
    "bonjour",
    "salut",
    "bonsoir",
    "greeting",
    "comment allez",
    "comment vas",
    "hello",
    "goodbye",
    "au revoir",
    "formal",
    "informal",
    "madame",
    "monsieur",
  ],
  slots: [
    {
      id: "open",
      kind: "open",
      nodeKind: "exchange",
      weight: "revision",
      objectiveTemplate: "Open with {phrase}",
      promptTemplate:
        "Greet the student with {phrase} ({phrase_en}). Keep it warm and natural.",
    },
    {
      id: "respond",
      kind: "respond",
      nodeKind: "exchange",
      weight: "revision",
      objectiveTemplate: "Student responds to greeting",
      promptTemplate: "Wait for the student to respond. Accept {phrase} or a natural variant.",
      recallGap: { silenceSeconds: 5, hintAfterSeconds: 8 },
    },
    {
      id: "ask_back",
      kind: "ask_back",
      nodeKind: "exchange",
      weight: "revision",
      objectiveTemplate: "Student asks how you are",
      promptTemplate: "Prompt the student to ask back using {ask_back} ({ask_back_en}).",
    },
    {
      id: "register_switch",
      kind: "register_switch",
      nodeKind: "switch",
      weight: "stretch",
      objectiveTemplate: "Switch formal ({formal}) and informal ({informal})",
      promptTemplate:
        "Practice both registers. Formal: {formal}. Informal: {informal}. Ask the student to switch.",
      recallGap: { silenceSeconds: 6, hintAfterSeconds: 10 },
    },
    {
      id: "variation",
      kind: "variation",
      nodeKind: "stretch",
      weight: "stretch",
      objectiveTemplate: "Use a variation: {variation}",
      promptTemplate:
        "Introduce {variation} ({variation_en}) as a natural variation in the greeting exchange.",
    },
    {
      id: "close",
      kind: "close",
      nodeKind: "exchange",
      weight: "revision",
      objectiveTemplate: "Close the exchange",
      promptTemplate: "Wrap up with {close} ({close_en}) and a brief farewell.",
    },
  ],
};
