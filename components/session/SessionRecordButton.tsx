type SessionRecordButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function SessionRecordButton({ label, onClick, disabled = false }: SessionRecordButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-[0_0_0_8px_rgba(250,17,79,0.15)] transition-transform active:scale-95 disabled:opacity-50"
      >
        <span className="h-4 w-4 rounded-full bg-white" />
      </button>
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-dark">{label}</p>
    </div>
  );
}
