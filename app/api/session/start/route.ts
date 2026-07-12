import { NextResponse } from "next/server";

import { startSession } from "@/lib/orchestrator/start-session";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";
import type { SessionPhase } from "@/types/session/session-phase";

type StartSessionBody = {
  lessonId: string;
  phase?: SessionPhase;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StartSessionBody;

    if (!body.lessonId) {
      return NextResponse.json({ error: "lessonId is required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const result = await startSession(supabase, {
      userId,
      lessonId: body.lessonId,
      phase: body.phase,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
