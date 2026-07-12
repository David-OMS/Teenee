import { formatDuration } from "@/lib/audio/format-duration";

type RecordingTimerProps = {
  seconds: number;
  isRecording: boolean;
};

export function RecordingTimer({ seconds, isRecording }: RecordingTimerProps) {
  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden />
      ) : null}
      <span className="font-mono text-2xl tabular-nums tracking-wider text-foreground-dark">
        {formatDuration(seconds)}
      </span>
    </div>
  );
}
