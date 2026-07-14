import { createAdminClient } from "@/lib/supabase/admin";
import type { Accommodation, AccommodationFilters, AccommodationType, ContentStatus } from "@/lib/types";
import {
  deleteContentRelations,
  getAgeGroupsForContent,
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
  max_guests, max_adults, max_children, bedrooms, bathrooms,
  price_from, price_type, currency, example_family_size, example_total_price,
  status, featured, family_rating,
  accommodation_type:accommodation_types(id, name, slug),
  country:countries(id, name, code),
  region:regions(id, name, slug)
`;

const DETAIL_SELECT = `
  id, title, slug, short_description, full_description, city,
  max_guests, max_adults, max_children, bedrooms, bathrooms, beds, living_area,
  price_from, price_type, currency, example_family_size, example_total_price,
  affiliate_url, external_url, status, featured, family_rating, expires_at,
  pros, cons,
  accommodation_type:accommodation_types(id, name, slug),
  country:countries(id, name, code),
  region:regions(id, name, slug)
`;

// Abgelaufene, aber noch "published" Angebote sollen aus Listen verschwinden
// (Spec §20/Bauplan Phase 5) — Detailseiten filtern NICHT danach, damit die
// URL erreichbar bleibt (siehe app/familienunterkuenfte/[slug]/page.tsx).
function notExpiredFilter(): string {
  return `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`;
}

export async function getFeaturedAccommodations(
  limit: number
): Promise<Accommodation[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("accommodations")
    .select(LIST_SELECT)
    .eq("status", "published")
    .or(notExpiredFilter())
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  return attachListExtras(data ?? []);
}

export async function getPublishedAccommodations(
  filters: AccommodationFilters = {}
): Promise<Accommodation[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("accommodations")
    .select(LIST_SELECT)
    .eq("status", "published")
    .or(notExpiredFilter());

  if (filters.minGuests != null) {
    query = query.gte("max_guests", filters.minGuests);
  }
  if (filters.minChildren != null) {
    query = query.gte("max_children", filters.minChildren);
  }
  if (filters.minBedrooms != null) {
    query = query.gte("bedrooms", filters.minBedrooms);
  }
  if (filters.maxPrice != null) {
    query = query.lte("price_from", filters.maxPrice);
  }
  if (filters.typeSlug) {
    const types = await getAccommodationTypes();
    const type = types.find((t) => t.slug === filters.typeSlug);
    // Unbekannter Slug -> garantiert 0 Treffer statt Filter zu ignorieren.
    query = query.eq("accommodation_type_id", type?.id ?? "00000000-0000-0000-0000-000000000000");
  }
  if (filters.tagSlugs && filters.tagSlugs.length > 0) {
    const ids = await getContentIdsByTagSlugs("accommodation", filters.tagSlugs);
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

export async function getAccommodationTypes(): Promise<AccommodationType[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("accommodation_types")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getAccommodationBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {}
): Promise<Accommodation | null> {
  const supabase = createAdminClient();
  let query = supabase.from("accommodations").select(DETAIL_SELECT).eq("slug", slug);
  if (!options.includeUnpublished) {
    query = query.eq("status", "published");
  }
  const { data: row } = await query.maybeSingle();

  if (!row) return null;

  const [amenitiesResult, ageGroups, tags, coverMedia] = await Promise.all([
    supabase
      .from("accommodation_amenities")
      .select("amenity:amenities(id, name, slug, group_name)")
      .eq("accommodation_id", row.id),
    getAgeGroupsForContent("accommodation", row.id),
    getTagsForContent("accommodation", row.id),
    getCoverImageForContent("accommodation", row.id),
  ]);

  return {
    ...(row as unknown as Accommodation),
    amenities: (amenitiesResult.data ?? []).map(
      (r) => r.amenity as unknown as Accommodation["amenities"][number]
    ),
    age_groups: ageGroups,
    tags,
    cover_media: coverMedia,
  };
}

// Ab hier: Admin-CRUD (Phase 5). Bewusst getrennt von den öffentlichen
// Lesefunktionen oben — Admin-Reads liefern Rohspalten (auch unveröffentlicht,
// inkl. Fremdschlüssel-IDs für Formulare) statt der aufbereiteten
// Accommodation-Form für Frontend-Karten/Detailseiten.

export interface AccommodationInput {
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  accommodation_type_id: string | null;
  provider_id: string | null;
  region_id: string | null;
  country_id: string | null;
  city: string | null;
  postal_code: string | null;
  max_guests: number | null;
  max_adults: number | null;
  max_children: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  beds: number | null;
  living_area: number | null;
  price_from: number | null;
  price_type: "per_night" | "total" | null;
  currency: string;
  example_family_size: string | null;
  example_total_price: number | null;
  affiliate_url: string | null;
  external_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
  expires_at: string | null;
  pros: string[];
  cons: string[];
}

export interface AccommodationFormData extends AccommodationInput {
  id: string;
  amenity_ids: string[];
  age_group_ids: string[];
  tag_ids: string[];
  cover_media: { id: string; storage_path: string; alt_text: string | null } | null;
}

export async function getAllAccommodationsForAdmin(): Promise<AdminListRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("accommodations")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

const ADMIN_FORM_SELECT = `
  id, title, slug, short_description, full_description,
  accommodation_type_id, provider_id, region_id, country_id, city, postal_code,
  max_guests, max_adults, max_children, bedrooms, bathrooms, beds, living_area,
  price_from, price_type, currency, example_family_size, example_total_price,
  affiliate_url, external_url, status, featured, family_rating, expires_at,
  pros, cons
`;

export async function getAccommodationByIdForAdmin(
  id: string
): Promise<AccommodationFormData | null> {
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("accommodations")
    .select(ADMIN_FORM_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (!row) return null;

  const [amenitiesResult, ageGroups, tags, coverMedia] = await Promise.all([
    supabase.from("accommodation_amenities").select("amenity_id").eq("accommodation_id", id),
    getAgeGroupsForContent("accommodation", id),
    getTagsForContent("accommodation", id),
    getCoverImageForContent("accommodation", id),
  ]);

  return {
    ...(row as unknown as AccommodationInput),
    id: row.id,
    amenity_ids: (amenitiesResult.data ?? []).map((r) => r.amenity_id as string),
    age_group_ids: ageGroups.map((a) => a.id),
    tag_ids: tags.map((t) => t.id),
    cover_media: coverMedia,
  };
}

export async function createAccommodationRow(input: AccommodationInput): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("accommodations")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateAccommodationRow(
  id: string,
  input: AccommodationInput
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("accommodations").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteAccommodationRow(id: string): Promise<void> {
  const supabase = createAdminClient();
  await deleteContentRelations("accommodation", id);
  await supabase.from("accommodation_amenities").delete().eq("accommodation_id", id);
  await supabase.from("accommodations").delete().eq("id", id);
}

export async function replaceAccommodationAmenities(
  id: string,
  amenityIds: string[]
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("accommodation_amenities").delete().eq("accommodation_id", id);
  if (amenityIds.length > 0) {
    await supabase
      .from("accommodation_amenities")
      .insert(amenityIds.map((amenity_id) => ({ accommodation_id: id, amenity_id })));
  }
}

export async function duplicateAccommodationRow(id: string): Promise<string> {
  const original = await getAccommodationByIdForAdmin(id);
  if (!original) throw new Error("Unterkunft nicht gefunden");

  const {
    id: _id,
    amenity_ids: _amenityIds,
    age_group_ids: _ageGroupIds,
    tag_ids: _tagIds,
    cover_media: _coverMedia,
    slug: _slug,
    ...input
  } = original;

  const newSlug = await findAvailableSlug(original.slug);
  const newId = await createAccommodationRow({
    ...input,
    slug: newSlug,
    status: "draft",
  });

  await Promise.all([
    replaceAccommodationAmenities(newId, original.amenity_ids),
    replaceContentAgeGroups("accommodation", newId, original.age_group_ids),
    replaceContentTags("accommodation", newId, original.tag_ids),
  ]);

  return newId;
}

async function findAvailableSlug(baseSlug: string): Promise<string> {
  const supabase = createAdminClient();
  let candidate = `${baseSlug}-kopie`;
  let suffix = 2;
  while (true) {
    const { data } = await supabase
      .from("accommodations")
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
): Promise<Accommodation[]> {
  const ids = rows.map((r) => r.id as string);
  const coverByContentId = await getCoverImagesForContents("accommodation", ids);

  return rows.map((row) => ({
    ...(row as unknown as Accommodation),
    amenities: [],
    age_groups: [],
    tags: [],
    cover_media: coverByContentId.get(row.id as string) ?? null,
  }));
}
