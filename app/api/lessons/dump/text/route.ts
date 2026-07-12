import { NextResponse } from "next/server";

import { processTextDump } from "@/lib/lessons/process-text-dump";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string };

    if (!body.text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const result = await processTextDump({ text: body.text });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Text dump failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
