type DarkStagePlaceholderProps = {
  title: string;
  prompt: string;
  actionLabel: string;
};

export function DarkStagePlaceholder({
  title,
  prompt,
  actionLabel,
}: DarkStagePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <p className="font-display text-4xl uppercase tracking-tight">{title}</p>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-dark">{prompt}</p>
      <button
        type="button"
        aria-label={actionLabel}
        className="mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-[0_0_0_8px_rgba(250,17,79,0.15)] transition-transform active:scale-95"
      >
        <span className="h-4 w-4 rounded-full bg-white" />
      </button>
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-dark">
        {actionLabel}
      </p>
    </div>
  );
}
