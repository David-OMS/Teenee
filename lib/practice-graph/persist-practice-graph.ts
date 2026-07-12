import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { ServerClient } from "@/lib/supabase/create-server-client";

type PracticeGraphRow = {
  id: string;
  version: number;
};

export async function persistPracticeGraph(
  supabase: ServerClient,
  graph: PracticeGraph,
): Promise<PracticeGraph> {
  const { data: existing, error: lookupError } = await supabase
    .from("practice_graphs")
    .select("id, version")
    .eq("lesson_id", graph.lessonId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Could not save practice graph: ${lookupError.message}`);
  }

  const payload = {
    lesson_id: graph.lessonId,
    user_id: graph.userId,
    template_ids: graph.templateIds,
    nodes: graph.nodes,
    edges: graph.edges,
    pronunciation_focus: graph.pronunciationFocus,
    version: existing ? existing.version + 1 : graph.version,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await supabase
      .from("practice_graphs")
      .update(payload)
      .eq("lesson_id", graph.lessonId);

    if (error) {
      throw new Error(`Could not update practice graph: ${error.message}`);
    }

    return { ...graph, id: existing.id, version: payload.version };
  }

  const { data, error } = await supabase
    .from("practice_graphs")
    .insert({
      id: graph.id,
      ...payload,
    })
    .select("id, version")
    .single();

  if (error || !data) {
    throw new Error(`Could not insert practice graph: ${error?.message ?? "Unknown error"}`);
  }

  return { ...graph, id: data.id, version: data.version };
}
