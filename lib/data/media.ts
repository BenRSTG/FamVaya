import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContentType } from "@/lib/types";

const MEDIA_BUCKET = "content-media";

// Plain Helper statt eigener Server Action (siehe Plan Abschnitt 4) — wird
// von den create/update-Actions der einzelnen Content-Typen intern
// aufgerufen, damit Upload + Content-Speicherung in einem Formular-Submit
// passieren. Gibt die neue media.id zurück; storage_path erhält die volle
// öffentliche URL, damit lib/media.ts#resolveMediaUrl sie direkt verwendet.
export async function uploadMediaFile(file: File, altText?: string): Promise<string> {
  const supabase = createAdminClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type || undefined });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({ storage_path: publicUrlData.publicUrl, alt_text: altText || null })
    .select("id")
    .single();
  if (error) throw error;

  return data.id as string;
}

// Variante von uploadMediaFile() für serverseitig erzeugte Bilder (z. B.
// die Instagram-Post-Grafik aus lib/instagram/template.tsx), die als
// Buffer statt als Browser-File vorliegen — legt bewusst keine
// content_media-Verknüpfung an (siehe DECISIONS.md, Phase 11: generierte
// Werbegrafiken sind kein Content-Foto des Inserats).
export async function uploadMediaBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string,
  altText?: string
): Promise<string> {
  const supabase = createAdminClient();
  const extension = filename.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, buffer, { contentType });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({ storage_path: publicUrlData.publicUrl, alt_text: altText || null })
    .select("id")
    .single();
  if (error) throw error;

  return data.id as string;
}

// Ersetzt das Titelbild eines polymorphen Content-Items (Unterkunft/
// Aktivität/Mikro-Abenteuer). Magazinartikel nutzen stattdessen die direkte
// Spalte articles.cover_media_id (siehe 0008_favorites_reviews_articles.sql).
export async function setCoverImage(
  contentType: ContentType,
  contentId: string,
  mediaId: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("content_media")
    .delete()
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("is_cover", true);
  await supabase
    .from("content_media")
    .insert({ content_type: contentType, content_id: contentId, media_id: mediaId, is_cover: true });
}
