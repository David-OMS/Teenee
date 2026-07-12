type PrimaryButtonProps = {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "accent" | "ghost";
};

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "accent",
}: PrimaryButtonProps) {
  const classes =
    variant === "accent"
      ? "bg-accent text-white hover:opacity-90"
      : "bg-surface-light text-foreground-light";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-11 w-full rounded-full text-sm font-semibold transition-opacity disabled:opacity-40 ${classes}`}
    >
      {children}
    </button>
  );
}
