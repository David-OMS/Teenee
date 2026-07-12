"use client";

import { useState } from "react";

import { DumpModeSwitch } from "@/components/dump/DumpModeSwitch";
import type { DumpMode } from "@/components/dump/DumpModeSwitch";
import { TextDumpForm } from "@/components/dump/TextDumpForm";
import { VoiceDumpRecorder } from "@/components/dump/VoiceDumpRecorder";

/** Orchestrator — voice or typed class dump. */
export function ClassDumpPanel() {
  const [mode, setMode] = useState<DumpMode>("voice");

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-12 text-center">
      <p className="font-display text-4xl uppercase tracking-tight">Class dump</p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-dark">
        {mode === "voice"
          ? "Talk through what you learned today."
          : "Paste or type what you learned today."}
      </p>

      <div className="mt-8">
        <DumpModeSwitch mode={mode} onChange={setMode} />
      </div>

      <div className="mt-10 flex w-full flex-col items-center">
        {mode === "voice" ? <VoiceDumpRecorder /> : <TextDumpForm />}
      </div>
    </div>
  );
}
