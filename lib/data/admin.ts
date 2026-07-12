import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContentStatus, ContentType } from "@/lib/types";

export type StatusCounts = Record<ContentStatus, number>;

const EMPTY_STATUS_COUNTS: StatusCounts = {
  draft: 0,
  in_review: 0,
  published: 0,
  paused: 0,
  archived: 0,
};

async function getStatusCounts(table: string): Promise<StatusCounts> {
  const supabase = createAdminClient();
  const { data } = await supabase.from(table).select("status");
  const counts = { ...EMPTY_STATUS_COUNTS };
  for (const row of data ?? []) {
    counts[row.status as ContentStatus] += 1;
  }
  return counts;
}

export interface RecentContentItem {
  contentType: ContentType | "article";
  id: string;
  title: string;
  status: ContentStatus;
  updated_at: string;
}

const EDIT_PATH_BY_TYPE: Record<ContentType | "article", string> = {
  accommodation: "/admin/unterkuenfte",
  activity: "/admin/aktivitaeten",
  micro_adventure: "/admin/mikro-abenteuer",
  article: "/admin/magazin",
};

export function editHrefForRecentItem(item: RecentContentItem): string {
  return `${EDIT_PATH_BY_TYPE[item.contentType]}/${item.id}`;
}

export interface DashboardStats {
  accommodations: StatusCounts;
  activities: StatusCounts;
  microAdventures: StatusCounts;
  articleCount: number;
  expiredCount: number;
  totalClicks: number;
  newsletterSubscribers: number;
  newUsersLast7Days: number;
  recentlyUpdated: RecentContentItem[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    accommodations,
    activities,
    microAdventures,
    { count: articleCount },
    { count: expiredAccommodations },
    { count: expiredActivities },
    { count: totalClicks },
    { count: newsletterSubscribers },
    { count: newUsersLast7Days },
    recentAccommodations,
    recentActivities,
    recentMicroAdventures,
    recentArticles,
  ] = await Promise.all([
    getStatusCounts("accommodations"),
    getStatusCounts("activities"),
    getStatusCounts("micro_adventures"),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase
      .from("accommodations")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .lt("expires_at", now),
    supabase
      .from("activities")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .lt("expires_at", now),
    supabase.from("outbound_clicks").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("accommodations")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("activities")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("micro_adventures")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(10),
    supabase
      .from("articles")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(10),
  ]);

  const recentlyUpdated: RecentContentItem[] = [
    ...(recentAccommodations.data ?? []).map((row) => ({ ...row, contentType: "accommodation" as const })),
    ...(recentActivities.data ?? []).map((row) => ({ ...row, contentType: "activity" as const })),
    ...(recentMicroAdventures.data ?? []).map((row) => ({ ...row, contentType: "micro_adventure" as const })),
    ...(recentArticles.data ?? []).map((row) => ({ ...row, contentType: "article" as const })),
  ]
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
    .slice(0, 10);

  return {
    accommodations,
    activities,
    microAdventures,
    articleCount: articleCount ?? 0,
    expiredCount: (expiredAccommodations ?? 0) + (expiredActivities ?? 0),
    totalClicks: totalClicks ?? 0,
    newsletterSubscribers: newsletterSubscribers ?? 0,
    newUsersLast7Days: newUsersLast7Days ?? 0,
    recentlyUpdated,
  };
}
