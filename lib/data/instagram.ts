import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccommodationByIdForAdmin } from "@/lib/data/accommodations";
import { getActivityByIdForAdmin } from "@/lib/data/activities";
import { getMicroAdventureByIdForAdmin } from "@/lib/data/micro-adventures";
import { getArticleByIdForAdmin } from "@/lib/data/articles";
import { uploadMediaBuffer } from "@/lib/data/media";
import { renderPostImage } from "@/lib/instagram/template";
import {
  accommodationToPostContent,
  activityToPostContent,
  articleToPostContent,
  microAdventureToPostContent,
} from "@/lib/instagram/content-mapping";
import type { InstagramContentType } from "@/lib/instagram/types";
import { generateCaption } from "@/lib/instagram/caption";
import { publishToInstagram } from "@/lib/instagram/graph-api";

export interface InstagramPost {
  id: string;
  content_type: InstagramContentType;
  content_id: string;
  media_id: string | null;
  caption: string;
  status: "draft" | "published" | "failed";
  instagram_media_id: string | null;
  error_message: string | null;
  published_at: string | null;
  created_at: string;
  media: { storage_path: string } | null;
}

const SELECT = `
  id, content_type, content_id, media_id, caption, status,
  instagram_media_id, error_message, published_at, created_at,
  media:media(storage_path)
`;

async function loadContentAndBuildPost(contentType: InstagramContentType, contentId: string) {
  switch (contentType) {
    case "accommodation": {
      const content = await getAccommodationByIdForAdmin(contentId);
      if (!content) throw new Error("Unterkunft nicht gefunden.");
      return accommodationToPostContent(content);
    }
    case "activity": {
      const content = await getActivityByIdForAdmin(contentId);
      if (!content) throw new Error("Aktivität nicht gefunden.");
      return activityToPostContent(content);
    }
    case "micro_adventure": {
      const content = await getMicroAdventureByIdForAdmin(contentId);
      if (!content) throw new Error("Mikro-Abenteuer nicht gefunden.");
      return microAdventureToPostContent(content);
    }
    case "article": {
      const content = await getArticleByIdForAdmin(contentId);
      if (!content) throw new Error("Magazinartikel nicht gefunden.");
      return articleToPostContent(content);
    }
  }
}

export async function createInstagramPost(
  contentType: InstagramContentType,
  contentId: string
): Promise<InstagramPost> {
  const supabase = createAdminClient();
  const { image, caption } = await loadContentAndBuildPost(contentType, contentId);

  const buffer = await renderPostImage(image);
  const mediaId = await uploadMediaBuffer(
    buffer,
    `instagram-${contentType}-${contentId}.png`,
    "image/png",
    `Instagram-Post: ${image.title}`
  );

  const { data, error } = await supabase
    .from("instagram_posts")
    .insert({
      content_type: contentType,
      content_id: contentId,
      media_id: mediaId,
      caption: generateCaption(caption),
      status: "draft",
    })
    .select(SELECT)
    .single();
  if (error) throw error;

  return data as unknown as InstagramPost;
}

export async function getInstagramPostsForAdmin(): Promise<InstagramPost[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("instagram_posts")
    .select(SELECT)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as InstagramPost[];
}

export async function getInstagramPostById(id: string): Promise<InstagramPost | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("instagram_posts").select(SELECT).eq("id", id).maybeSingle();
  return data as unknown as InstagramPost | null;
}

export async function getInstagramPostForContent(
  contentType: InstagramContentType,
  contentId: string
): Promise<InstagramPost | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("instagram_posts")
    .select(SELECT)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as unknown as InstagramPost | null;
}

export async function updateInstagramPostCaption(id: string, caption: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("instagram_posts").update({ caption }).eq("id", id);
  if (error) throw error;
}

export async function publishInstagramPost(id: string): Promise<void> {
  const supabase = createAdminClient();
  const post = await getInstagramPostById(id);
  if (!post) throw new Error("Instagram-Post nicht gefunden.");
  if (!post.media?.storage_path) throw new Error("Kein Bild für diesen Post vorhanden.");

  try {
    const { instagramMediaId } = await publishToInstagram({
      imageUrl: post.media.storage_path,
      caption: post.caption,
    });
    await supabase
      .from("instagram_posts")
      .update({ status: "published", instagram_media_id: instagramMediaId, published_at: new Date().toISOString() })
      .eq("id", id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler beim Veröffentlichen.";
    await supabase.from("instagram_posts").update({ status: "failed", error_message: message }).eq("id", id);
    throw err;
  }
}
