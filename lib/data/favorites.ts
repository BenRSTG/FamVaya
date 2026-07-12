import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublishedAccommodations } from "@/lib/data/accommodations";
import { getPublishedActivities } from "@/lib/data/activities";
import { getPublishedMicroAdventures } from "@/lib/data/micro-adventures";
import type {
  Accommodation,
  Activity,
  ContentType,
  FavoriteCollection,
  MicroAdventure,
} from "@/lib/types";

// Phase 4, vereinfachter Scope (siehe DECISIONS.md): eine automatische
// Standard-Sammlung pro Nutzer statt voller Mehrfach-Sammlungsverwaltung.
const DEFAULT_COLLECTION_NAME = "Meine Favoriten";

export interface GroupedFavorites {
  accommodations: Accommodation[];
  activities: Activity[];
  microAdventures: MicroAdventure[];
}

async function groupContentRefs(
  refs: { content_type: ContentType; content_id: string }[]
): Promise<GroupedFavorites> {
  const accommodationIds = refs
    .filter((r) => r.content_type === "accommodation")
    .map((r) => r.content_id);
  const activityIds = refs
    .filter((r) => r.content_type === "activity")
    .map((r) => r.content_id);
  const microAdventureIds = refs
    .filter((r) => r.content_type === "micro_adventure")
    .map((r) => r.content_id);

  const [accommodations, activities, microAdventures] = await Promise.all([
    accommodationIds.length
      ? getPublishedAccommodations({ ids: accommodationIds })
      : Promise.resolve([]),
    activityIds.length
      ? getPublishedActivities({ ids: activityIds })
      : Promise.resolve([]),
    microAdventureIds.length
      ? getPublishedMicroAdventures({ ids: microAdventureIds })
      : Promise.resolve([]),
  ]);

  return { accommodations, activities, microAdventures };
}

export async function getOrCreateDefaultCollection(
  userId: string
): Promise<FavoriteCollection> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("favorite_collections")
    .select("id, user_id, name, is_public, share_token")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (existing) return existing as FavoriteCollection;

  const { data: created, error } = await supabase
    .from("favorite_collections")
    .insert({ user_id: userId, name: DEFAULT_COLLECTION_NAME })
    .select("id, user_id, name, is_public, share_token")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Sammlung konnte nicht angelegt werden.");
  }
  return created as FavoriteCollection;
}

export async function isFavorited(
  userId: string,
  contentType: ContentType,
  contentId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .maybeSingle();
  return !!data;
}

/** Legt an oder entfernt, gibt den neuen Zustand zurück (true = jetzt gemerkt). */
export async function toggleFavorite(
  userId: string,
  contentType: ContentType,
  contentId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return false;
  }

  const collection = await getOrCreateDefaultCollection(userId);
  await supabase.from("favorites").insert({
    user_id: userId,
    content_type: contentType,
    content_id: contentId,
    collection_id: collection.id,
  });
  return true;
}

export async function getUserFavorites(userId: string): Promise<GroupedFavorites> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("content_type, content_id")
    .eq("user_id", userId);

  return groupContentRefs((data ?? []) as { content_type: ContentType; content_id: string }[]);
}

// Freigabe-Seite: bewusst über den service_role-Admin-Client statt einer
// öffentlichen RLS-Policy (siehe DECISIONS.md) — der Token selbst ist das
// Zugriffsmerkmal, nicht die Nutzerrolle.
export async function getCollectionByShareToken(
  token: string
): Promise<FavoriteCollection | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("favorite_collections")
    .select("id, user_id, name, is_public, share_token")
    .eq("share_token", token)
    .eq("is_public", true)
    .maybeSingle();
  return (data as FavoriteCollection) ?? null;
}

export async function getFavoritesForCollection(
  collectionId: string
): Promise<GroupedFavorites> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("favorites")
    .select("content_type, content_id")
    .eq("collection_id", collectionId);

  return groupContentRefs((data ?? []) as { content_type: ContentType; content_id: string }[]);
}
