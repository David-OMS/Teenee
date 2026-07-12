import type { ConversationMode } from "@/types/conversation/conversation-mode";

export type ConversationModeBehavior = {
  id: ConversationMode;
  label: string;
  shortLabel: string;
  description: string;
  /** System prompt guidance for Realtime (Phase 8). */
  promptGuidance: string;
};

/**
 * Conversation mode behavior — French-first by default.
 *
 * Hybrid is NOT "translate everything." It's how a good teacher runs class:
 * French conversation flow, English only when you're stuck or need a correction.
 */
export const conversationModeBehaviors: Record<ConversationMode, ConversationModeBehavior> = {
  hybrid: {
    id: "hybrid",
    label: "Hybrid (French-first)",
    shortLabel: "Hybrid",
    description:
      "AI speaks French. You reply in French. English only when you're confused, need a correction, or a quick \"good job\" — not after every sentence.",
    promptGuidance: `
Default mode. Run the conversation in French.
- Ask questions, prompt, and move the conversation forward in French.
- After the student responds, reply in French first.
- Use English ONLY when: (1) the student seems confused or didn't understand what you said,
  (2) you need to correct or explain their response, or (3) brief encouragement ("Good job! / Bien joué!").
- Do NOT translate every French utterance into English. That prevents learning.
- Check comprehension in French when needed — e.g. "Compris?" / "Tu as compris?" — not "Do you understand?"
- Then continue the next beat in French.`,
  },
  beginner: {
    id: "beginner",
    label: "Beginner (more support)",
    shortLabel: "Beginner",
    description:
      "More English scaffolding when you're starting out — still moves toward French, but explains more after each exchange.",
    promptGuidance: `
More supportive than Hybrid, but still conversation-driven.
- Lead in French, but offer English glosses when introducing new phrases.
- After student responds: French reply, then English explanation of grammar/pronunciation if needed.
- Still avoid translating every single line — only new or tricky material.
- Move to the next question in French once the point lands.`,
  },
  immersion: {
    id: "immersion",
    label: "Immersion (French only)",
    shortLabel: "Immersion",
    description:
      "French throughout. English only if you explicitly ask for it or clearly didn't understand something.",
    promptGuidance: `
French only unless the student explicitly asks for English or signals they did not understand.
- No English translations by default.
- Comprehension checks in French: "Compris?", "C'est clair?", "Tu peux répéter?"
- If student asks "in English?" or "what does that mean?", then explain briefly in English and return to French.`,
  },
};

export function getConversationModeBehavior(mode: ConversationMode): ConversationModeBehavior {
  return conversationModeBehaviors[mode];
}

export const conversationModeOptions = (
  Object.values(conversationModeBehaviors) as ConversationModeBehavior[]
).map((behavior) => ({
  value: behavior.id,
  label: behavior.label,
}));
