import { createAdminClient } from "@/lib/supabase/admin";
import type { ContentType, SearchResultRow } from "@/lib/types";

export interface GroupedSearchResults {
  accommodation: SearchResultRow[];
  activity: SearchResultRow[];
  micro_adventure: SearchResultRow[];
}

export async function searchAllContent(
  query: string
): Promise<GroupedSearchResults> {
  const trimmed = query.trim();
  const empty: GroupedSearchResults = {
    accommodation: [],
    activity: [],
    micro_adventure: [],
  };
  if (!trimmed) return empty;

  const supabase = createAdminClient();
  const { data } = await supabase.rpc("search_all_content", {
    search_query: trimmed,
  });

  const rows = (data ?? []) as SearchResultRow[];
  const grouped = { ...empty };
  for (const row of rows) {
    grouped[row.content_type as Exclude<ContentType, never>].push(row);
  }
  return grouped;
}
