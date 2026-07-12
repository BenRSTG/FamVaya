import { createAdminClient } from "@/lib/supabase/admin";
import type { Category, MicroAdventure, MicroAdventureFilters } from "@/lib/types";
import {
  getAgeGroupsForContent,
  getCategoriesByContentType,
  getContentIdsByTagSlugs,
  getCoverImageForContent,
  getCoverImagesForContents,
  getTagsForContent,
} from "@/lib/data/shared";

const LIST_SELECT = `
  id, title, slug, short_description,
  duration_min, duration_max, cost_level, estimated_total_cost,
  preparation_level, difficulty_level, indoor, outdoor,
  seasonal_tags, weather_tags, location_optional,
  status, featured,
  category:categories(id, name, slug)
`;

const DETAIL_SELECT = `
  id, title, slug, short_description, full_description,
  duration_min, duration_max, cost_level, estimated_total_cost,
  preparation_level, difficulty_level, indoor, outdoor,
  seasonal_tags, weather_tags, materials, instructions, location_optional,
  external_url, affiliate_url, status, featured,
  category:categories(id, name, slug)
`;

export async function getFeaturedMicroAdventures(
  limit: number
): Promise<MicroAdventure[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("micro_adventures")
    .select(LIST_SELECT)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  return attachListExtras(data ?? []);
}

export async function getPublishedMicroAdventures(
  filters: MicroAdventureFilters = {}
): Promise<MicroAdventure[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("micro_adventures")
    .select(LIST_SELECT)
    .eq("status", "published");

  if (filters.costLevel) {
    query = query.eq("cost_level", filters.costLevel);
  }
  if (filters.preparationLevel && filters.preparationLevel.length > 0) {
    query = query.in("preparation_level", filters.preparationLevel);
  }
  if (filters.indoorOutdoor === "indoor") {
    query = query.eq("indoor", true);
  } else if (filters.indoorOutdoor === "outdoor") {
    query = query.eq("outdoor", true);
  }
  if (filters.maxPrice != null) {
    query = query.lte("estimated_total_cost", filters.maxPrice);
  }
  if (filters.categorySlug) {
    const categories = await getMicroAdventureCategories();
    const category = categories.find((c) => c.slug === filters.categorySlug);
    query = query.eq("category_id", category?.id ?? "00000000-0000-0000-0000-000000000000");
  }
  if (filters.tagSlugs && filters.tagSlugs.length > 0) {
    const ids = await getContentIdsByTagSlugs("micro_adventure", filters.tagSlugs);
    query = query.in("id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"]);
  }

  const { data } = await query
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  return attachListExtras(data ?? []);
}

export async function getMicroAdventureCategories(): Promise<Category[]> {
  return getCategoriesByContentType("micro_adventure");
}

export async function getMicroAdventureBySlug(
  slug: string
): Promise<MicroAdventure | null> {
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("micro_adventures")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!row) return null;

  const [ageGroups, tags, coverMedia] = await Promise.all([
    getAgeGroupsForContent("micro_adventure", row.id),
    getTagsForContent("micro_adventure", row.id),
    getCoverImageForContent("micro_adventure", row.id),
  ]);

  return {
    ...(row as unknown as MicroAdventure),
    age_groups: ageGroups,
    tags,
    cover_media: coverMedia,
  };
}

async function attachListExtras(
  rows: Record<string, unknown>[]
): Promise<MicroAdventure[]> {
  const ids = rows.map((r) => r.id as string);
  const coverByContentId = await getCoverImagesForContents(
    "micro_adventure",
    ids
  );

  return rows.map((row) => ({
    ...(row as unknown as MicroAdventure),
    age_groups: [],
    tags: [],
    cover_media: coverByContentId.get(row.id as string) ?? null,
  }));
}
