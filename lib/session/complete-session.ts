import { applySrsFromSession } from "@/lib/knowledge/apply-srs-from-session";
import { updateKnowledgeFromSession } from "@/lib/knowledge/update-knowledge-from-session";
import { fetchSessionById } from "@/lib/orchestrator/fetch-session-by-id";
import { querySingle } from "@/lib/supabase/query-single";
import { summarizeSessionTranscript } from "@/lib/session/summarize-session-transcript";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { SessionReview } from "@/types/session/session-review";

type CompleteSessionInput = {
  sessionId: string;
  durationSeconds: number;
  transcriptSummary: string;
  nodesCovered: string[];
  correctionsMade: number;
};

type LessonTitleRow = {
  title: string;
};

export async function completeSession(
  supabase: ServerClient,
  input: CompleteSessionInput,
): Promise<SessionReview> {
  const session = await fetchSessionById(supabase, input.sessionId);

  const lesson = await querySingle<LessonTitleRow>(
    supabase.from("lessons").select("title").eq("id", session.lesson_id).single(),
    "Lesson not found",
  );

  const summary = await summarizeSessionTranscript({
    lessonTitle: lesson.title,
    phase: session.phase,
    transcriptSummary: input.transcriptSummary,
    nodesCovered: input.nodesCovered,
  });

  await updateKnowledgeFromSession(supabase, session.user_id, summary);
  await applySrsFromSession(supabase, session.user_id, summary.conceptOutcomes);

  const review: SessionReview = {
    sessionId: input.sessionId,
    grammarMistakes: summary.grammarMistakes,
    pronunciationImprovements: summary.pronunciationImprovements,
    vocabularyUsed: summary.vocabularyUsed,
    expressionsIntroduced: summary.expressionsIntroduced,
    speakingScore: summary.speakingScore,
    suggestedRevision: summary.suggestedRevision,
    nextSessionRecommendations: summary.nextSessionRecommendations,
    summarizedAt: new Date().toISOString(),
    transcriptSummary: input.transcriptSummary,
    nodesCovered: input.nodesCovered,
    correctionsMade: input.correctionsMade,
  };

  const { error } = await supabase
    .from("sessions")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
      duration_seconds: input.durationSeconds,
      review,
    })
    .eq("id", input.sessionId);

  if (error) {
    throw new Error(`Could not end session: ${error.message}`);
  }

  return review;
}
