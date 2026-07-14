import { createAdminClient } from "@/lib/supabase/admin";
import type { Activity, ActivityFilters, Category, ContentStatus } from "@/lib/types";
import {
  deleteContentRelations,
  getAgeGroupsForContent,
  getCategoriesByContentType,
  getContentIdsByTagSlugs,
  getCoverImageForContent,
  getCoverImagesForContents,
  getTagsForContent,
  replaceContentAgeGroups,
  replaceContentTags,
} from "@/lib/data/shared";
import type { AdminListRow } from "@/components/admin/content-table";

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
  affiliate_url, external_url, status, featured, family_rating, expires_at,
  pros, cons,
  category:categories(id, name, slug),
  country:countries(id, name, code),
  region:regions(id, name, slug)
`;

// Abgelaufene, aber noch "published" Angebote sollen aus Listen verschwinden
// (Spec §20/Bauplan Phase 5) — Detailseiten filtern NICHT danach, damit die
// URL erreichbar bleibt (siehe app/familienaktivitaeten/[slug]/page.tsx).
function notExpiredFilter(): string {
  return `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`;
}

export async function getFeaturedActivities(limit: number): Promise<Activity[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("activities")
    .select(LIST_SELECT)
    .eq("status", "published")
    .or(notExpiredFilter())
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
    .eq("status", "published")
    .or(notExpiredFilter());

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
  if (filters.ids) {
    query = query.in("id", filters.ids.length > 0 ? filters.ids : ["00000000-0000-0000-0000-000000000000"]);
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

export async function getActivityBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {}
): Promise<Activity | null> {
  const supabase = createAdminClient();
  let query = supabase.from("activities").select(DETAIL_SELECT).eq("slug", slug);
  if (!options.includeUnpublished) {
    query = query.eq("status", "published");
  }
  const { data: row } = await query.maybeSingle();

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

// Ab hier: Admin-CRUD (Phase 5), analog lib/data/accommodations.ts.

export interface ActivityInput {
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  category_id: string | null;
  provider_id: string | null;
  region_id: string | null;
  country_id: string | null;
  city: string | null;
  duration_min: number | null;
  duration_max: number | null;
  indoor: boolean;
  outdoor: boolean;
  weather_suitable: boolean;
  adult_price: number | null;
  child_price: number | null;
  example_total_price: number | null;
  family_ticket: boolean;
  large_family_discount: boolean;
  booking_required: boolean;
  affiliate_url: string | null;
  external_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
  expires_at: string | null;
  pros: string[];
  cons: string[];
}

export interface ActivityFormData extends ActivityInput {
  id: string;
  feature_ids: string[];
  age_group_ids: string[];
  tag_ids: string[];
  cover_media: { id: string; storage_path: string; alt_text: string | null } | null;
}

export async function getAllActivitiesForAdmin(): Promise<AdminListRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("activities")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

const ADMIN_FORM_SELECT = `
  id, title, slug, short_description, full_description,
  category_id, provider_id, region_id, country_id, city,
  duration_min, duration_max, indoor, outdoor, weather_suitable,
  adult_price, child_price, example_total_price, family_ticket,
  large_family_discount, booking_required,
  affiliate_url, external_url, status, featured, family_rating, expires_at,
  pros, cons
`;

export async function getActivityByIdForAdmin(id: string): Promise<ActivityFormData | null> {
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("activities")
    .select(ADMIN_FORM_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (!row) return null;

  const [featuresResult, ageGroups, tags, coverMedia] = await Promise.all([
    supabase.from("activity_feature_links").select("feature_id").eq("activity_id", id),
    getAgeGroupsForContent("activity", id),
    getTagsForContent("activity", id),
    getCoverImageForContent("activity", id),
  ]);

  return {
    ...(row as unknown as ActivityInput),
    id: row.id,
    feature_ids: (featuresResult.data ?? []).map((r) => r.feature_id as string),
    age_group_ids: ageGroups.map((a) => a.id),
    tag_ids: tags.map((t) => t.id),
    cover_media: coverMedia,
  };
}

export async function createActivityRow(input: ActivityInput): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("activities").insert(input).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function updateActivityRow(id: string, input: ActivityInput): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("activities").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteActivityRow(id: string): Promise<void> {
  const supabase = createAdminClient();
  await deleteContentRelations("activity", id);
  await supabase.from("activity_feature_links").delete().eq("activity_id", id);
  await supabase.from("activities").delete().eq("id", id);
}

export async function replaceActivityFeatures(id: string, featureIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("activity_feature_links").delete().eq("activity_id", id);
  if (featureIds.length > 0) {
    await supabase
      .from("activity_feature_links")
      .insert(featureIds.map((feature_id) => ({ activity_id: id, feature_id })));
  }
}

export async function duplicateActivityRow(id: string): Promise<string> {
  const original = await getActivityByIdForAdmin(id);
  if (!original) throw new Error("Aktivität nicht gefunden");

  const {
    id: _id,
    feature_ids: _featureIds,
    age_group_ids: _ageGroupIds,
    tag_ids: _tagIds,
    cover_media: _coverMedia,
    slug: _slug,
    ...input
  } = original;

  const newSlug = await findAvailableActivitySlug(original.slug);
  const newId = await createActivityRow({ ...input, slug: newSlug, status: "draft" });

  await Promise.all([
    replaceActivityFeatures(newId, original.feature_ids),
    replaceContentAgeGroups("activity", newId, original.age_group_ids),
    replaceContentTags("activity", newId, original.tag_ids),
  ]);

  return newId;
}

async function findAvailableActivitySlug(baseSlug: string): Promise<string> {
  const supabase = createAdminClient();
  let candidate = `${baseSlug}-kopie`;
  let suffix = 2;
  while (true) {
    const { data } = await supabase.from("activities").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${baseSlug}-kopie-${suffix}`;
    suffix += 1;
  }
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
