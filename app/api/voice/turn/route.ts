import { NextResponse } from "next/server";

import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";
import { runBudgetVoiceTurn } from "@/lib/voice/run-budget-voice-turn";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";

/** Budget voice — one user turn: transcribe → chat → TTS. */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const sessionId = String(formData.get("sessionId") ?? "");
    const currentItemId = String(formData.get("currentItemId") ?? "") || undefined;
    const turnsOnNodeRaw = String(formData.get("turnsOnNode") ?? "");
    const promptOverride = String(formData.get("promptOverride") ?? "") || undefined;
    const historyRaw = String(formData.get("history") ?? "[]");
    const audio = formData.get("audio");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required." }, { status: 400 });
    }

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: "audio required." }, { status: 400 });
    }

    let history: TranscriptLine[] = [];
    try {
      history = JSON.parse(historyRaw) as TranscriptLine[];
    } catch {
      history = [];
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);

    const result = await runBudgetVoiceTurn(supabase, {
      sessionId,
      userId,
      currentItemId,
      turnsOnNode: turnsOnNodeRaw ? Number(turnsOnNodeRaw) : undefined,
      promptOverride,
      history,
      audio: {
        buffer,
        filename: audio.name || "turn.webm",
        mimeType: audio.type || "audio/webm",
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process voice turn.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
