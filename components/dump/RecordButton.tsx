import type { DumpRecordingState } from "@/hooks/use-class-dump-recorder";

type RecordButtonProps = {
  state: DumpRecordingState;
  onStart: () => void;
  onStop: () => void;
};

function getLabel(state: DumpRecordingState): string {
  if (state === "recording") {
    return "Tap to stop";
  }
  if (state === "stopped") {
    return "Recorded";
  }
  return "Tap to record";
}

export function RecordButton({ state, onStart, onStop }: RecordButtonProps) {
  const isRecording = state === "recording";

  return (
    <button
      type="button"
      aria-label={getLabel(state)}
      onClick={isRecording ? onStop : onStart}
      disabled={state === "stopped"}
      className={`flex h-20 w-20 items-center justify-center rounded-full bg-accent transition-transform active:scale-95 disabled:opacity-50 ${
        isRecording
          ? "shadow-[0_0_0_12px_rgba(250,17,79,0.25)]"
          : "shadow-[0_0_0_8px_rgba(250,17,79,0.15)]"
      }`}
    >
      <span
        className={`rounded-full bg-white ${isRecording ? "h-5 w-5" : "h-4 w-4"}`}
      />
    </button>
  );
}
