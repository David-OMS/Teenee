"use client";

type ErrorStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({ title, message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="mx-5 flex flex-col items-center rounded-2xl bg-surface-light px-6 py-10 text-center">
      <p className="font-display text-2xl uppercase tracking-tight">{title}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-light">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 h-11 rounded-full bg-accent px-6 text-sm font-semibold text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
