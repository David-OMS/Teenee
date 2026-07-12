import type { Surface } from "@/lib/constants/theme";

type SurfaceLayoutProps = {
  surface: Surface;
  children: React.ReactNode;
  className?: string;
};

const surfaceClasses: Record<Surface, string> = {
  light: "bg-canvas-light text-foreground-light",
  dark: "bg-canvas-dark text-foreground-dark",
};

export function SurfaceLayout({
  surface,
  children,
  className = "",
}: SurfaceLayoutProps) {
  return (
    <div className={`min-h-full flex flex-col ${surfaceClasses[surface]} ${className}`}>
      {children}
    </div>
  );
}
