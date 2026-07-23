// Handgeschriebene Typen für die Phase-1-relevanten Tabellen (Spec §20).
// Kein `supabase gen types`, da kein CLI-Link zum Projekt besteht (siehe
// DECISIONS.md, analog zur Docker-freien Entscheidung aus Phase 0).

export type ContentStatus =
  | "draft"
  | "in_review"
  | "published"
  | "paused"
  | "archived";

export type ContentType = "accommodation" | "activity" | "micro_adventure";

// categories.content_type ist bewusst ein eigenes, breiteres Enum (siehe
// DECISIONS.md) — deckt zusätzlich "article" ab, das kein eigener ContentType ist.
export type CategoryContentType = ContentType | "article";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Rückgabezeile von search_all_content() (Spec §14, Bauplan_2.md Phase 3) —
// bewusst schlanker als Accommodation/Activity/MicroAdventure, siehe DECISIONS.md.
export interface SearchResultRow {
  content_type: ContentType | "article";
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  city: string | null;
  rank: number;
}

// Grundfilter für die Familienunterkünfte-Übersicht (Bauplan_2.md Phase 1 /
// Spec §8.1-Teilmenge). Alle Felder optional — undefined bedeutet "kein Filter".
export interface AccommodationFilters {
  minGuests?: number;
  minChildren?: number;
  minBedrooms?: number;
  maxPrice?: number;
  typeSlug?: string;
  // Phase 3: vom Inspirationsfinder genutzt (siehe lib/data/shared.ts).
  tagSlugs?: string[];
  // Phase 4: von der Merkliste/Freigabe-Seite genutzt, um gezielt mehrere
  // Items nachzuladen (bisher gab es nur "alle" oder "per Slug einzeln").
  ids?: string[];
}

// Grundfilter für die Familienaktivitäten-Übersicht (Bauplan_2.md Phase 2 /
// Spec §8.2-Teilmenge).
export interface ActivityFilters {
  categorySlug?: string;
  indoorOutdoor?: "indoor" | "outdoor";
  maxPrice?: number;
  largeFamilyDiscount?: boolean;
  tagSlugs?: string[];
  ids?: string[];
}

// Grundfilter für die Mikro-Familienabenteuer-Übersicht (Bauplan_2.md Phase 2
// / Spec §8.3-Teilmenge).
export interface MicroAdventureFilters {
  categorySlug?: string;
  costLevel?: "free" | "low" | "medium" | "high";
  // Array statt Einzelwert: der Finder erlaubt bei "spontan" sowohl 'none'
  // als auch 'light' (siehe DECISIONS.md — 'none' allein war zu eng).
  preparationLevel?: ("none" | "light" | "moderate")[];
  indoorOutdoor?: "indoor" | "outdoor";
  // Phase 3: vom Inspirationsfinder genutzt, filtert auf estimated_total_cost.
  maxPrice?: number;
  tagSlugs?: string[];
  ids?: string[];
}

export interface Media {
  id: string;
  storage_path: string;
  alt_text: string | null;
}

export interface CoverImage {
  media: Media;
}

export interface AgeGroup {
  id: string;
  name: string;
  min_age: number;
  max_age: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  group_name: string | null;
}

export interface ActivityFeature {
  id: string;
  name: string;
  slug: string;
  group_name: string | null;
}

export interface AccommodationType {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
}

export interface Accommodation {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  city: string | null;
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
  example_nights: number | null;
  value_tier: "budget" | "fair" | "good_value" | "premium" | null;
  price_checked_at: string | null;
  affiliate_url: string | null;
  external_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
  expires_at: string | null;
  pros: string[];
  cons: string[];
  accommodation_type: AccommodationType | null;
  country: Country | null;
  region: Region | null;
  amenities: Amenity[];
  age_groups: AgeGroup[];
  tags: Tag[];
  cover_media: Media | null;
}

export interface Activity {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
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
  price_checked_at: string | null;
  affiliate_url: string | null;
  external_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
  expires_at: string | null;
  pros: string[];
  cons: string[];
  category: { id: string; name: string; slug: string } | null;
  country: Country | null;
  region: Region | null;
  features: ActivityFeature[];
  age_groups: AgeGroup[];
  tags: Tag[];
  cover_media: Media | null;
}

export interface MicroAdventure {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
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
  location_optional: boolean;
  price_checked_at: string | null;
  external_url: string | null;
  affiliate_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
  pros: string[];
  cons: string[];
  category: { id: string; name: string; slug: string } | null;
  age_groups: AgeGroup[];
  tags: Tag[];
  cover_media: Media | null;
}

// „Lass dich inspirieren"-Finder (Spec §13, Bauplan_2.md Phase 3 —
// vereinfacht/regelbasiert, siehe DECISIONS.md).

export type FinderArea = "unterkunft" | "aktivitaet" | "mikroabenteuer" | "unentschlossen";

export interface FinderInput {
  adults: number;
  children: number;
  area: FinderArea;
  spontaneous: boolean;
  /** undefined = "egal", 0 = "kostenlos" */
  maxBudget?: number;
  interestTags: Tag[];
}

export interface FinderResults {
  accommodations: { item: Accommodation; reasons: string[] }[];
  activities: { item: Activity; reasons: string[] }[];
  microAdventures: { item: MicroAdventure; reasons: string[] }[];
}

// Familienprofil (Spec §15.1) — bewusst ohne Lat/Long (bräuchte Geocoding)
// und ohne vollständige Geburtsdaten der Kinder (nur Altersgruppen-Labels).
export interface FamilyProfile {
  user_id: string;
  adults_count: number;
  children_count: number;
  children_age_groups: string[];
  city: string | null;
  postal_code: string | null;
  max_budget: number | null;
  preferred_distance: number | null;
  interests: string[];
  accessibility_needs: string | null;
  has_pet: boolean;
}

export interface FavoriteCollection {
  id: string;
  user_id: string;
  name: string;
  is_public: boolean;
  share_token: string;
}

// Phase 5 (Admin-Bereich) — Referenz-/Verwaltungsdaten, die zuvor nicht
// öffentlich abgefragt wurden.

export type UserRole = "user" | "editor" | "admin" | "provider";

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  affiliate_network: string | null;
  contact_email: string | null;
  status: "active" | "inactive" | "pending";
}

// Region-Dropdowns im Admin sind flach (Land + Region in einem Feld) statt
// kaskadierend, um ohne Client-JS auszukommen (siehe DECISIONS.md).
export interface RegionWithCountry extends Region {
  country_id: string;
  country_name: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author_id: string | null;
  author_name: string | null;
  category_id: string | null;
  category: Category | null;
  cover_media_id: string | null;
  cover_media: Media | null;
  status: ContentStatus;
  published_at: string | null;
  updated_at: string;
}
