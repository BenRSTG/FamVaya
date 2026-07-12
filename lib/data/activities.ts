import { createAdminClient } from "@/lib/supabase/admin";
import type { Activity, ActivityFilters, Category } from "@/lib/types";
import {
  getAgeGroupsForContent,
  getCategoriesByContentType,
  getContentIdsByTagSlugs,
  getCoverImageForContent,
  getCoverImagesForContents,
  getTagsForContent,
} from "@/lib/data/shared";

const LIST_SELECT = `
  id, title, slug, short_description, city,
  duration_min, duration_max, indoor, outdoor, weather_suitable,
  adult_price, child_price, example_total_price, family_ticket,
  large_family_discount, booking_required,
  status, featured, family_rating,
  category:categories(id, name, slug),
  country:countries(id, name, code),
  region:regions(id, name, slug)
`;

const DETAIL_SELECT = `
  id, title, slug, short_description, full_description, city,
  duration_min, duration_max, indoor, outdoor, weather_suitable,
  adult_price, child_price, example_total_price, family_ticket,
  large_family_discount, booking_required,
  affiliate_url, external_url, status, featured, family_rating,
  category:categories(id, name, slug),
  country:countries(id, name, code),
  region:regions(id, name, slug)
`;

export async function getFeaturedActivities(limit: number): Promise<Activity[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("activities")
    .select(LIST_SELECT)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  return attachListExtras(data ?? []);
}

export async function getPublishedActivities(
  filters: ActivityFilters = {}
): Promise<Activity[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("activities")
    .select(LIST_SELECT)
    .eq("status", "published");

  if (filters.indoorOutdoor === "indoor") {
    query = query.eq("indoor", true);
  } else if (filters.indoorOutdoor === "outdoor") {
    query = query.eq("outdoor", true);
  }
  if (filters.maxPrice != null) {
    query = query.lte("example_total_price", filters.maxPrice);
  }
  if (filters.largeFamilyDiscount) {
    query = query.eq("large_family_discount", true);
  }
  if (filters.categorySlug) {
    const categories = await getActivityCategories();
    const category = categories.find((c) => c.slug === filters.categorySlug);
    query = query.eq("category_id", category?.id ?? "00000000-0000-0000-0000-000000000000");
  }
  if (filters.tagSlugs && filters.tagSlugs.length > 0) {
    const ids = await getContentIdsByTagSlugs("activity", filters.tagSlugs);
    query = query.in("id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"]);
  }

  const { data } = await query
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  return attachListExtras(data ?? []);
}

export async function getActivityCategories(): Promise<Category[]> {
  return getCategoriesByContentType("activity");
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("activities")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!row) return null;

  const [featuresResult, ageGroups, tags, coverMedia] = await Promise.all([
    supabase
      .from("activity_feature_links")
      .select("feature:activity_features(id, name, slug, group_name)")
      .eq("activity_id", row.id),
    getAgeGroupsForContent("activity", row.id),
    getTagsForContent("activity", row.id),
    getCoverImageForContent("activity", row.id),
  ]);

  return {
    ...(row as unknown as Activity),
    features: (featuresResult.data ?? []).map(
      (r) => r.feature as unknown as Activity["features"][number]
    ),
    age_groups: ageGroups,
    tags,
    cover_media: coverMedia,
  };
}

async function attachListExtras(
  rows: Record<string, unknown>[]
): Promise<Activity[]> {
  const ids = rows.map((r) => r.id as string);
  const coverByContentId = await getCoverImagesForContents("activity", ids);

  return rows.map((row) => ({
    ...(row as unknown as Activity),
    features: [],
    age_groups: [],
    tags: [],
    cover_media: coverByContentId.get(row.id as string) ?? null,
  }));
}
