export const filterInputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-ring";

export function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-32 flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
