import { createAdminClient } from "@/lib/supabase/admin";
import type { Category, ContentStatus, MicroAdventure, MicroAdventureFilters } from "@/lib/types";
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
  id, title, slug, short_description,
  duration_min, duration_max, cost_level, estimated_total_cost,
  preparation_level, difficulty_level, indoor, outdoor,
  seasonal_tags, weather_tags, location_optional,
  status, featured, family_rating,
  category:categories(id, name, slug)
`;

const DETAIL_SELECT = `
  id, title, slug, short_description, full_description,
  duration_min, duration_max, cost_level, estimated_total_cost,
  preparation_level, difficulty_level, indoor, outdoor,
  seasonal_tags, weather_tags, materials, instructions, location_optional,
  price_checked_at,
  external_url, affiliate_url, status, featured, family_rating, pros, cons,
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
  if (filters.ids) {
    query = query.in("id", filters.ids.length > 0 ? filters.ids : ["00000000-0000-0000-0000-000000000000"]);
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
  slug: string,
  options: { includeUnpublished?: boolean } = {}
): Promise<MicroAdventure | null> {
  const supabase = createAdminClient();
  let query = supabase.from("micro_adventures").select(DETAIL_SELECT).eq("slug", slug);
  if (!options.includeUnpublished) {
    query = query.eq("status", "published");
  }
  const { data: row } = await query.maybeSingle();

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

// Ab hier: Admin-CRUD (Phase 5), analog lib/data/accommodations.ts. Kein
// provider_id/expires_at — das Schema sieht das für Mikro-Abenteuer
// bewusst nicht vor (siehe supabase/migrations/0006_*.sql). family_rating
// kam in Phase 7 dazu (0017_fit_score_and_reality_check.sql), damit alle
// drei Content-Typen dieselbe FamVaya-Family-Fit-Badge unterstützen.

export interface MicroAdventureInput {
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  category_id: string | null;
  duration_min: number | null;
  duration_max: number | null;
  cost_level: "free" | "low" | "medium" | "high" | null;
  estimated_total_cost: number | null;
  preparation_level: "none" | "light" | "moderate" | null;
  difficulty_level: "easy" | "medium" | "hard" | null;
  indoor: boolean;
  outdoor: boolean;
  seasonal_tags: string[];
  weather_tags: string[];
  materials: string[];
  instructions: string | null;
  safety_notes: string | null;
  location_optional: boolean;
  price_checked_at: string | null;
  external_url: string | null;
  affiliate_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
  pros: string[];
  cons: string[];
}

export interface MicroAdventureFormData extends MicroAdventureInput {
  id: string;
  age_group_ids: string[];
  tag_ids: string[];
  cover_media: { id: string; storage_path: string; alt_text: string | null } | null;
}

export async function getAllMicroAdventuresForAdmin(): Promise<AdminListRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("micro_adventures")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

const ADMIN_FORM_SELECT = `
  id, title, slug, short_description, full_description, category_id,
  duration_min, duration_max, cost_level, estimated_total_cost,
  preparation_level, difficulty_level, indoor, outdoor,
  seasonal_tags, weather_tags, materials, instructions, safety_notes,
  location_optional, price_checked_at, external_url, affiliate_url, status, featured,
  family_rating, pros, cons
`;

export async function getMicroAdventureByIdForAdmin(
  id: string
): Promise<MicroAdventureFormData | null> {
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("micro_adventures")
    .select(ADMIN_FORM_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (!row) return null;

  const [ageGroups, tags, coverMedia] = await Promise.all([
    getAgeGroupsForContent("micro_adventure", id),
    getTagsForContent("micro_adventure", id),
    getCoverImageForContent("micro_adventure", id),
  ]);

  return {
    ...(row as unknown as MicroAdventureInput),
    id: row.id,
    age_group_ids: ageGroups.map((a) => a.id),
    tag_ids: tags.map((t) => t.id),
    cover_media: coverMedia,
  };
}

export async function createMicroAdventureRow(input: MicroAdventureInput): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("micro_adventures").insert(input).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function updateMicroAdventureRow(
  id: string,
  input: MicroAdventureInput
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("micro_adventures").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteMicroAdventureRow(id: string): Promise<void> {
  const supabase = createAdminClient();
  await deleteContentRelations("micro_adventure", id);
  await supabase.from("micro_adventures").delete().eq("id", id);
}

export async function duplicateMicroAdventureRow(id: string): Promise<string> {
  const original = await getMicroAdventureByIdForAdmin(id);
  if (!original) throw new Error("Mikro-Abenteuer nicht gefunden");

  const { id: _id, age_group_ids: _ageGroupIds, tag_ids: _tagIds, cover_media: _coverMedia, slug: _slug, ...input } =
    original;

  const newSlug = await findAvailableMicroAdventureSlug(original.slug);
  const newId = await createMicroAdventureRow({ ...input, slug: newSlug, status: "draft" });

  await Promise.all([
    replaceContentAgeGroups("micro_adventure", newId, original.age_group_ids),
    replaceContentTags("micro_adventure", newId, original.tag_ids),
  ]);

  return newId;
}

async function findAvailableMicroAdventureSlug(baseSlug: string): Promise<string> {
  const supabase = createAdminClient();
  let candidate = `${baseSlug}-kopie`;
  let suffix = 2;
  while (true) {
    const { data } = await supabase
      .from("micro_adventures")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${baseSlug}-kopie-${suffix}`;
    suffix += 1;
  }
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
