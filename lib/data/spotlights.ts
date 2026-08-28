import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { TABLE_BY_CONTENT_TYPE, OVERVIEW_PATH_BY_CONTENT_TYPE } from "@/lib/content-type";
import type {
  ContentType,
  HomepageSpotlight,
  ResolvedHomepageSpotlight,
} from "@/lib/types";

const SELECT = `
  id, title, body_text, link_type, content_type, content_id, external_url,
  is_active, is_sponsored, starts_at, ends_at, sort_order,
  image:media(storage_path, alt_text)
`;

export interface SpotlightInput {
  title: string;
  body_text: string;
  link_type: "internal" | "external";
  content_type: ContentType | null;
  content_id: string | null;
  external_url: string | null;
  is_active: boolean;
  is_sponsored: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
}

async function resolveSpotlightHref(spotlight: HomepageSpotlight): Promise<string> {
  if (spotlight.link_type === "external") {
    return spotlight.external_url ?? "#";
  }

  const contentType = spotlight.content_type as ContentType;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from(TABLE_BY_CONTENT_TYPE[contentType])
    .select("slug")
    .eq("id", spotlight.content_id as string)
    .maybeSingle();

  if (!data) return OVERVIEW_PATH_BY_CONTENT_TYPE[contentType];
  return `${OVERVIEW_PATH_BY_CONTENT_TYPE[contentType]}/${data.slug}`;
}

// Nur der oberste aktive Eintrag wird angezeigt (siehe DECISIONS.md) —
// einfachste Regel für den einen Slot in v1.
export async function getActiveHomepageSpotlight(): Promise<ResolvedHomepageSpotlight | null> {
  const supabase = createAdminClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("homepage_spotlights")
    .select(SELECT)
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  const spotlight = data as unknown as HomepageSpotlight;
  const href = await resolveSpotlightHref(spotlight);
  return { ...spotlight, href };
}

export async function getSpotlightsForAdmin(): Promise<HomepageSpotlight[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("homepage_spotlights")
    .select(SELECT)
    .order("sort_order", { ascending: true });
  return (data ?? []) as unknown as HomepageSpotlight[];
}

export async function getSpotlightById(id: string): Promise<HomepageSpotlight | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("homepage_spotlights")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as HomepageSpotlight) ?? null;
}

export async function createSpotlightRow(
  input: SpotlightInput,
  imageMediaId: string
): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("homepage_spotlights")
    .insert({ ...input, image_media_id: imageMediaId })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateSpotlightRow(
  id: string,
  input: SpotlightInput,
  imageMediaId?: string
): Promise<void> {
  const supabase = createAdminClient();
  const payload: Record<string, unknown> = { ...input };
  if (imageMediaId) payload.image_media_id = imageMediaId;
  const { error } = await supabase.from("homepage_spotlights").update(payload).eq("id", id);
  if (error) throw error;
}

export async function toggleSpotlightActive(id: string, isActive: boolean): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("homepage_spotlights")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSpotlightRow(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("homepage_spotlights").delete().eq("id", id);
  if (error) throw error;
}

// Für das Ziel-Dropdown im Admin-Formular bei link_type="internal" —
// vermeidet Freitext-IDs/tote interne Links (siehe DECISIONS.md).
export async function getPublishedTitlesForContentType(
  contentType: ContentType
): Promise<{ id: string; title: string }[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from(TABLE_BY_CONTENT_TYPE[contentType])
    .select("id, title")
    .eq("status", "published")
    .order("title");
  return data ?? [];
}
