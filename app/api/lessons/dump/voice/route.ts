import { NextResponse } from "next/server";

import { processVoiceDump } from "@/lib/lessons/process-voice-dump";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    const durationValue = formData.get("durationSeconds");

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }

    const durationSeconds = Number(durationValue ?? 0);
    const audioBuffer = Buffer.from(await audio.arrayBuffer());

    const result = await processVoiceDump({
      audioBuffer,
      mimeType: audio.type || "audio/webm",
      durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : 0,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Voice dump failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
