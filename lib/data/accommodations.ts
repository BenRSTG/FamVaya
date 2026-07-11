import { createAdminClient } from "@/lib/supabase/admin";
import type { Accommodation, AccommodationFilters, AccommodationType } from "@/lib/types";
import {
  getAgeGroupsForContent,
  getCoverImageForContent,
  getCoverImagesForContents,
  getTagsForContent,
} from "@/lib/data/shared";

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
  affiliate_url, external_url, status, featured, family_rating,
  accommodation_type:accommodation_types(id, name, slug),
  country:countries(id, name, code),
  region:regions(id, name, slug)
`;

export async function getFeaturedAccommodations(
  limit: number
): Promise<Accommodation[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("accommodations")
    .select(LIST_SELECT)
    .eq("status", "published")
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
    .eq("status", "published");

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
  slug: string
): Promise<Accommodation | null> {
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("accommodations")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

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
