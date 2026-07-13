import { NextResponse } from "next/server";

import { buildInstructionsForSession } from "@/lib/realtime/build-instructions-for-session";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required." }, { status: 400 });
    }

    const currentItemId = searchParams.get("currentItemId") ?? undefined;
    const turnsOnNode = searchParams.get("turnsOnNode");
    const parsedTurns = turnsOnNode ? Number(turnsOnNode) : undefined;
    const promptOverride = searchParams.get("promptOverride") ?? undefined;
    const beatOnly = searchParams.get("beatOnly") === "true";
    const stableOnly = searchParams.get("stableOnly") === "true";

    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const result = await buildInstructionsForSession(supabase, userId, sessionId, {
      currentItemId,
      turnsOnNode: parsedTurns,
      promptOverride,
      beatOnly,
      stableOnly,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not build instructions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
