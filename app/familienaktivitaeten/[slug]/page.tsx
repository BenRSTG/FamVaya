import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, ExternalLink, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FamilyCheckSection } from "@/components/family-check-section";
import { RealityCheck } from "@/components/reality-check";
import { FavoriteButton } from "@/components/favorite-button";
import { ListingViewTracker } from "@/components/listing-view-tracker";
import { CtaTrackLink } from "@/components/cta-track-link";
import { getActivityBySlug } from "@/lib/data/activities";
import { isFavorited } from "@/lib/data/favorites";
import { canPreview, getOptionalUser } from "@/lib/auth";
import { formatPrice, formatPriceEstimate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { getSiteUrl } from "@/lib/site-url";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { Breadcrumbs, BreadcrumbJsonLd } from "@/components/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);
  if (!activity) return {};

  const description =
    activity.short_description ?? `${activity.title} – eine FamVaya-Familienaktivität.`;
  const imageUrl = resolveMediaUrl(activity.cover_media);

  return {
    title: activity.title,
    description,
    alternates: { canonical: `/familienaktivitaeten/${activity.slug}` },
    openGraph: {
      title: activity.title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: activity.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ActivityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeUnpublished = preview === "1" && (await canPreview());
  const activity = await getActivityBySlug(slug, { includeUnpublished });
  if (!activity) notFound();

  const user = await getOptionalUser();
  const favorited = user ? await isFavorited(user.id, "activity", activity.id) : false;

  const imageUrl = resolveMediaUrl(activity.cover_media);
  const location = [activity.city, activity.country?.name].filter(Boolean).join(", ");
  const isExpired = activity.expires_at != null && new Date(activity.expires_at) < new Date();
  const ctaUrl = activity.affiliate_url ?? activity.external_url;
  const goUrl = ctaUrl && !isExpired ? `/go/activity/${activity.id}` : null;

  const breadcrumbItems = [
    { label: "Startseite", href: "/" },
    { label: "Familienaktivitäten", href: "/familienaktivitaeten" },
    { label: activity.title },
  ];

  const touristAttractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: activity.title,
    description: activity.short_description ?? undefined,
    image: imageUrl ?? undefined,
    url: `${getSiteUrl()}/familienaktivitaeten/${activity.slug}`,
    ...(location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: activity.city ?? undefined,
            addressCountry: activity.country?.name ?? undefined,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <ListingViewTracker entityType="activity" entityId={activity.id} />
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd) }}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Breadcrumbs items={breadcrumbItems} />
      <PreviewBanner status={activity.status} />
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={activity.cover_media?.alt_text ?? activity.title}
            fill
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <PlaceholderImage kind="activity" className="h-full w-full" />
        )}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-4" aria-hidden />
            {location}
          </span>
        )}
        {activity.category && <span>· {activity.category.name}</span>}
      </div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {activity.title}
        </h1>
        <FavoriteButton
          contentType="activity"
          contentId={activity.id}
          initialFavorited={favorited}
          currentPath={`/familienaktivitaeten/${slug}`}
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {(activity.duration_min || activity.duration_max) && (
          <Badge icon={Clock}>
            {activity.duration_min}
            {activity.duration_max && activity.duration_max !== activity.duration_min
              ? ` – ${activity.duration_max}`
              : ""}{" "}
            Min.
          </Badge>
        )}
        {activity.indoor && <Badge>Indoor</Badge>}
        {activity.outdoor && <Badge>Outdoor</Badge>}
        {activity.weather_suitable && <Badge>Schlechtwettertauglich</Badge>}
        {activity.family_ticket && (
          <Badge icon={Ticket}>Familienticket verfügbar</Badge>
        )}
        {activity.large_family_discount && <Badge>Großfamilienrabatt</Badge>}
        {activity.booking_required && <Badge>Buchung erforderlich</Badge>}
      </div>

      <div className="mb-8">
        <FamilyCheckSection familyRating={activity.family_rating} />
      </div>

      <RealityCheck pros={activity.pros} cons={activity.cons} />

      {activity.full_description && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Beschreibung
          </h2>
          <p className="whitespace-pre-line text-muted-foreground">
            {activity.full_description}
          </p>
        </section>
      )}

      {activity.features.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Merkmale</h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activity.features.map((feature) => (
              <li
                key={feature.id}
                className="rounded-lg bg-secondary px-3 py-2 text-sm text-foreground"
              >
                {feature.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">Preise</h2>
        <div className="flex flex-col gap-1 text-foreground">
          {activity.adult_price != null && (
            <p>Erwachsene: {formatPrice(activity.adult_price)}</p>
          )}
          {activity.child_price != null && (
            <p>Kinder: {formatPrice(activity.child_price)}</p>
          )}
          {activity.example_total_price != null && (
            <p className="mt-1">
              Richtwert Gesamtpreis:{" "}
              <strong>{formatPriceEstimate(activity.example_total_price)}</strong>
              {activity.price_checked_at && (
                <span className="ml-2 text-sm text-muted-foreground">
                  Stand: {new Date(activity.price_checked_at).toLocaleDateString("de-DE")}
                </span>
              )}
            </p>
          )}
          {activity.adult_price == null && activity.example_total_price == null && (
            <p className="text-muted-foreground">Preis beim Anbieter prüfen</p>
          )}
        </div>
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
                entityType="activity"
                entityId={activity.id}
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

function Badge({
  icon: Icon,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-foreground">
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {children}
    </span>
  );
}
