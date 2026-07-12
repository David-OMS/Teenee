import { NextResponse } from "next/server";

import { fetchSessionContext } from "@/lib/orchestrator/fetch-session-context";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { sessionId } = await context.params;
    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const result = await fetchSessionContext(supabase, userId, sessionId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load session.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
