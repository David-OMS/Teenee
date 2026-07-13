import { NextResponse } from "next/server";

import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";
import { runBudgetVoiceTurn } from "@/lib/voice/run-budget-voice-turn";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";

/** Budget voice — opening Teenee line without user audio (Whisper + chat + TTS). */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      currentItemId?: string;
      turnsOnNode?: number;
      promptOverride?: string;
    };

    if (!body.sessionId) {
      return NextResponse.json({ error: "sessionId required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const result = await runBudgetVoiceTurn(supabase, {
      sessionId: body.sessionId,
      userId,
      currentItemId: body.currentItemId,
      turnsOnNode: body.turnsOnNode,
      promptOverride: body.promptOverride,
      history: [],
      opening: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not open budget voice session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
