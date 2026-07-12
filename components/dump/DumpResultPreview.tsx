import Link from "next/link";

type DumpResultPreviewProps = {
  message: string;
  content: string;
  lessonTitle?: string;
  lessonId?: string;
  onReset: () => void;
  resetLabel: string;
};

export function DumpResultPreview({
  message,
  content,
  lessonTitle,
  lessonId,
  onReset,
  resetLabel,
}: DumpResultPreviewProps) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <p className="text-sm text-muted-dark">{message}</p>
      {lessonTitle ? (
        <p className="font-display text-lg uppercase tracking-tight text-foreground-dark">
          {lessonTitle}
        </p>
      ) : null}
      <p className="max-h-40 w-full overflow-y-auto rounded-xl bg-card-dark px-4 py-3 text-left text-sm leading-relaxed text-foreground-dark">
        {content}
      </p>
      {lessonId ? (
        <Link
          href={`/lessons/${lessonId}/confirm`}
          className="h-11 w-full rounded-full bg-accent text-sm font-semibold leading-[44px] text-white"
        >
          Review & confirm
        </Link>
      ) : null}
      <button
        type="button"
        onClick={onReset}
        className="text-xs font-medium uppercase tracking-widest text-accent"
      >
        {resetLabel}
      </button>
    </div>
  );
}
