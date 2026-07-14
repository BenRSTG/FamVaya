import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function logZeroResultSearch(params: {
  query?: string | null;
  filters?: Record<string, unknown>;
}): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("search_events").insert({
    query: params.query ?? null,
    filters: params.filters ?? {},
    result_count: 0,
  });
}

export interface ZeroResultSearchRow {
  id: string;
  query: string | null;
  filters: Record<string, unknown>;
  created_at: string;
}

export interface ZeroResultSearchStats {
  last7Days: number;
  last30Days: number;
  recent: ZeroResultSearchRow[];
}

export async function getZeroResultSearchStats(): Promise<ZeroResultSearchStats> {
  const supabase = createAdminClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: last7Days }, { count: last30Days }, { data: recent }] = await Promise.all([
    supabase
      .from("search_events")
      .select("id", { count: "exact", head: true })
      .eq("result_count", 0)
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("search_events")
      .select("id", { count: "exact", head: true })
      .eq("result_count", 0)
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("search_events")
      .select("id, query, filters, created_at")
      .eq("result_count", 0)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return {
    last7Days: last7Days ?? 0,
    last30Days: last30Days ?? 0,
    recent: recent ?? [],
  };
}

export function formatSearchFilters(filters: Record<string, unknown>): string {
  const entries = Object.entries(filters).filter(([, v]) => v != null && v !== "");
  if (entries.length === 0) return "–";
  return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
}
