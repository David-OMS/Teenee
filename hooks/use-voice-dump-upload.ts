"use client";

import { useCallback, useEffect, useState } from "react";

import { uploadVoiceDump } from "@/lib/api/upload-voice-dump";
import type { VoiceDumpUploadResult } from "@/lib/api/upload-voice-dump";

export type UploadState = "idle" | "uploading" | "success" | "error";

export function useVoiceDumpUpload(audioBlob: Blob | null, durationSeconds: number) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [result, setResult] = useState<VoiceDumpUploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetUpload = useCallback(() => {
    setUploadState("idle");
    setResult(null);
    setUploadError(null);
  }, []);

  useEffect(() => {
    if (!audioBlob) {
      return;
    }

    let cancelled = false;

    async function runUpload() {
      setUploadState("uploading");
      setUploadError(null);

      try {
        const response = await uploadVoiceDump(audioBlob!, durationSeconds);
        if (cancelled) {
          return;
        }
        setResult(response);
        setUploadState("success");
      } catch (error) {
        if (cancelled) {
          return;
        }
        setUploadError(error instanceof Error ? error.message : "Upload failed.");
        setUploadState("error");
      }
    }

    void runUpload();

    return () => {
      cancelled = true;
    };
  }, [audioBlob, durationSeconds]);

  return { uploadState, result, uploadError, resetUpload };
}
