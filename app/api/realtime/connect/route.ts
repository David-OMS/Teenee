import { NextResponse } from "next/server";

import { buildInstructionsForSession } from "@/lib/realtime/build-instructions-for-session";
import { buildRealtimeSessionConfig } from "@/lib/realtime/build-realtime-session-config";
import { readOpenAiApiKey } from "@/lib/openai/read-openai-api-key";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";
import { fetchUserSettings } from "@/lib/settings/fetch-user-settings";
import type { VoiceInputMode } from "@/types/conversation/voice-input-mode";

/** WebRTC unified interface — proxy SDP + session config to OpenAI Realtime. */
export async function POST(request: Request) {
  try {
    const sessionId = request.headers.get("x-teenee-session-id");
    if (!sessionId) {
      return NextResponse.json({ error: "x-teenee-session-id header required." }, { status: 400 });
    }

    const sdp = await request.text();
    if (!sdp) {
      return NextResponse.json({ error: "SDP body required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const [{ instructions }, settings] = await Promise.all([
      buildInstructionsForSession(supabase, userId, sessionId),
      fetchUserSettings(),
    ]);

    const voiceInputMode = request.headers.get("x-teenee-voice-input-mode") as VoiceInputMode | null;
    const sessionConfig = buildRealtimeSessionConfig(
      instructions,
      settings,
      voiceInputMode === "push_to_talk" ? "push_to_talk" : "auto",
    );
    const formData = new FormData();
    formData.set("sdp", sdp);
    formData.set("session", JSON.stringify(sessionConfig));

    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${readOpenAiApiKey()}`,
        "OpenAI-Safety-Identifier": userId,
      },
      body: formData,
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Realtime connect failed: ${detail}`);
    }

    const answerSdp = await response.text();
    return new NextResponse(answerSdp, {
      headers: { "Content-Type": "application/sdp" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not connect realtime.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
