export type FieldSurface = "light" | "dark";

export function fieldControlClasses(surface: FieldSurface, disabled = false): string {
  const shared = "w-full text-sm transition-colors focus:outline-none disabled:opacity-50";

  if (surface === "dark") {
    return `${shared} rounded-2xl border border-white/10 bg-card-dark px-4 py-3 text-foreground-dark placeholder:text-muted-dark focus:border-accent`;
  }

  return `${shared} h-11 rounded-xl border border-border-light bg-canvas-light px-4 text-foreground-light placeholder:text-muted-light focus:border-accent`;
}

export function fieldMenuClasses(surface: FieldSurface): string {
  if (surface === "dark") {
    return "overflow-hidden rounded-2xl border border-white/10 bg-card-dark shadow-lg";
  }

  return "overflow-hidden rounded-xl border border-border-light bg-canvas-light shadow-lg";
}

export function fieldOptionClasses(surface: FieldSurface, selected: boolean): string {
  const shared = "w-full px-4 py-3 text-left text-sm transition-colors";

  if (surface === "dark") {
    return `${shared} ${selected ? "text-accent font-medium" : "text-foreground-dark"} hover:bg-white/5`;
  }

  return `${shared} ${selected ? "text-accent font-medium" : "text-foreground-light"} hover:bg-surface-light`;
}
