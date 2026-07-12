import type { FieldSurface } from "@/lib/ui/field-classes";
import { fieldControlClasses } from "@/lib/ui/field-classes";

type TextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  surface?: FieldSurface;
};

export function TextField({
  value,
  onChange,
  placeholder,
  disabled = false,
  surface = "light",
}: TextFieldProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={fieldControlClasses(surface, disabled)}
    />
  );
}
