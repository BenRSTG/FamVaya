import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/cards/article-card";
import { Pagination, paginate, PAGE_SIZE } from "@/components/pagination";
import { getPublishedArticles } from "@/lib/data/articles";
import { getCategoriesByContentType } from "@/lib/data/shared";
import { toNumber, toStringParam, type SearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Magazin",
  description:
    "Tipps, Ideen und Erfahrungsberichte für Familienreisen mit drei oder mehr Kindern.",
};

export default async function MagazinePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = toStringParam(params.kategorie);
  const page = Math.max(1, toNumber(params.page) ?? 1);

  const [articles, categories] = await Promise.all([
    getPublishedArticles({ categorySlug }),
    getCategoriesByContentType("article"),
  ]);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const pageItems = paginate(articles, page);

  const buildHref = (targetPage: number) => {
    const search = new URLSearchParams();
    if (categorySlug) search.set("kategorie", categorySlug);
    if (targetPage > 1) search.set("page", String(targetPage));
    const query = search.toString();
    return query ? `/magazin?${query}` : "/magazin";
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">Magazin</h1>
        <p className="mt-3 text-muted-foreground">
          Tipps, Ideen und Erfahrungsberichte für Familien mit drei oder mehr Kindern.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/magazin"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm",
            !categorySlug
              ? "border-primary bg-accent/40 text-foreground"
              : "border-border text-muted-foreground hover:bg-secondary"
          )}
        >
          Alle
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/magazin?kategorie=${category.slug}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              categorySlug === category.slug
                ? "border-primary bg-accent/40 text-foreground"
                : "border-border text-muted-foreground hover:bg-secondary"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {pageItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {categorySlug
            ? "Keine Artikel in dieser Kategorie."
            : "Aktuell sind noch keine Artikel veröffentlicht."}
        </p>
      )}

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
