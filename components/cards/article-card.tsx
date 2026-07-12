import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholder-image";
import { resolveMediaUrl } from "@/lib/media";
import type { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  const imageUrl = resolveMediaUrl(article.cover_media);

  return (
    <Link
      href={`/magazin/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.cover_media?.alt_text ?? article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage kind="article" className="h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {article.category && (
          <p className="text-xs font-medium text-primary">{article.category.name}</p>
        )}
        <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        {article.published_at && (
          <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden />
            {new Date(article.published_at).toLocaleDateString("de-DE")}
          </p>
        )}
      </div>
    </Link>
  );
}
