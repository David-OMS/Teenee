import type { FieldSurface } from "@/lib/ui/field-classes";
import { fieldControlClasses } from "@/lib/ui/field-classes";

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  surface?: FieldSurface;
};

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 8,
  disabled = false,
  surface = "dark",
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`${fieldControlClasses(surface, disabled)} resize-none leading-relaxed`}
    />
  );
}
