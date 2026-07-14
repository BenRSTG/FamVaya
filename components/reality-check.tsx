import { CheckCircle2, Info } from "lucide-react";

export function RealityCheck({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2">
      {pros.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-base font-semibold text-foreground">
            Das spricht dafür
          </h2>
          <ul className="space-y-2">
            {pros.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-base font-semibold text-foreground">
            Das solltet ihr wissen
          </h2>
          <ul className="space-y-2">
            {cons.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
