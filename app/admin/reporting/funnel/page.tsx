import { getFunnelStats, type FunnelStage } from "@/lib/data/reporting";
import { resolveReportRange, rangeQueryString } from "@/lib/report-range";
import { ReportingTabs } from "@/components/admin/reporting-tabs";
import { type SearchParams } from "@/lib/search-params";

function FunnelList({ stages }: { stages: FunnelStage[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {stages.map((stage) => (
        <li key={stage.key} className="rounded-lg bg-secondary px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{stage.label}</span>
            <span className="text-sm text-muted-foreground">{stage.count}</span>
          </div>
          {stage.pctOfPrevious != null && (
            <p className="mt-1 text-xs text-muted-foreground">
              {(stage.pctOfPrevious * 100).toFixed(1)} % der vorherigen Stufe
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function ReportingFunnelPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { range, preset } = resolveReportRange(params);
  const stats = await getFunnelStats(range);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Funnel</h1>
        <p className="text-sm text-muted-foreground">
          Weg der Besucher von der Startseite über den Family Matcher bis zum
          Anbieter-Klick — als Näherung auf Sitzungsebene (siehe DECISIONS.md
          Phase 13), nicht als strikt chronologische Abfolge.
        </p>
      </div>

      <ReportingTabs
        currentPath="/admin/reporting/funnel"
        preset={preset}
        rangeQuery={rangeQueryString(params)}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Gewählter Zeitraum</h2>
          <FunnelList stages={stats.current} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Vorheriger Zeitraum (Vergleich)</h2>
          <FunnelList stages={stats.previous} />
        </div>
      </div>
    </div>
  );
}
