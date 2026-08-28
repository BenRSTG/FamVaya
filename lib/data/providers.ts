import { createAdminClient } from "@/lib/supabase/admin";
import type { Provider, ProviderGalleryImage } from "@/lib/types";

export { getAllProviders as getAllProvidersForAdmin } from "@/lib/data/shared";

export type ProviderInput = Omit<Provider, "id" | "slug" | "logo_media_id"> & { slug: string };

export interface ProviderFormData extends Provider {
  logo: { storage_path: string; alt_text: string | null } | null;
  gallery: ProviderGalleryImage[];
}

export async function getProviderByIdForAdmin(id: string): Promise<ProviderFormData | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("providers")
    .select(
      "id, name, slug, description, website, affiliate_network, contact_email, status, logo_media_id, logo:media(storage_path, alt_text)"
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;

  const gallery = await getProviderGallery(id);
  return { ...data, logo: data.logo as unknown as ProviderFormData["logo"], gallery };
}

export async function createProviderRow(input: ProviderInput): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("providers").insert(input).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function updateProviderRow(id: string, input: ProviderInput): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("providers").update(input).eq("id", id);
  if (error) throw error;
}

export async function setProviderLogo(providerId: string, mediaId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("providers")
    .update({ logo_media_id: mediaId })
    .eq("id", providerId);
  if (error) throw error;
}

export async function addProviderGalleryImages(
  providerId: string,
  mediaIds: string[]
): Promise<void> {
  if (mediaIds.length === 0) return;
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("provider_media")
    .select("sort_order")
    .eq("provider_id", providerId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextSortOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const rows = mediaIds.map((mediaId, index) => ({
    provider_id: providerId,
    media_id: mediaId,
    sort_order: nextSortOrder + index,
  }));
  const { error } = await supabase.from("provider_media").insert(rows);
  if (error) throw error;
}

export async function getProviderGallery(providerId: string): Promise<ProviderGalleryImage[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("provider_media")
    .select("media(id, storage_path, alt_text)")
    .eq("provider_id", providerId)
    .order("sort_order", { ascending: true });

  return (data ?? []).map((row) => {
    const media = row.media as unknown as ProviderGalleryImage;
    return media;
  });
}
