"use client";

import { AudioWaveform } from "@/components/dump/AudioWaveform";
import { DumpResultPreview } from "@/components/dump/DumpResultPreview";
import { RecordButton } from "@/components/dump/RecordButton";
import { RecordingTimer } from "@/components/dump/RecordingTimer";
import { useClassDumpRecorder } from "@/hooks/use-class-dump-recorder";
import { useVoiceDumpUpload } from "@/hooks/use-voice-dump-upload";

export function VoiceDumpRecorder() {
  const {
    state,
    seconds,
    levels,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useClassDumpRecorder();

  const { uploadState, result, uploadError, resetUpload } = useVoiceDumpUpload(
    state === "stopped" ? audioBlob : null,
    seconds,
  );

  const isRecording = state === "recording";

  function handleReset() {
    resetUpload();
    resetRecording();
  }

  if (uploadState === "success" && result?.transcript) {
    return (
      <DumpResultPreview
        message="Parsed and ready to confirm."
        lessonTitle={result.parsed?.title}
        lessonId={result.lessonId}
        content={result.transcript}
        onReset={handleReset}
        resetLabel="Record again"
      />
    );
  }

  return (
    <>
      <div className="mt-10">
        <RecordingTimer seconds={seconds} isRecording={isRecording} />
      </div>

      <div className="mt-8 w-full">
        <AudioWaveform levels={levels} isActive={isRecording || uploadState === "uploading"} />
      </div>

      <div className="mt-10">
        <RecordButton state={state} onStart={startRecording} onStop={stopRecording} />
      </div>

      <p className="mt-4 text-xs uppercase tracking-widest text-muted-dark">
        {isRecording
          ? "Tap to stop"
          : state === "stopped"
            ? "Processing"
            : "Tap to record"}
      </p>

      {error ? <p className="mt-6 max-w-xs text-sm text-accent">{error}</p> : null}
      {uploadError ? <p className="mt-6 max-w-xs text-sm text-accent">{uploadError}</p> : null}
      {uploadState === "uploading" ? (
        <p className="mt-6 text-sm text-muted-dark">Uploading and transcribing…</p>
      ) : null}
    </>
  );
}
