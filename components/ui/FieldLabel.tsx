type FieldLabelProps = {
  children: string;
};

export function FieldLabel({ children }: FieldLabelProps) {
  return (
    <span className="text-xs font-medium uppercase tracking-widest text-muted-light">
      {children}
    </span>
  );
}
