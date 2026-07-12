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
  content_type: ContentType;
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
}

// Grundfilter für die Familienaktivitäten-Übersicht (Bauplan_2.md Phase 2 /
// Spec §8.2-Teilmenge).
export interface ActivityFilters {
  categorySlug?: string;
  indoorOutdoor?: "indoor" | "outdoor";
  maxPrice?: number;
  largeFamilyDiscount?: boolean;
  tagSlugs?: string[];
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
  affiliate_url: string | null;
  external_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
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
  affiliate_url: string | null;
  external_url: string | null;
  status: ContentStatus;
  featured: boolean;
  family_rating: number | null;
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
  external_url: string | null;
  affiliate_url: string | null;
  status: ContentStatus;
  featured: boolean;
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
