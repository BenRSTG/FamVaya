import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Bath, Bed, ExternalLink, MapPin, Ruler, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FamilyCheckSection } from "@/components/family-check-section";
import { RealityCheck } from "@/components/reality-check";
import { FavoriteButton } from "@/components/favorite-button";
import { ListingViewTracker } from "@/components/listing-view-tracker";
import { CtaTrackLink } from "@/components/cta-track-link";
import { getAccommodationBySlug } from "@/lib/data/accommodations";
import { isFavorited } from "@/lib/data/favorites";
import { canPreview, getOptionalUser } from "@/lib/auth";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { Breadcrumbs, BreadcrumbJsonLd } from "@/components/breadcrumbs";
import { formatPrice, formatPriceEstimate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { getSiteUrl } from "@/lib/site-url";
import type { Accommodation } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const accommodation = await getAccommodationBySlug(slug);
  if (!accommodation) return {};

  const description =
    accommodation.short_description ??
    `${accommodation.title} – eine FamVaya-Familienunterkunft.`;
  const imageUrl = resolveMediaUrl(accommodation.cover_media);

  return {
    title: accommodation.title,
    description,
    alternates: { canonical: `/familienunterkuenfte/${accommodation.slug}` },
    openGraph: {
      title: accommodation.title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: accommodation.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

const VALUE_TIER_LABEL: Record<NonNullable<Accommodation["value_tier"]>, string> = {
  budget: "Außergewöhnlich günstig",
  fair: "Fair",
  good_value: "Gutes Preis-Leistungs-Verhältnis",
  premium: "Premium",
};

export default async function AccommodationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeUnpublished = preview === "1" && (await canPreview());
  const accommodation = await getAccommodationBySlug(slug, { includeUnpublished });
  if (!accommodation) notFound();

  const user = await getOptionalUser();
  const favorited = user ? await isFavorited(user.id, "accommodation", accommodation.id) : false;

  const imageUrl = resolveMediaUrl(accommodation.cover_media);
  const location = [accommodation.city, accommodation.country?.name]
    .filter(Boolean)
    .join(", ");
  const isExpired = accommodation.expires_at != null && new Date(accommodation.expires_at) < new Date();
  const ctaUrl = accommodation.affiliate_url ?? accommodation.external_url;
  const goUrl = ctaUrl && !isExpired ? `/go/accommodation/${accommodation.id}` : null;

  const breadcrumbItems = [
    { label: "Startseite", href: "/" },
    { label: "Familienunterkünfte", href: "/familienunterkuenfte" },
    { label: accommodation.title },
  ];

  const lodgingJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: accommodation.title,
    description: accommodation.short_description ?? undefined,
    image: imageUrl ?? undefined,
    url: `${getSiteUrl()}/familienunterkuenfte/${accommodation.slug}`,
    ...(location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: accommodation.city ?? undefined,
            addressCountry: accommodation.country?.name ?? undefined,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <ListingViewTracker entityType="accommodation" entityId={accommodation.id} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Breadcrumbs items={breadcrumbItems} />
      <PreviewBanner status={accommodation.status} />
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={accommodation.cover_media?.alt_text ?? accommodation.title}
            fill
            sizes="(min-width: 896px) 896px, 100vw"
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

      <RealityCheck pros={accommodation.pros} cons={accommodation.cons} />

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
            Richtwert für {accommodation.example_family_size ?? "eine Familie"}:{" "}
            <strong>
              {formatPriceEstimate(accommodation.example_total_price, accommodation.currency)}
            </strong>
            {accommodation.price_checked_at && (
              <span className="ml-2 text-sm text-muted-foreground">
                Stand: {new Date(accommodation.price_checked_at).toLocaleDateString("de-DE")}
              </span>
            )}
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
        {accommodation.example_total_price && (accommodation.example_nights || accommodation.max_guests) && (
          <p className="mt-1 text-sm text-muted-foreground">
            {accommodation.example_nights &&
              `${formatPriceEstimate(accommodation.example_total_price / accommodation.example_nights, accommodation.currency)} / Nacht`}
            {accommodation.example_nights && accommodation.max_guests && " · "}
            {accommodation.max_guests &&
              `${formatPriceEstimate(accommodation.example_total_price / accommodation.max_guests, accommodation.currency)} / Person${accommodation.example_nights ? " / Nacht" : ""} bei Vollauslastung (${accommodation.max_guests} Personen)`}
          </p>
        )}
        {accommodation.value_tier && (
          <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {VALUE_TIER_LABEL[accommodation.value_tier]}
          </span>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Richtwert, kein Fixpreis — Preise und Verfügbarkeit können sich beim Anbieter ändern.
        </p>
      </section>

      {isExpired && ctaUrl && (
        <p className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground">
          Dieses Angebot ist abgelaufen.
        </p>
      )}

      <div className="flex flex-col items-start gap-2">
        {goUrl ? (
          <Button
            size="lg"
            render={
              <CtaTrackLink
                href={goUrl}
                target="_blank"
                rel="noopener noreferrer"
                entityType="accommodation"
                entityId={accommodation.id}
              />
            }
            nativeButton={false}
          >
            Preis &amp; Verfügbarkeit beim Anbieter prüfen
            <ExternalLink aria-hidden />
          </Button>
        ) : (
          <Button size="lg" disabled title="Demo-Eintrag, noch kein Anbieter verlinkt">
            Preis &amp; Verfügbarkeit beim Anbieter prüfen
            <ExternalLink aria-hidden />
          </Button>
        )}
        <p className="text-xs text-muted-foreground">
          {goUrl
            ? "Einige Links sind Affiliate-Links. Wenn ihr darüber bucht oder kauft, erhält FamVaya möglicherweise eine Provision. Für euch entstehen keine zusätzlichen Kosten."
            : "Demo-Eintrag: Für dieses Beispiel ist noch kein echter Anbieter hinterlegt."}
        </p>
      </div>
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
