import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, ExternalLink, Package, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FavoriteButton } from "@/components/favorite-button";
import { FamilyCheckSection } from "@/components/family-check-section";
import { RealityCheck } from "@/components/reality-check";
import { ListingViewTracker } from "@/components/listing-view-tracker";
import { CtaTrackLink } from "@/components/cta-track-link";
import { getMicroAdventureBySlug } from "@/lib/data/micro-adventures";
import { isFavorited } from "@/lib/data/favorites";
import { canPreview, getOptionalUser } from "@/lib/auth";
import { formatPriceEstimate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { getSiteUrl } from "@/lib/site-url";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { Breadcrumbs, BreadcrumbJsonLd } from "@/components/breadcrumbs";

const COST_LABEL: Record<string, string> = {
  free: "Kostenlos",
  low: "Günstig",
  medium: "Mittleres Budget",
  high: "Höheres Budget",
};

const PREPARATION_LABEL: Record<string, string> = {
  none: "Spontan umsetzbar",
  light: "Wenig Vorbereitung nötig",
  moderate: "Etwas Vorbereitung nötig",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const adventure = await getMicroAdventureBySlug(slug);
  if (!adventure) return {};

  const description =
    adventure.short_description ?? `${adventure.title} – ein FamVaya-Mikro-Abenteuer.`;
  const imageUrl = resolveMediaUrl(adventure.cover_media);

  return {
    title: adventure.title,
    description,
    alternates: { canonical: `/mikro-familienabenteuer/${adventure.slug}` },
    openGraph: {
      title: adventure.title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: adventure.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function MicroAdventureDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeUnpublished = preview === "1" && (await canPreview());
  const adventure = await getMicroAdventureBySlug(slug, { includeUnpublished });
  if (!adventure) notFound();

  const user = await getOptionalUser();
  const favorited = user
    ? await isFavorited(user.id, "micro_adventure", adventure.id)
    : false;

  const imageUrl = resolveMediaUrl(adventure.cover_media);
  const ctaUrl = adventure.affiliate_url ?? adventure.external_url;
  const goUrl = ctaUrl ? `/go/micro_adventure/${adventure.id}` : null;

  const breadcrumbItems = [
    { label: "Startseite", href: "/" },
    { label: "Mikro-Familienabenteuer", href: "/mikro-familienabenteuer" },
    { label: adventure.title },
  ];

  const touristAttractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: adventure.title,
    description: adventure.short_description ?? undefined,
    image: imageUrl ?? undefined,
    url: `${getSiteUrl()}/mikro-familienabenteuer/${adventure.slug}`,
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <ListingViewTracker entityType="micro_adventure" entityId={adventure.id} />
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd) }}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Breadcrumbs items={breadcrumbItems} />
      <PreviewBanner status={adventure.status} />
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={adventure.cover_media?.alt_text ?? adventure.title}
            fill
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <PlaceholderImage kind="micro_adventure" className="h-full w-full" />
        )}
      </div>

      {adventure.category && (
        <p className="mb-2 text-sm text-muted-foreground">{adventure.category.name}</p>
      )}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {adventure.title}
        </h1>
        <FavoriteButton
          contentType="micro_adventure"
          contentId={adventure.id}
          initialFavorited={favorited}
          currentPath={`/mikro-familienabenteuer/${slug}`}
        />
      </div>
      {adventure.short_description && (
        <p className="mb-6 text-lg text-muted-foreground">
          {adventure.short_description}
        </p>
      )}

      <div className="mb-8 flex flex-wrap gap-3">
        {(adventure.duration_min || adventure.duration_max) && (
          <Badge icon={Clock}>
            {adventure.duration_min}
            {adventure.duration_max && adventure.duration_max !== adventure.duration_min
              ? ` – ${adventure.duration_max}`
              : ""}{" "}
            Min.
          </Badge>
        )}
        {adventure.cost_level && (
          <Badge icon={Wallet}>
            {adventure.cost_level === "free" || !adventure.estimated_total_cost
              ? COST_LABEL[adventure.cost_level]
              : formatPriceEstimate(adventure.estimated_total_cost)}
          </Badge>
        )}
        {adventure.preparation_level && (
          <Badge>{PREPARATION_LABEL[adventure.preparation_level]}</Badge>
        )}
        {adventure.indoor && <Badge>Indoor</Badge>}
        {adventure.outdoor && <Badge>Outdoor</Badge>}
      </div>

      <div className="mb-8">
        <FamilyCheckSection familyRating={adventure.family_rating} />
      </div>

      <RealityCheck pros={adventure.pros} cons={adventure.cons} />

      {adventure.full_description && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Beschreibung
          </h2>
          <p className="whitespace-pre-line text-muted-foreground">
            {adventure.full_description}
          </p>
        </section>
      )}

      {adventure.instructions && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Ablauf
          </h2>
          <p className="whitespace-pre-line text-muted-foreground">
            {adventure.instructions}
          </p>
        </section>
      )}

      {adventure.materials.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Package className="size-5" aria-hidden />
            Benötigte Materialien
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {adventure.materials.map((material) => (
              <li
                key={material}
                className="rounded-lg bg-secondary px-3 py-2 text-sm text-foreground"
              >
                {material}
              </li>
            ))}
          </ul>
        </section>
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
                entityType="micro_adventure"
                entityId={adventure.id}
              />
            }
            nativeButton={false}
          >
            Mehr erfahren
            <ExternalLink aria-hidden />
          </Button>
        ) : (
          <Button size="lg" disabled title="Demo-Eintrag, noch kein Anbieter verlinkt">
            Mehr erfahren
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
