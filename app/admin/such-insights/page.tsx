import {
  getZeroResultSearchStats,
  formatSearchFilters,
} from "@/lib/data/search-events";

export default async function SuchInsightsPage() {
  const stats = await getZeroResultSearchStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Such-Insights</h1>
        <p className="text-sm text-muted-foreground">
          Suchen und Filter, die zu keinem Ergebnis geführt haben — die
          günstigste Datenquelle dafür, welche Angebote als Nächstes
          beschafft werden sollten.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{stats.last7Days}</p>
          <p className="text-sm text-muted-foreground">
            Suchen ohne Ergebnis (7 Tage)
          </p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{stats.last30Days}</p>
          <p className="text-sm text-muted-foreground">
            Suchen ohne Ergebnis (30 Tage)
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Zuletzt ohne Ergebnis
        </h2>
        {stats.recent.length === 0 ? (
          <p className="text-muted-foreground">
            Noch keine ergebnislosen Suchen protokolliert.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Suchbegriff</th>
                  <th className="px-4 py-3">Filter</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(row.created_at).toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.query ?? "–"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatSearchFilters(row.filters)}
                    </td>
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
