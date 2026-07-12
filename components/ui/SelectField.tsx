"use client";

import { useRef, useState } from "react";

import { FieldLabel } from "@/components/ui/FieldLabel";
import { useClickOutside } from "@/hooks/use-click-outside";
import type { FieldSurface } from "@/lib/ui/field-classes";
import {
  fieldControlClasses,
  fieldMenuClasses,
  fieldOptionClasses,
} from "@/lib/ui/field-classes";

type SelectFieldProps<T extends string> = {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  surface?: FieldSurface;
};

/** Custom select — matches TextField styling, no native system dropdown. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  surface = "light",
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useClickOutside(containerRef, () => setOpen(false));

  function handleSelect(next: T) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`${fieldControlClasses(surface, disabled)} flex items-center justify-between gap-3 text-left`}
      >
        <span className="truncate">{selected?.label ?? "Select"}</span>
        <span className="shrink-0 text-xs text-muted-light" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <ul
          role="listbox"
          className={`absolute top-[calc(100%+4px)] z-50 w-full ${fieldMenuClasses(surface)}`}
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={fieldOptionClasses(surface, option.value === value)}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
