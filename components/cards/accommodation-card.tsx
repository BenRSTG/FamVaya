import Link from "next/link";
import Image from "next/image";
import { BedDouble, MapPin, Users } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FamilyFitBadge } from "@/components/family-fit-badge";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { formatPrice } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import type { Accommodation } from "@/lib/types";

function getBadge(accommodation: Accommodation): string | null {
  if (accommodation.featured) return "Familienfavorit";
  if ((accommodation.max_guests ?? 0) >= 6) return "Für 6+ Personen";
  if ((accommodation.max_guests ?? 0) >= 5) return "Für 5+ Personen";
  if ((accommodation.bedrooms ?? 0) >= 3) return "Mehrere Schlafzimmer";
  return null;
}

export function AccommodationCard({
  accommodation,
}: {
  accommodation: Accommodation;
}) {
  const imageUrl = resolveMediaUrl(accommodation.cover_media);
  const badge = getBadge(accommodation);
  const location = [accommodation.city, accommodation.country?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/familienunterkuenfte/${accommodation.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={accommodation.cover_media?.alt_text ?? accommodation.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage kind="accommodation" className="h-full w-full" />
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground shadow-sm">
            {badge}
          </span>
        )}
        <FamilyFitBadge
          score={accommodation.family_rating}
          className="absolute right-3 top-3"
        />
        <CompareToggle
          contentType="accommodation"
          id={accommodation.id}
          className="absolute bottom-3 right-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {(accommodation.accommodation_type || location) && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {location && (
                <>
                  <MapPin className="size-3" aria-hidden />
                  {location}
                </>
              )}
              {accommodation.accommodation_type && location && " · "}
              {accommodation.accommodation_type?.name}
            </p>
          )}
          <h3 className="text-lg font-semibold text-foreground">
            {accommodation.title}
          </h3>
        </div>

        {(accommodation.max_adults != null || accommodation.max_children != null) && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-4 shrink-0" aria-hidden />
            Für bis zu {accommodation.max_adults ?? "?"} Erwachsene + {accommodation.max_children ?? "?"} Kinder
          </p>
        )}

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <BedDouble className="size-4 shrink-0" aria-hidden />
          {accommodation.bedrooms ?? "?"} Schlafzimmer · max.{" "}
          {accommodation.max_guests ?? "?"} Personen
        </p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {accommodation.example_total_price ? (
              <>
                <p className="text-xs text-muted-foreground">Beispielpreis</p>
                <p className="text-base font-semibold text-foreground">
                  {formatPrice(
                    accommodation.example_total_price,
                    accommodation.currency
                  )}
                </p>
              </>
            ) : accommodation.price_from ? (
              <>
                <p className="text-xs text-muted-foreground">Preis ab</p>
                <p className="text-base font-semibold text-foreground">
                  {formatPrice(accommodation.price_from, accommodation.currency)}
                  {accommodation.price_type === "per_night" && " / Nacht"}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Preis beim Anbieter prüfen
              </p>
            )}
          </div>
          <span className="text-sm font-medium text-primary group-hover:underline">
            Details ansehen
          </span>
        </div>
      </div>
    </Link>
  );
}
