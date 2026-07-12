import { NextResponse } from "next/server";

import { fetchKnowledgeSnapshot } from "@/lib/knowledge/fetch-knowledge-snapshot";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const todayLessonId = searchParams.get("lessonId") ?? undefined;
    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const snapshot = await fetchKnowledgeSnapshot(supabase, userId, { todayLessonId });
    return NextResponse.json(snapshot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load knowledge snapshot.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
