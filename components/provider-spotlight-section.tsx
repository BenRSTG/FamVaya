import Image from "next/image";
import type { ProviderGalleryImage, ProviderPublic } from "@/lib/types";

// Analog RealityCheck/FamilyCheckSection: lieber ausblenden als eine
// halbfertige Box zeigen, solange der Anbieter redaktionell nicht
// gepflegt ist.
export function ProviderSpotlightSection({
  provider,
  gallery,
}: {
  provider: ProviderPublic | null;
  gallery: ProviderGalleryImage[];
}) {
  if (!provider || !provider.description) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        {provider.logo && (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
            <Image
              src={provider.logo.storage_path}
              alt={provider.logo.alt_text ?? provider.name}
              fill
              className="object-contain p-1"
            />
          </div>
        )}
        <h2 className="text-lg font-semibold text-foreground">Über {provider.name}</h2>
      </div>

      <p className="text-sm text-muted-foreground">{provider.description}</p>

      {gallery.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {gallery.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={image.storage_path}
                alt={image.alt_text ?? provider.name}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
