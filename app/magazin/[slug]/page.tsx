import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholder-image";
import { ArticleCard } from "@/components/cards/article-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { Breadcrumbs, BreadcrumbJsonLd } from "@/components/breadcrumbs";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { ListingViewTracker } from "@/components/listing-view-tracker";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data/articles";
import { getFeaturedAccommodations } from "@/lib/data/accommodations";
import { getFeaturedActivities } from "@/lib/data/activities";
import { canPreview } from "@/lib/auth";
import { resolveMediaUrl } from "@/lib/media";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const description = article.excerpt ?? `${article.title} – ein FamVaya-Magazinartikel.`;
  const imageUrl = resolveMediaUrl(article.cover_media);

  return {
    title: article.title,
    description,
    alternates: { canonical: `/magazin/${article.slug}` },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      ...(article.published_at ? { publishedTime: article.published_at } : {}),
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includeUnpublished = preview === "1" && (await canPreview());
  const article = await getArticleBySlug(slug, { includeUnpublished });
  if (!article) notFound();

  const [relatedArticles, featuredAccommodations, featuredActivities] = await Promise.all([
    getRelatedArticles(article, 3),
    getFeaturedAccommodations(2),
    getFeaturedActivities(2),
  ]);

  const imageUrl = resolveMediaUrl(article.cover_media);
  const siteUrl = getSiteUrl();

  const breadcrumbItems = [
    { label: "Startseite", href: "/" },
    { label: "Magazin", href: "/magazin" },
    ...(article.category ? [{ label: article.category.name, href: `/magazin?kategorie=${article.category.slug}` }] : []),
    { label: article.title },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at,
    ...(article.author_name ? { author: { "@type": "Person", name: article.author_name } } : {}),
    publisher: { "@type": "Organization", name: "FamVaya" },
    mainEntityOfPage: `${siteUrl}/magazin/${article.slug}`,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <ListingViewTracker entityType="article" entityId={article.id} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Breadcrumbs items={breadcrumbItems} />
      <PreviewBanner status={article.status} />

      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.cover_media?.alt_text ?? article.title}
            fill
            sizes="(min-width: 640px) 768px, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <PlaceholderImage kind="article" className="h-full w-full" />
        )}
      </div>

      {article.category && (
        <p className="mb-2 text-sm font-medium text-primary">{article.category.name}</p>
      )}
      <h1 className="mb-3 text-3xl font-semibold text-foreground sm:text-4xl">{article.title}</h1>
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {article.published_at && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden />
            {new Date(article.published_at).toLocaleDateString("de-DE")}
          </span>
        )}
        {article.author_name && <span>Von {article.author_name}</span>}
      </div>

      {article.excerpt && (
        <p className="mb-6 text-lg text-muted-foreground">{article.excerpt}</p>
      )}

      {article.content && (
        <div className="mb-10 whitespace-pre-line text-foreground">{article.content}</div>
      )}

      {(featuredAccommodations.length > 0 || featuredActivities.length > 0) && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Das könnte euch auch interessieren
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {featuredAccommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Verwandte Artikel</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
