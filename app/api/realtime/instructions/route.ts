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

    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const result = await buildInstructionsForSession(supabase, userId, sessionId);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not build instructions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
