import Image from "next/image";
import { ImageOff } from "lucide-react";

// Reiner Datei-Input, kein eigenes Formular/Submit — der Upload passiert als
// Teil des umgebenden Content-Formulars (siehe lib/data/media.ts).
export function MediaPicker({
  currentImageUrl,
  currentAltText,
}: {
  currentImageUrl?: string | null;
  currentAltText?: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-muted-foreground">Titelbild</label>
      {currentImageUrl ? (
        <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-border">
          <Image
            src={currentImageUrl}
            alt={currentAltText ?? ""}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-32 w-48 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground">
          <ImageOff className="size-4" aria-hidden />
          Kein Titelbild
        </div>
      )}
      <input
        type="file"
        name="cover_image"
        accept="image/*"
        className="text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:text-foreground"
      />
      <input
        type="text"
        name="cover_image_alt"
        placeholder="Alt-Text (Bildbeschreibung)"
        defaultValue={currentAltText ?? ""}
        className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-ring"
      />
    </div>
  );
}
