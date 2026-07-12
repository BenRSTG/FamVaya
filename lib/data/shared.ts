import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AgeGroup,
  Category,
  CategoryContentType,
  ContentType,
  Media,
  Tag,
} from "@/lib/types";

// content_age_groups/content_tags/content_media sind polymorph ohne FK auf
// content_id (siehe DECISIONS.md) — PostgREST kann sie deshalb nicht direkt
// in die Haupt-Query einbetten. Diese Helper holen sie separat und werden
// von allen drei lib/data/*-Modulen (accommodations/activities/micro-adventures)
// geteilt.

export async function getCoverImageForContent(
  contentType: ContentType,
  contentId: string
): Promise<Media | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("content_media")
    .select("media:media(id, storage_path, alt_text)")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("is_cover", true)
    .maybeSingle();

  return (data?.media as unknown as Media) ?? null;
}

export async function getCoverImagesForContents(
  contentType: ContentType,
  contentIds: string[]
): Promise<Map<string, Media>> {
  if (contentIds.length === 0) return new Map();

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("content_media")
    .select("content_id, media:media(id, storage_path, alt_text)")
    .eq("content_type", contentType)
    .eq("is_cover", true)
    .in("content_id", contentIds);

  const map = new Map<string, Media>();
  for (const row of data ?? []) {
    if (row.media) map.set(row.content_id, row.media as unknown as Media);
  }
  return map;
}

export async function getAgeGroupsForContent(
  contentType: ContentType,
  contentId: string
): Promise<AgeGroup[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("content_age_groups")
    .select("age_group:age_groups(id, name, min_age, max_age)")
    .eq("content_type", contentType)
    .eq("content_id", contentId);

  return (data ?? []).map((row) => row.age_group as unknown as AgeGroup);
}

export async function getCategoriesByContentType(
  contentType: CategoryContentType
): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("content_type", contentType)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getTagsForContent(
  contentType: ContentType,
  contentId: string
): Promise<Tag[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("content_tags")
    .select("tag:tags(id, name, slug)")
    .eq("content_type", contentType)
    .eq("content_id", contentId);

  return (data ?? []).map((row) => row.tag as unknown as Tag);
}

export async function getAllTags(): Promise<Tag[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("tags").select("id, name, slug").order("name");
  return data ?? [];
}

export async function getAllAgeGroups(): Promise<AgeGroup[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("age_groups")
    .select("id, name, min_age, max_age")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

// IDs aller Content-Items eines Typs, die MINDESTENS eines der übergebenen
// Tags tragen (OR-Semantik) — genutzt vom Inspirationsfinder und den
// Übersichts-Filtern. Zwei Schritte statt eines !inner-Joins, konsistent mit
// dem bestehenden Slug-Auflösungs-Muster (z. B. accommodation_type_id).
export async function getContentIdsByTagSlugs(
  contentType: ContentType,
  tagSlugs: string[]
): Promise<string[]> {
  if (tagSlugs.length === 0) return [];
  const supabase = createAdminClient();

  const { data: tags } = await supabase.from("tags").select("id").in("slug", tagSlugs);
  const tagIds = (tags ?? []).map((t) => t.id);
  if (tagIds.length === 0) return [];

  const { data } = await supabase
    .from("content_tags")
    .select("content_id")
    .eq("content_type", contentType)
    .in("tag_id", tagIds);

  return [...new Set((data ?? []).map((row) => row.content_id as string))];
}
