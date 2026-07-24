import { getTrafficStats } from "@/lib/data/reporting";
import { resolveReportRange, rangeQueryString } from "@/lib/report-range";
import { ReportingTabs } from "@/components/admin/reporting-tabs";
import { type SearchParams } from "@/lib/search-params";

export default async function ReportingTrafficPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { range, preset } = resolveReportRange(params);
  const stats = await getTrafficStats(range);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Traffic</h1>
        <p className="text-sm text-muted-foreground">
          Besucher und Seitenaufrufe im Zeitverlauf, Herkunft, Kampagnen,
          Geräte und Länder.
        </p>
      </div>

      <ReportingTabs
        currentPath="/admin/reporting/traffic"
        preset={preset}
        rangeQuery={rangeQueryString(params)}
      />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Besucher &amp; Seitenaufrufe im Zeitverlauf</h2>
        {stats.timeline.length === 0 ? (
          <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Besucher</th>
                  <th className="px-4 py-3">Seitenaufrufe</th>
                </tr>
              </thead>
              <tbody>
                {stats.timeline.map((row) => (
                  <tr key={row.date} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {new Date(row.date).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.visitors}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.pageViews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Top-Referrer</h2>
          {stats.topReferrers.length === 0 ? (
            <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {stats.topReferrers.map((row) => (
                <li key={row.referrer} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="text-foreground">{row.referrer}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">UTM-Kampagnen</h2>
          {stats.utmCampaigns.length === 0 ? (
            <p className="text-muted-foreground">Keine Kampagnen-Klicks im gewählten Zeitraum.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {stats.utmCampaigns.map((row) => (
                <li key={row.campaign} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="text-foreground">{row.campaign}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Geräte</h2>
          {stats.deviceBreakdown.length === 0 ? (
            <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {stats.deviceBreakdown.map((row) => (
                <li key={row.device} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="text-foreground capitalize">{row.device}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Länder</h2>
          {stats.countryBreakdown.length === 0 ? (
            <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {stats.countryBreakdown.map((row) => (
                <li key={row.country} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="text-foreground">{row.country}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
