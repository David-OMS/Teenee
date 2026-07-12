import { NextResponse } from "next/server";

import { advanceSession } from "@/lib/orchestrator/advance-session";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";
import type { CorrectionBudget } from "@/types/conversation/correction-budget";
import type { TurnOutcome } from "@/lib/orchestrator/should-advance-node";

type AdvanceSessionBody = {
  sessionId: string;
  currentItemId: string;
  outcome: TurnOutcome;
  turnsOnNode: number;
  correctionBudget: CorrectionBudget;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdvanceSessionBody;

    if (!body.sessionId || !body.currentItemId || !body.outcome) {
      return NextResponse.json(
        { error: "sessionId, currentItemId, and outcome are required." },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const result = await advanceSession(supabase, userId, {
      sessionId: body.sessionId,
      currentItemId: body.currentItemId,
      outcome: body.outcome,
      turnsOnNode: body.turnsOnNode ?? 1,
      correctionBudget: body.correctionBudget,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not advance session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
