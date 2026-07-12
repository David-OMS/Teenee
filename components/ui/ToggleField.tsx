"use client";

type ToggleFieldProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** Custom toggle — no native checkbox. */
export function ToggleField({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-light px-4 py-3">
      <div className="flex flex-col gap-0.5 text-left">
        <span className="text-sm font-medium">{label}</span>
        {description ? <span className="text-xs text-muted-light">{description}</span> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          checked ? "bg-accent" : "bg-border-light"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
