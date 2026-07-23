import type { MicroAdventure } from "@/lib/types";
import type { Article } from "@/lib/types";
import type { AccommodationFormData } from "@/lib/data/accommodations";
import type { ActivityFormData } from "@/lib/data/activities";
import type { MicroAdventureFormData } from "@/lib/data/micro-adventures";
import { formatPriceEstimate } from "@/lib/format";
import type { PostImageInput } from "@/lib/instagram/template";
import type { PostCaptionInput } from "@/lib/instagram/caption";
import type { InstagramContentType } from "@/lib/instagram/types";

const COST_LABEL: Record<NonNullable<MicroAdventure["cost_level"]>, string> = {
  free: "Kostenlos",
  low: "Günstig",
  medium: "Mittleres Budget",
  high: "Höheres Budget",
};

export type { InstagramContentType };

export interface PostContentInput {
  image: PostImageInput;
  caption: PostCaptionInput;
}

// Gleiche Logik wie lib/media.ts#resolveMediaUrl, hier dupliziert statt
// importiert, da diese Funktion nur die minimale Form { storage_path }
// braucht, nicht den vollen Media-Typ (id/alt_text nicht vorhanden bei
// allen vier Content-Typ-FormData-Varianten).
function requireImageUrl(coverMedia: { storage_path: string } | null, title: string): string {
  if (!coverMedia?.storage_path.startsWith("http")) {
    throw new Error(`Kein Titelbild vorhanden — Instagram-Post für "${title}" kann nicht erzeugt werden.`);
  }
  return coverMedia.storage_path;
}

export function accommodationToPostContent(a: AccommodationFormData): PostContentInput {
  const location = a.city ?? null;
  const priceText = a.example_total_price ? formatPriceEstimate(a.example_total_price, a.currency) : null;
  const badges = a.family_rating != null ? [`FamVaya Family Fit: ${a.family_rating}/100`] : [];
  return {
    image: {
      imageUrl: requireImageUrl(a.cover_media, a.title),
      title: a.title,
      subtitle: [location, priceText].filter(Boolean).join(" · "),
      badges,
    },
    caption: {
      title: a.title,
      description: a.short_description,
      location,
      priceText,
      contentType: "accommodation",
    },
  };
}

export function activityToPostContent(a: ActivityFormData): PostContentInput {
  const location = a.city ?? null;
  const priceText = a.example_total_price ? formatPriceEstimate(a.example_total_price) : null;
  const badges = a.family_rating != null ? [`FamVaya Family Fit: ${a.family_rating}/100`] : [];
  return {
    image: {
      imageUrl: requireImageUrl(a.cover_media, a.title),
      title: a.title,
      subtitle: [location, priceText].filter(Boolean).join(" · "),
      badges,
    },
    caption: {
      title: a.title,
      description: a.short_description,
      location,
      priceText,
      contentType: "activity",
    },
  };
}

export function microAdventureToPostContent(a: MicroAdventureFormData): PostContentInput {
  const priceText =
    a.cost_level === "free" || !a.estimated_total_cost
      ? (a.cost_level && COST_LABEL[a.cost_level]) || null
      : formatPriceEstimate(a.estimated_total_cost);
  const badges = a.family_rating != null ? [`FamVaya Family Fit: ${a.family_rating}/100`] : [];
  return {
    image: {
      imageUrl: requireImageUrl(a.cover_media, a.title),
      title: a.title,
      subtitle: priceText ?? "Mikro-Familienabenteuer",
      badges,
    },
    caption: {
      title: a.title,
      description: a.short_description,
      location: null,
      priceText,
      contentType: "micro_adventure",
    },
  };
}

export function articleToPostContent(a: Article): PostContentInput {
  const category = a.category?.name ?? null;
  return {
    image: {
      imageUrl: requireImageUrl(a.cover_media, a.title),
      title: a.title,
      subtitle: category ?? "FamVaya Magazin",
      badges: [],
    },
    caption: {
      title: a.title,
      description: a.excerpt,
      location: null,
      priceText: null,
      contentType: "article",
    },
  };
}
