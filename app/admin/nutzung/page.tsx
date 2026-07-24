import Link from "next/link";
import {
  getVisitorStats,
  getMatcherStats,
  getNewsletterSignupTimeline,
  type DateRange,
} from "@/lib/data/analytics";
import { cn } from "@/lib/utils";
import { filterInputClass } from "@/components/filter-field";
import { Button } from "@/components/ui/button";
import { toStringParam, type SearchParams } from "@/lib/search-params";

const PRESET_DAYS: Record<string, number> = { today: 1, "7d": 7, "30d": 30 };
const PRESET_LABEL: Record<string, string> = { today: "Heute", "7d": "7 Tage", "30d": "30 Tage" };

const AREA_LABEL: Record<string, string> = {
  unterkunft: "Unterkunft",
  aktivitaet: "Aktivität",
  mikroabenteuer: "Mikro-Abenteuer",
  unentschlossen: "Unentschlossen",
};

function resolveRange(params: SearchParams): { range: DateRange; preset: string } {
  const from = toStringParam(params.from);
  const to = toStringParam(params.to);
  if (from && to) {
    const toEnd = new Date(to);
    toEnd.setDate(toEnd.getDate() + 1);
    return { range: { from: new Date(from).toISOString(), to: toEnd.toISOString() }, preset: "custom" };
  }
  const preset = toStringParam(params.preset) ?? "7d";
  const days = PRESET_DAYS[preset] ?? 7;
  const now = new Date();
  const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { range: { from: fromDate.toISOString(), to: now.toISOString() }, preset };
}

export default async function NutzungPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { range, preset } = resolveRange(params);

  const [visitorStats, matcherStats, newsletterTimeline] = await Promise.all([
    getVisitorStats(range),
    getMatcherStats(range),
    getNewsletterSignupTimeline(range),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Nutzung</h1>
        <p className="text-sm text-muted-foreground">
          Besucher, Herkunft, Sitzungsdauer und meistgesehene Inhalte —
          first-party erfasst, ergänzt die parallel laufende Vercel Web
          Analytics (siehe README.md).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(PRESET_LABEL).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/nutzung?preset=${key}`}
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
        <form method="get" className="flex items-end gap-2">
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{visitorStats.visitors}</p>
          <p className="text-sm text-muted-foreground">Besucher</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">{visitorStats.pageViews}</p>
          <p className="text-sm text-muted-foreground">Seitenaufrufe</p>
        </div>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-2xl font-semibold text-foreground">
            {visitorStats.avgSessionMinutes != null ? `${visitorStats.avgSessionMinutes.toFixed(1)} Min.` : "–"}
          </p>
          <p className="text-sm text-muted-foreground">Ø Sitzungsdauer (Näherung)</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Aufrufe nach Bereich</h2>
          {visitorStats.byArea.length === 0 ? (
            <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {visitorStats.byArea.map((row) => (
                <li key={row.area} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="text-foreground">{row.area}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Top-Referrer</h2>
          {visitorStats.topReferrers.length === 0 ? (
            <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {visitorStats.topReferrers.map((row) => (
                <li key={row.referrer} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="text-foreground">{row.referrer}</span>
                  <span className="text-muted-foreground">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Meistgesehene Seiten</h2>
        {visitorStats.topPaths.length === 0 ? (
          <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Pfad</th>
                  <th className="px-4 py-3">Aufrufe</th>
                </tr>
              </thead>
              <tbody>
                {visitorStats.topPaths.map((row) => (
                  <tr key={row.path} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.path}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Matcher-Konstellationen (Schneller Familien-Check)
        </h2>
        {matcherStats.length === 0 ? (
          <p className="text-muted-foreground">Keine Daten im gewählten Zeitraum.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Erwachsene</th>
                  <th className="px-4 py-3">Kinder</th>
                  <th className="px-4 py-3">Ziel</th>
                  <th className="px-4 py-3">Häufigkeit</th>
                </tr>
              </thead>
              <tbody>
                {matcherStats.map((row) => (
                  <tr
                    key={`${row.adults}-${row.children}-${row.area}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 text-foreground">{row.adults}</td>
                    <td className="px-4 py-3 text-foreground">{row.children}</td>
                    <td className="px-4 py-3 text-foreground">{AREA_LABEL[row.area] ?? row.area}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Newsletter-Anmeldungen im Zeitverlauf</h2>
        {newsletterTimeline.length === 0 ? (
          <p className="text-muted-foreground">Keine Anmeldungen im gewählten Zeitraum.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {newsletterTimeline.map((row) => (
              <li key={row.date} className="flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                <span className="text-foreground">{new Date(row.date).toLocaleDateString("de-DE")}</span>
                <span className="text-muted-foreground">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/admin/such-insights"
        className="rounded-2xl border border-border p-4 text-sm font-medium text-primary hover:bg-secondary"
      >
        Zero-Result-Insights ansehen →
      </Link>
    </div>
  );
}
