"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_VOICE_PIPELINE_MODE,
  VOICE_PIPELINE_MODE_STORAGE_KEY,
  type VoicePipelineMode,
} from "@/types/conversation/voice-pipeline-mode";

function readStoredMode(): VoicePipelineMode {
  if (typeof window === "undefined") {
    return DEFAULT_VOICE_PIPELINE_MODE;
  }

  const stored = window.localStorage.getItem(VOICE_PIPELINE_MODE_STORAGE_KEY);
  return stored === "realtime" ? "realtime" : DEFAULT_VOICE_PIPELINE_MODE;
}

export function useVoicePipelineMode() {
  const [mode, setModeState] = useState<VoicePipelineMode>(DEFAULT_VOICE_PIPELINE_MODE);

  useEffect(() => {
    setModeState(readStoredMode());
  }, []);

  const setMode = useCallback((next: VoicePipelineMode) => {
    setModeState(next);
    window.localStorage.setItem(VOICE_PIPELINE_MODE_STORAGE_KEY, next);
  }, []);

  return { mode, setMode };
}
