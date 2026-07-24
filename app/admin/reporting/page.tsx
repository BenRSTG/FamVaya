import Link from "next/link";
import { getOverviewStats } from "@/lib/data/reporting";
import { resolveReportRange, rangeQueryString } from "@/lib/report-range";
import { ReportingTabs } from "@/components/admin/reporting-tabs";
import { type SearchParams } from "@/lib/search-params";

function formatPercent(value: number | null): string {
  return value != null ? `${(value * 100).toFixed(1)} %` : "–";
}

export default async function ReportingOverviewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { range, preset } = resolveReportRange(params);
  const stats = await getOverviewStats(range);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reporting</h1>
        <p className="text-sm text-muted-foreground">
          Besucher, Herkunft, Content-Performance und Conversion-Funnel — die
          Datengrundlage für Content- und Priorisierungsentscheidungen.
        </p>
      </div>

      <ReportingTabs
        currentPath="/admin/reporting"
        preset={preset}
        rangeQuery={rangeQueryString(params)}
      />

      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
        <p className="text-sm text-muted-foreground">Conversion-Rate (Matcher → Anbieter-Klick)</p>
        <p className="text-3xl font-semibold text-foreground">{formatPercent(stats.conversionRate)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{stats.visitors}</p>
          <p className="text-sm text-muted-foreground">Besucher</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{stats.pageViews}</p>
          <p className="text-sm text-muted-foreground">Seitenaufrufe</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{stats.matcherSubmits}</p>
          <p className="text-sm text-muted-foreground">Matcher-Nutzungen</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{stats.ctaClicks}</p>
          <p className="text-sm text-muted-foreground">CTA-Klicks</p>
        </div>
        <div className="rounded-2xl border border-border p-4 sm:col-span-2">
          <p className="text-2xl font-semibold text-foreground">
            {stats.zeroResultCount}
            {stats.zeroResultRate != null && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({formatPercent(stats.zeroResultRate)} aller Seitenaufrufe)
              </span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">Suchen ohne Treffer im Zeitraum</p>
        </div>
      </div>

      <Link
        href={`/admin/reporting/export?view=overview&${rangeQueryString(params)}`}
        className="w-fit rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
      >
        Als CSV exportieren
      </Link>
    </div>
  );
}
