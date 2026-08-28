import Image from "next/image";
import type { ProviderGalleryImage } from "@/lib/types";

// Zeigt bestehende Galerie-Bilder + einen Mehrfach-Datei-Input zum
// Ergänzen weiterer Bilder. Kein Entfernen/Neusortieren in v1 (siehe
// DECISIONS.md) — reicht für "2-4 Bilder pflegen", der Upload passiert
// als Teil des umgebenden Formulars, analog components/admin/media-picker.tsx.
export function GalleryPicker({ images }: { images: ProviderGalleryImage[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-muted-foreground">Galerie</label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative h-20 w-28 overflow-hidden rounded-lg border border-border"
            >
              <Image src={image.storage_path} alt={image.alt_text ?? ""} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        name="gallery_images"
        accept="image/*"
        multiple
        className="text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:text-foreground"
      />
      <p className="text-xs text-muted-foreground">
        Weitere Bilder werden der Galerie hinzugefügt, bestehende bleiben erhalten.
      </p>
    </div>
  );
}
