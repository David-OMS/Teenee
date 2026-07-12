export type DumpMode = "voice" | "text";

type DumpModeSwitchProps = {
  mode: DumpMode;
  onChange: (mode: DumpMode) => void;
};

export function DumpModeSwitch({ mode, onChange }: DumpModeSwitchProps) {
  return (
    <div className="flex gap-2 rounded-full bg-card-dark p-1">
      <button
        type="button"
        onClick={() => onChange("voice")}
        className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${
          mode === "voice" ? "bg-accent text-white" : "text-muted-dark"
        }`}
      >
        Voice
      </button>
      <button
        type="button"
        onClick={() => onChange("text")}
        className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${
          mode === "text" ? "bg-accent text-white" : "text-muted-dark"
        }`}
      >
        Type
      </button>
    </div>
  );
}
