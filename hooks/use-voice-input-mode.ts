"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_VOICE_INPUT_MODE,
  VOICE_INPUT_MODE_STORAGE_KEY,
  type VoiceInputMode,
} from "@/types/conversation/voice-input-mode";

function readStoredMode(): VoiceInputMode {
  if (typeof window === "undefined") {
    return DEFAULT_VOICE_INPUT_MODE;
  }

  const stored = window.localStorage.getItem(VOICE_INPUT_MODE_STORAGE_KEY);
  return stored === "push_to_talk" ? "push_to_talk" : DEFAULT_VOICE_INPUT_MODE;
}

export function useVoiceInputMode() {
  const [mode, setModeState] = useState<VoiceInputMode>(DEFAULT_VOICE_INPUT_MODE);

  useEffect(() => {
    setModeState(readStoredMode());
  }, []);

  const setMode = useCallback((next: VoiceInputMode) => {
    setModeState(next);
    window.localStorage.setItem(VOICE_INPUT_MODE_STORAGE_KEY, next);
  }, []);

  return { mode, setMode };
}
