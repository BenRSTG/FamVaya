import { getZeroResultLog, formatEventMetadata } from "@/lib/data/reporting";
import { resolveReportRange, rangeQueryString } from "@/lib/report-range";
import { ReportingTabs } from "@/components/admin/reporting-tabs";
import { type SearchParams } from "@/lib/search-params";

export default async function ReportingZeroResultPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { range, preset } = resolveReportRange(params);
  const log = await getZeroResultLog(range);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Zero-Result-Log</h1>
        <p className="text-sm text-muted-foreground">
          Suchen und Filter ohne Treffer — Grundlage dafür, welche Angebote
          als Nächstes beschafft werden sollten.
        </p>
      </div>

      <ReportingTabs
        currentPath="/admin/reporting/zero-result"
        preset={preset}
        rangeQuery={rangeQueryString(params)}
      />

      <div className="grid grid-cols-2 gap-4 sm:w-fit">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{log.last7Days}</p>
          <p className="text-sm text-muted-foreground">Suchen ohne Ergebnis (7 Tage)</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{log.last30Days}</p>
          <p className="text-sm text-muted-foreground">Suchen ohne Ergebnis (30 Tage)</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Letzte ergebnislose Suchen im gewählten Zeitraum</h2>
        {log.recent.length === 0 ? (
          <p className="text-muted-foreground">Keine ergebnislosen Suchen im gewählten Zeitraum.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Seite</th>
                  <th className="px-4 py-3">Kriterien</th>
                </tr>
              </thead>
              <tbody>
                {log.recent.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(row.createdAt).toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.pagePath ?? "–"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatEventMetadata(row.metadata)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
