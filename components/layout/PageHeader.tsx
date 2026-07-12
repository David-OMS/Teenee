type PageHeaderProps = {
  title: string;
  subtitle?: string;
  display?: boolean;
};

export function PageHeader({ title, subtitle, display = false }: PageHeaderProps) {
  return (
    <header className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4">
      <h1
        className={`${display ? "font-display text-3xl uppercase tracking-tight" : "text-2xl font-semibold tracking-tight"}`}
      >
        {title}
      </h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-light">{subtitle}</p> : null}
    </header>
  );
}
