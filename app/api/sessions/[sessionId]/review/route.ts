import { NextResponse } from "next/server";

import { fetchSessionReview } from "@/lib/session/fetch-session-review";
import { createServerClient } from "@/lib/supabase/create-server-client";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { sessionId } = await context.params;
    const supabase = createServerClient();
    const payload = await fetchSessionReview(supabase, sessionId);

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load session review.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
