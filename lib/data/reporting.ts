import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DateRange {
  from: string;
  to: string;
}

function previousRange(range: DateRange): DateRange {
  const fromMs = new Date(range.from).getTime();
  const toMs = new Date(range.to).getTime();
  const durationMs = toMs - fromMs;
  return {
    from: new Date(fromMs - durationMs).toISOString(),
    to: new Date(fromMs).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Übersicht

export interface OverviewStats {
  visitors: number;
  pageViews: number;
  matcherSubmits: number;
  zeroResultCount: number;
  zeroResultRate: number | null;
  ctaClicks: number;
  conversionRate: number | null; // Sessions mit cta_clicked ÷ Sessions mit matcher_submit
}

export async function getOverviewStats(range: DateRange): Promise<OverviewStats> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("event_type, session_id")
    .gte("created_at", range.from)
    .lte("created_at", range.to)
    .in("event_type", [
      "page_view",
      "matcher_submit",
      "zero_result_search",
      "cta_clicked",
    ]);

  const rows = data ?? [];
  const visitorSessions = new Set<string>();
  const matcherSessions = new Set<string>();
  const ctaSessions = new Set<string>();
  let pageViews = 0;
  let matcherSubmits = 0;
  let zeroResultCount = 0;
  let ctaClicks = 0;

  for (const row of rows) {
    if (row.event_type === "page_view") {
      pageViews += 1;
      if (row.session_id) visitorSessions.add(row.session_id);
    } else if (row.event_type === "matcher_submit") {
      matcherSubmits += 1;
      if (row.session_id) matcherSessions.add(row.session_id);
    } else if (row.event_type === "zero_result_search") {
      zeroResultCount += 1;
    } else if (row.event_type === "cta_clicked") {
      ctaClicks += 1;
      if (row.session_id) ctaSessions.add(row.session_id);
    }
  }

  let convertedSessions = 0;
  for (const session of matcherSessions) {
    if (ctaSessions.has(session)) convertedSessions += 1;
  }

  return {
    visitors: visitorSessions.size,
    pageViews,
    matcherSubmits,
    zeroResultCount,
    zeroResultRate: pageViews > 0 ? zeroResultCount / pageViews : null,
    ctaClicks,
    conversionRate: matcherSessions.size > 0 ? convertedSessions / matcherSessions.size : null,
  };
}

// ---------------------------------------------------------------------------
// Traffic

export interface TrafficStats {
  timeline: { date: string; visitors: number; pageViews: number }[];
  topReferrers: { referrer: string; count: number }[];
  utmCampaigns: { campaign: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  countryBreakdown: { country: string; count: number }[];
}

export async function getTrafficStats(range: DateRange): Promise<TrafficStats> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("session_id, created_at, referrer_domain, utm_campaign, device_type, country")
    .eq("event_type", "page_view")
    .gte("created_at", range.from)
    .lte("created_at", range.to);

  const rows = data ?? [];
  const dayBuckets = new Map<string, { visitors: Set<string>; pageViews: number }>();
  const referrerCounts = new Map<string, number>();
  const campaignCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const seenSessionReferrer = new Set<string>();

  for (const row of rows) {
    const day = String(row.created_at).slice(0, 10);
    const bucket = dayBuckets.get(day) ?? { visitors: new Set<string>(), pageViews: 0 };
    bucket.pageViews += 1;
    if (row.session_id) bucket.visitors.add(row.session_id);
    dayBuckets.set(day, bucket);

    if (row.session_id && !seenSessionReferrer.has(row.session_id)) {
      seenSessionReferrer.add(row.session_id);
      const referrer = row.referrer_domain ?? "Direkt / Unbekannt";
      referrerCounts.set(referrer, (referrerCounts.get(referrer) ?? 0) + 1);
    }

    if (row.utm_campaign) {
      campaignCounts.set(row.utm_campaign, (campaignCounts.get(row.utm_campaign) ?? 0) + 1);
    }
    const device = row.device_type ?? "unbekannt";
    deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);
    const country = row.country ?? "unbekannt";
    countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
  }

  return {
    timeline: [...dayBuckets.entries()]
      .map(([date, bucket]) => ({ date, visitors: bucket.visitors.size, pageViews: bucket.pageViews }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    topReferrers: [...referrerCounts.entries()]
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    utmCampaigns: [...campaignCounts.entries()]
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    deviceBreakdown: [...deviceCounts.entries()]
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count),
    countryBreakdown: [...countryCounts.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}

// ---------------------------------------------------------------------------
// Content-Performance

export interface ContentPerformanceRow {
  entityType: string;
  entityId: string;
  title: string;
  href: string;
  views: number;
  clicks: number;
  ctr: number | null;
}

const ENTITY_TABLE: Record<string, string> = {
  accommodation: "accommodations",
  activity: "activities",
  micro_adventure: "micro_adventures",
  article: "articles",
};

const ENTITY_HREF_PREFIX: Record<string, string> = {
  accommodation: "/familienunterkuenfte",
  activity: "/familienaktivitaeten",
  micro_adventure: "/mikro-familienabenteuer",
  article: "/magazin",
};

async function resolveEntityLabels(
  idsByType: Map<string, Set<string>>
): Promise<Map<string, { title: string; href: string }>> {
  const supabase = createAdminClient();
  const labels = new Map<string, { title: string; href: string }>();

  await Promise.all(
    [...idsByType.entries()].map(async ([entityType, ids]) => {
      const table = ENTITY_TABLE[entityType];
      if (!table || ids.size === 0) return;
      const { data } = await supabase
        .from(table)
        .select("id, title, slug")
        .in("id", [...ids]);
      for (const row of data ?? []) {
        labels.set(`${entityType}:${row.id}`, {
          title: row.title as string,
          href: `${ENTITY_HREF_PREFIX[entityType]}/${row.slug}`,
        });
      }
    })
  );

  return labels;
}

export async function getContentPerformanceStats(
  range: DateRange
): Promise<{ top: ContentPerformanceRow[]; magazine: ContentPerformanceRow[] }> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("event_type, entity_type, entity_id")
    .in("event_type", ["listing_viewed", "cta_clicked"])
    .gte("created_at", range.from)
    .lte("created_at", range.to)
    .not("entity_type", "is", null)
    .not("entity_id", "is", null);

  const rows = data ?? [];
  const counts = new Map<string, { entityType: string; entityId: string; views: number; clicks: number }>();

  for (const row of rows) {
    const entityType = row.entity_type as string;
    const entityId = row.entity_id as string;
    const key = `${entityType}:${entityId}`;
    const entry = counts.get(key) ?? { entityType, entityId, views: 0, clicks: 0 };
    if (row.event_type === "listing_viewed") entry.views += 1;
    else entry.clicks += 1;
    counts.set(key, entry);
  }

  const ranked = [...counts.values()].sort((a, b) => b.views - a.views);

  const idsByType = new Map<string, Set<string>>();
  for (const entry of ranked) {
    const set = idsByType.get(entry.entityType) ?? new Set<string>();
    set.add(entry.entityId);
    idsByType.set(entry.entityType, set);
  }
  const labels = await resolveEntityLabels(idsByType);

  const toRow = (entry: (typeof ranked)[number]): ContentPerformanceRow => {
    const label = labels.get(`${entry.entityType}:${entry.entityId}`);
    return {
      entityType: entry.entityType,
      entityId: entry.entityId,
      title: label?.title ?? "(gelöschter Eintrag)",
      href: label?.href ?? "#",
      views: entry.views,
      clicks: entry.clicks,
      ctr: entry.views > 0 ? entry.clicks / entry.views : null,
    };
  };

  return {
    top: ranked.slice(0, 15).map(toRow),
    magazine: ranked
      .filter((entry) => entry.entityType === "article")
      .slice(0, 10)
      .map(toRow),
  };
}

// ---------------------------------------------------------------------------
// Funnel

const LISTING_OVERVIEW_PREFIXES = [
  "/familienunterkuenfte",
  "/familienaktivitaeten",
  "/mikro-familienabenteuer",
];

type FunnelStageKey =
  | "home_view"
  | "matcher_submit"
  | "listing_overview_view"
  | "listing_viewed"
  | "cta_clicked";

const FUNNEL_STAGE_LABELS: Record<FunnelStageKey, string> = {
  home_view: "Seitenaufruf (Startseite)",
  matcher_submit: "Matcher benutzt",
  listing_overview_view: "Ergebnisliste angesehen",
  listing_viewed: "Angebot im Detail angesehen",
  cta_clicked: "Anbieter-CTA geklickt",
};

const FUNNEL_STAGE_ORDER: FunnelStageKey[] = [
  "home_view",
  "matcher_submit",
  "listing_overview_view",
  "listing_viewed",
  "cta_clicked",
];

export interface FunnelStage {
  key: FunnelStageKey;
  label: string;
  count: number;
  pctOfPrevious: number | null;
}

async function computeFunnelStages(range: DateRange): Promise<FunnelStage[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("session_id, event_type, page_path")
    .in("event_type", ["page_view", "matcher_submit", "listing_viewed", "cta_clicked"])
    .not("session_id", "is", null)
    .gte("created_at", range.from)
    .lte("created_at", range.to);

  const sessionStages = new Map<string, Set<FunnelStageKey>>();
  for (const row of data ?? []) {
    const sessionId = row.session_id as string;
    const stages = sessionStages.get(sessionId) ?? new Set<FunnelStageKey>();

    if (row.event_type === "page_view" && row.page_path === "/") {
      stages.add("home_view");
    } else if (row.event_type === "page_view" && LISTING_OVERVIEW_PREFIXES.some((p) => row.page_path?.startsWith(p))) {
      stages.add("listing_overview_view");
    } else if (row.event_type === "matcher_submit") {
      stages.add("matcher_submit");
    } else if (row.event_type === "listing_viewed") {
      stages.add("listing_viewed");
    } else if (row.event_type === "cta_clicked") {
      stages.add("cta_clicked");
    }

    sessionStages.set(sessionId, stages);
  }

  let qualifying = [...sessionStages.values()];
  const stages: FunnelStage[] = [];
  let previousCount: number | null = null;

  for (const key of FUNNEL_STAGE_ORDER) {
    qualifying = qualifying.filter((stageSet) => stageSet.has(key));
    const count = qualifying.length;
    stages.push({
      key,
      label: FUNNEL_STAGE_LABELS[key],
      count,
      pctOfPrevious: previousCount != null && previousCount > 0 ? count / previousCount : null,
    });
    previousCount = count;
  }

  return stages;
}

export interface FunnelStats {
  current: FunnelStage[];
  previous: FunnelStage[];
}

export async function getFunnelStats(range: DateRange): Promise<FunnelStats> {
  const [current, previous] = await Promise.all([
    computeFunnelStages(range),
    computeFunnelStages(previousRange(range)),
  ]);
  return { current, previous };
}

// ---------------------------------------------------------------------------
// Zero-Result-Log

export interface ZeroResultRow {
  id: string;
  pagePath: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ZeroResultLog {
  last7Days: number;
  last30Days: number;
  recent: ZeroResultRow[];
}

export function formatEventMetadata(metadata: Record<string, unknown>): string {
  const entries = Object.entries(metadata).filter(([, v]) => v != null && v !== "");
  if (entries.length === 0) return "–";
  return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
}

export async function getZeroResultLog(range: DateRange): Promise<ZeroResultLog> {
  const supabase = createAdminClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: last7Days }, { count: last30Days }, { data: recent }] = await Promise.all([
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "zero_result_search")
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "zero_result_search")
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("events")
      .select("id, page_path, metadata, created_at")
      .eq("event_type", "zero_result_search")
      .gte("created_at", range.from)
      .lte("created_at", range.to)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return {
    last7Days: last7Days ?? 0,
    last30Days: last30Days ?? 0,
    recent: (recent ?? []).map((row) => ({
      id: row.id as string,
      pagePath: row.page_path as string | null,
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      createdAt: row.created_at as string,
    })),
  };
}

// ---------------------------------------------------------------------------
// Matcher-Nutzung

export interface MatcherStat {
  adults: number;
  children: number;
  area: string;
  count: number;
}

export async function getMatcherStats(range: DateRange): Promise<MatcherStat[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("metadata")
    .eq("event_type", "matcher_submit")
    .gte("created_at", range.from)
    .lte("created_at", range.to);

  const counts = new Map<string, MatcherStat>();
  for (const row of data ?? []) {
    const metadata = (row.metadata as Record<string, unknown>) ?? {};
    const adults = Number(metadata.adults ?? 0);
    const children = Number(metadata.children ?? 0);
    const area = String(metadata.area ?? "unentschlossen");
    const key = `${adults}-${children}-${area}`;
    const existing = counts.get(key);
    if (existing) existing.count += 1;
    else counts.set(key, { adults, children, area, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 20);
}
