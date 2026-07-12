import type { ServerClient } from "@/lib/supabase/create-server-client";

type EndSessionInput = {
  sessionId: string;
  durationSeconds: number;
  transcriptSummary: string;
  nodesCovered: string[];
  correctionsMade: number;
};

export async function persistSessionEnd(supabase: ServerClient, input: EndSessionInput) {
  const { error } = await supabase
    .from("sessions")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
      duration_seconds: input.durationSeconds,
      review: {
        sessionId: input.sessionId,
        grammarMistakes: [],
        pronunciationImprovements: [],
        vocabularyUsed: [],
        expressionsIntroduced: [],
        speakingScore: 0,
        suggestedRevision: [],
        nextSessionRecommendations: [],
        summarizedAt: new Date().toISOString(),
        transcriptSummary: input.transcriptSummary,
        nodesCovered: input.nodesCovered,
        correctionsMade: input.correctionsMade,
      },
    })
    .eq("id", input.sessionId);

  if (error) {
    throw new Error(`Could not end session: ${error.message}`);
  }
}
