"use client";

import { useCallback, useState } from "react";

import { submitTextDump } from "@/lib/api/submit-text-dump";
import type { TextDumpSubmitResult } from "@/lib/api/submit-text-dump";

export type TextSubmitState = "idle" | "submitting" | "success" | "error";

export function useTextDumpSubmit() {
  const [submitState, setSubmitState] = useState<TextSubmitState>("idle");
  const [result, setResult] = useState<TextDumpSubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSubmitState("idle");
    setResult(null);
    setSubmitError(null);
  }, []);

  const submit = useCallback(async (text: string) => {
    setSubmitState("submitting");
    setSubmitError(null);

    try {
      const response = await submitTextDump(text);
      setResult(response);
      setSubmitState("success");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submit failed.");
      setSubmitState("error");
    }
  }, []);

  return { submitState, result, submitError, submit, reset };
}
