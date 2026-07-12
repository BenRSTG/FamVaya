import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Bath, Bed, ExternalLink, MapPin, Ruler, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FamilyCheckSection } from "@/components/family-check-section";
import { FavoriteButton } from "@/components/favorite-button";
import { getAccommodationBySlug } from "@/lib/data/accommodations";
import { isFavorited } from "@/lib/data/favorites";
import { getOptionalUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const accommodation = await getAccommodationBySlug(slug);
  if (!accommodation) return {};

  return {
    title: accommodation.title,
    description:
      accommodation.short_description ??
      `${accommodation.title} – eine FamVaya-Familienunterkunft.`,
  };
}

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const accommodation = await getAccommodationBySlug(slug);
  if (!accommodation) notFound();

  const user = await getOptionalUser();
  const favorited = user ? await isFavorited(user.id, "accommodation", accommodation.id) : false;

  const imageUrl = resolveMediaUrl(accommodation.cover_media);
  const location = [accommodation.city, accommodation.country?.name]
    .filter(Boolean)
    .join(", ");
  const ctaUrl = accommodation.affiliate_url ?? accommodation.external_url;
  const goUrl = ctaUrl ? `/go/accommodation/${accommodation.id}` : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={accommodation.cover_media?.alt_text ?? accommodation.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <PlaceholderImage kind="accommodation" className="h-full w-full" />
        )}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-4" aria-hidden />
            {location}
          </span>
        )}
        {accommodation.accommodation_type && (
          <span>· {accommodation.accommodation_type.name}</span>
        )}
      </div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {accommodation.title}
        </h1>
        <FavoriteButton
          contentType="accommodation"
          contentId={accommodation.id}
          initialFavorited={favorited}
          currentPath={`/familienunterkuenfte/${slug}`}
        />
      </div>

      {/* Kerninformationen */}
      <div className="mb-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-4">
        <InfoStat icon={Users} label="Max. Personen" value={accommodation.max_guests} />
        <InfoStat icon={Bed} label="Schlafzimmer" value={accommodation.bedrooms} />
        <InfoStat icon={Bath} label="Badezimmer" value={accommodation.bathrooms} />
        <InfoStat
          icon={Ruler}
          label="Wohnfläche"
          value={accommodation.living_area ? `${accommodation.living_area} m²` : null}
        />
      </div>

      <div className="mb-8">
        <FamilyCheckSection
          familyRating={accommodation.family_rating}
          maxChildren={accommodation.max_children}
        />
      </div>

      {accommodation.full_description && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Beschreibung
          </h2>
          <p className="whitespace-pre-line text-muted-foreground">
            {accommodation.full_description}
          </p>
        </section>
      )}

      {accommodation.amenities.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Ausstattung
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {accommodation.amenities.map((amenity) => (
              <li
                key={amenity.id}
                className="rounded-lg bg-secondary px-3 py-2 text-sm text-foreground"
              >
                {amenity.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Preisbereich */}
      <section className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">Preis</h2>
        {accommodation.example_total_price ? (
          <p className="text-foreground">
            Beispielpreis für {accommodation.example_family_size ?? "eine Familie"}:{" "}
            <strong>
              {formatPrice(accommodation.example_total_price, accommodation.currency)}
            </strong>
          </p>
        ) : accommodation.price_from ? (
          <p className="text-foreground">
            Preis ab{" "}
            <strong>{formatPrice(accommodation.price_from, accommodation.currency)}</strong>
            {accommodation.price_type === "per_night" && " pro Nacht"}
          </p>
        ) : (
          <p className="text-muted-foreground">Preis beim Anbieter prüfen</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Preise und Verfügbarkeit können sich beim Anbieter ändern.
        </p>
      </section>

      {goUrl && (
        <div className="flex flex-col items-start gap-2">
          <Button
            size="lg"
            render={<a href={goUrl} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
          >
            Unterkunft beim Anbieter ansehen
            <ExternalLink aria-hidden />
          </Button>
          <p className="text-xs text-muted-foreground">
            Einige Links sind Affiliate-Links. Wenn ihr darüber bucht oder
            kauft, erhält FamVaya möglicherweise eine Provision. Für euch
            entstehen keine zusätzlichen Kosten.
          </p>
        </div>
      )}
    </div>
  );
}

function InfoStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon className="size-5 text-primary" aria-hidden />
      <span className="text-sm font-semibold text-foreground">{value ?? "–"}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
