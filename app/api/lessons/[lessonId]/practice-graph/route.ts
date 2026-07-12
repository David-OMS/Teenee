import { NextResponse } from "next/server";

import { fetchPracticeGraph } from "@/lib/practice-graph/fetch-practice-graph";
import { createServerClient } from "@/lib/supabase/create-server-client";

type RouteContext = {
  params: Promise<{ lessonId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { lessonId } = await context.params;
    const supabase = createServerClient();
    const graph = await fetchPracticeGraph(supabase, lessonId);
    return NextResponse.json(graph);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load practice graph.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
