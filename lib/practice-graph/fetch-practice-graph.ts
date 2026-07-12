import { querySingle } from "@/lib/supabase/query-single";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { PracticeEdge } from "@/types/practice-graph/practice-edge";
import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { PracticeNode } from "@/types/practice-graph/practice-node";

type PracticeGraphQueryRow = {
  id: string;
  lesson_id: string;
  user_id: string;
  template_ids: string[];
  nodes: PracticeNode[];
  edges: PracticeEdge[];
  pronunciation_focus: string;
  version: number;
};

export async function fetchPracticeGraph(
  supabase: ServerClient,
  lessonId: string,
): Promise<PracticeGraph> {
  const data = await querySingle<PracticeGraphQueryRow>(
    supabase
      .from("practice_graphs")
      .select(
        "id, lesson_id, user_id, template_ids, nodes, edges, pronunciation_focus, version",
      )
      .eq("lesson_id", lessonId)
      .single(),
    "Practice graph not found",
  );

  return {
    id: data.id,
    lessonId: data.lesson_id,
    userId: data.user_id,
    templateIds: data.template_ids,
    nodes: data.nodes,
    edges: data.edges,
    pronunciationFocus: data.pronunciation_focus,
    version: data.version,
  };
}
