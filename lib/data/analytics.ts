import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DateRange {
  from: string;
  to: string;
}

export interface VisitorStats {
  visitors: number;
  pageViews: number;
  avgSessionMinutes: number | null;
  byArea: { area: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  topPaths: { path: string; count: number }[];
}

const AREA_PREFIXES: { prefix: string; label: string }[] = [
  { prefix: "/familienunterkuenfte", label: "Familienunterkünfte" },
  { prefix: "/familienaktivitaeten", label: "Familienaktivitäten" },
  { prefix: "/mikro-familienabenteuer", label: "Mikro-Familienabenteuer" },
  { prefix: "/magazin", label: "Magazin" },
  { prefix: "/admin", label: "Admin" },
];

function areaLabelForPath(path: string): string {
  return AREA_PREFIXES.find((a) => path.startsWith(a.prefix))?.label ?? "Sonstige";
}

function referrerDomain(referrer: string | null): string {
  if (!referrer) return "Direkt / Unbekannt";
  try {
    const url = new URL(referrer);
    if (url.hostname.includes("famvaya")) return "Intern";
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "Direkt / Unbekannt";
  }
}

// Aggregiert clientseitig statt über SQL GROUP BY — beim aktuellen
// Traffic-Volumen unproblematisch, siehe DECISIONS.md Phase 12 (bei
// deutlich mehr Zeilen wäre eine Postgres-Funktion der nächste Schritt).
export async function getVisitorStats(range: DateRange): Promise<VisitorStats> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("page_views")
    .select("session_id, path, referrer, created_at")
    .gte("created_at", range.from)
    .lte("created_at", range.to);

  const rows = data ?? [];
  const sessions = new Map<string, { first: string; last: string; referrer: string | null }>();
  const pathCounts = new Map<string, number>();
  const areaCounts = new Map<string, number>();

  for (const row of rows) {
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);
    const area = areaLabelForPath(row.path);
    areaCounts.set(area, (areaCounts.get(area) ?? 0) + 1);

    const existing = sessions.get(row.session_id);
    if (!existing) {
      sessions.set(row.session_id, { first: row.created_at, last: row.created_at, referrer: row.referrer });
    } else {
      if (row.created_at < existing.first) {
        existing.first = row.created_at;
        existing.referrer = row.referrer;
      }
      if (row.created_at > existing.last) existing.last = row.created_at;
    }
  }

  const durationsMinutes = [...sessions.values()].map(
    (s) => (new Date(s.last).getTime() - new Date(s.first).getTime()) / 60000
  );
  const avgSessionMinutes =
    durationsMinutes.length > 0
      ? durationsMinutes.reduce((sum, m) => sum + m, 0) / durationsMinutes.length
      : null;

  const referrerCounts = new Map<string, number>();
  for (const session of sessions.values()) {
    const domain = referrerDomain(session.referrer);
    referrerCounts.set(domain, (referrerCounts.get(domain) ?? 0) + 1);
  }

  return {
    visitors: sessions.size,
    pageViews: rows.length,
    avgSessionMinutes,
    byArea: [...areaCounts.entries()]
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count),
    topReferrers: [...referrerCounts.entries()]
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    topPaths: [...pathCounts.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}

export interface MatcherStat {
  adults: number;
  children: number;
  area: string;
  count: number;
}

export async function getMatcherStats(range: DateRange): Promise<MatcherStat[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("matcher_submissions")
    .select("adults, children, area")
    .gte("created_at", range.from)
    .lte("created_at", range.to);

  const counts = new Map<string, MatcherStat>();
  for (const row of data ?? []) {
    const key = `${row.adults}-${row.children}-${row.area}`;
    const existing = counts.get(key);
    if (existing) existing.count += 1;
    else counts.set(key, { adults: row.adults, children: row.children, area: row.area, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 20);
}

export interface NewsletterSignupPoint {
  date: string;
  count: number;
}

export async function getNewsletterSignupTimeline(range: DateRange): Promise<NewsletterSignupPoint[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("created_at")
    .gte("created_at", range.from)
    .lte("created_at", range.to);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const date = String(row.created_at).slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
