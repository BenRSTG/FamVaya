import Link from "next/link";
import { getContentPerformanceStats, type ContentPerformanceRow } from "@/lib/data/reporting";
import { resolveReportRange, rangeQueryString } from "@/lib/report-range";
import { ReportingTabs } from "@/components/admin/reporting-tabs";
import { type SearchParams } from "@/lib/search-params";

function formatCtr(value: number | null): string {
  return value != null ? `${(value * 100).toFixed(1)} %` : "–";
}

function PerformanceTable({ rows }: { rows: ContentPerformanceRow[] }) {
  if (rows.length === 0) {
    return <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Angebot</th>
            <th className="px-4 py-3">Aufrufe</th>
            <th className="px-4 py-3">CTA-Klicks</th>
            <th className="px-4 py-3">CTR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.entityType}:${row.entityId}`} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">
                <Link href={row.href} className="hover:underline">
                  {row.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{row.views}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.clicks}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatCtr(row.ctr)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ReportingContentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { range, preset } = resolveReportRange(params);
  const stats = await getContentPerformanceStats(range);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Content-Performance</h1>
        <p className="text-sm text-muted-foreground">
          Meistaufgerufene und meistgeklickte Angebote, Klickrate (CTA-Klicks
          ÷ Aufrufe) als Hinweis darauf, welche Angebote überdurchschnittlich
          überzeugen.
        </p>
      </div>

      <ReportingTabs
        currentPath="/admin/reporting/content"
        preset={preset}
        rangeQuery={rangeQueryString(params)}
      />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Meistaufgerufene Angebote</h2>
        <PerformanceTable rows={stats.top} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Magazin-Performance</h2>
        <PerformanceTable rows={stats.magazine} />
      </div>

      <Link
        href={`/admin/reporting/export?view=content&${rangeQueryString(params)}`}
        className="w-fit rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
      >
        Als CSV exportieren
      </Link>
    </div>
  );
}
