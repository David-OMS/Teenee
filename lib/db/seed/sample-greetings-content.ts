import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";

/** Sample confirmed lesson — greetings — used by dev seed. */
export const sampleGreetingsContent: ConfirmedLessonContent = {
  title: "Greetings",
  difficulty: "beginner",
  vocabulary: [
    { id: "v1", french: "Bonjour", english: "Hello / Good day" },
    { id: "v2", french: "Bonsoir", english: "Good evening" },
    { id: "v3", french: "Salut", english: "Hi (informal)" },
  ],
  grammar: [
    {
      id: "g1",
      topic: "Formal greetings",
      description: "Use vous with Comment allez-vous ? for teachers and strangers.",
      examples: ["Comment allez-vous ?", "Bonjour, madame."],
    },
    {
      id: "g2",
      topic: "Informal greetings",
      description: "Use tu with Comment vas-tu ? for friends.",
      examples: ["Comment vas-tu ?", "Salut !"],
    },
  ],
  expressions: [
    {
      id: "e1",
      french: "Comment allez-vous ?",
      english: "How are you? (formal)",
      register: "formal",
    },
    {
      id: "e2",
      french: "Comment vas-tu ?",
      english: "How are you? (informal)",
      register: "informal",
    },
  ],
  pronunciationTargets: ["Bonjour", "Bonsoir", "français"],
  conversationPatterns: ["greeting → response → ask back → goodbye"],
  confirmedAt: new Date().toISOString(),
};
