import type { Media } from "@/lib/types";

// Seed-Daten (Phase 0) verweisen auf fiktive storage_path-Werte, für die nie
// echte Dateien in Supabase Storage hochgeladen wurden. Nur vollqualifizierte
// URLs werden als echtes Bild behandelt — alles andere fällt auf
// PlaceholderImage zurück (siehe components/placeholder-image.tsx).
export function resolveMediaUrl(media: Media | null): string | null {
  if (!media) return null;
  if (media.storage_path.startsWith("http")) return media.storage_path;
  return null;
}
