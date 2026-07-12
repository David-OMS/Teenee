import { compileAndPersistKnowledge } from "@/lib/knowledge/compile-and-persist-knowledge";
import { compileAndPersistPracticeGraph } from "@/lib/practice-graph/compile-and-persist-practice-graph";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import { sampleGreetingsContent } from "@/lib/db/seed/sample-greetings-content";

export async function insertGreetingsLesson(supabase: ServerClient, userId: string) {
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      user_id: userId,
      status: "confirmed",
      raw: {
        inputType: "text",
        textContent:
          "Today we learned greetings: bonjour, bonsoir, salut, formal vs informal...",
        recordedAt: new Date().toISOString(),
      },
      parsed: {
        title: sampleGreetingsContent.title,
        difficulty: sampleGreetingsContent.difficulty,
        vocabulary: sampleGreetingsContent.vocabulary,
        grammar: sampleGreetingsContent.grammar,
        expressions: sampleGreetingsContent.expressions,
        pronunciationTargets: sampleGreetingsContent.pronunciationTargets,
        conversationPatterns: sampleGreetingsContent.conversationPatterns,
        parsedAt: new Date().toISOString(),
      },
      confirmed: sampleGreetingsContent,
      class_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await compileAndPersistPracticeGraph(supabase, data.id, sampleGreetingsContent);
  await compileAndPersistKnowledge(supabase, data.id, sampleGreetingsContent);

  return data;
}
