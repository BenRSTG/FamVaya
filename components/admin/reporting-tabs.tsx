import Link from "next/link";
import { cn } from "@/lib/utils";
import { PRESET_LABEL } from "@/lib/report-range";
import { filterInputClass } from "@/components/filter-field";
import { Button } from "@/components/ui/button";

const TABS = [
  { href: "/admin/reporting", label: "Übersicht" },
  { href: "/admin/reporting/traffic", label: "Traffic" },
  { href: "/admin/reporting/content", label: "Content-Performance" },
  { href: "/admin/reporting/funnel", label: "Funnel" },
  { href: "/admin/reporting/zero-result", label: "Zero-Result-Log" },
] as const;

// Gemeinsame Reiter-Navigation + Zeitraum-Filter für alle 5 Reporting-
// Unterseiten (siehe DECISIONS.md Phase 13). rangeQuery erhält den
// gewählten Zeitraum beim Tab-Wechsel aufrecht; die Preset-/Datumsfelder
// wirken jeweils nur auf die aktuelle Unterseite.
export function ReportingTabs({
  currentPath,
  preset,
  rangeQuery,
}: {
  currentPath: string;
  preset: string;
  rangeQuery: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={`${tab.href}?${rangeQuery}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              currentPath === tab.href
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(PRESET_LABEL).map(([key, label]) => (
          <Link
            key={key}
            href={`${currentPath}?preset=${key}`}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium",
              preset === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:bg-secondary"
            )}
          >
            {label}
          </Link>
        ))}
        <form method="get" action={currentPath} className="flex items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Von
            <input type="date" name="from" className={filterInputClass} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Bis
            <input type="date" name="to" className={filterInputClass} />
          </label>
          <Button type="submit" size="sm" variant="outline">
            Zeitraum anwenden
          </Button>
        </form>
      </div>
    </div>
  );
}
