import { NextResponse } from "next/server";

import { transitionToPractice } from "@/lib/orchestrator/transition-to-practice";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";

type TransitionBody = {
  explainSessionId: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TransitionBody;

    if (!body.explainSessionId) {
      return NextResponse.json({ error: "explainSessionId is required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const result = await transitionToPractice(supabase, userId, body.explainSessionId);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start practice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
