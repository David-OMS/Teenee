import { NextResponse } from "next/server";

import { completeSession } from "@/lib/session/complete-session";
import { createServerClient } from "@/lib/supabase/create-server-client";

type EndSessionBody = {
  sessionId: string;
  durationSeconds: number;
  transcriptSummary: string;
  nodesCovered?: string[];
  correctionsMade?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EndSessionBody;
    if (!body.sessionId) {
      return NextResponse.json({ error: "sessionId required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const review = await completeSession(supabase, {
      sessionId: body.sessionId,
      durationSeconds: body.durationSeconds ?? 0,
      transcriptSummary: body.transcriptSummary ?? "",
      nodesCovered: body.nodesCovered ?? [],
      correctionsMade: body.correctionsMade ?? 0,
    });

    return NextResponse.json({ ok: true, sessionId: body.sessionId, review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not end session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
