import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleByIdForAdmin } from "@/lib/data/articles";
import { PlaceholderImage } from "@/components/placeholder-image";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { resolveMediaUrl } from "@/lib/media";

// Vorschau-only: die öffentliche Magazin-Detailseite kommt erst in Phase 6
// (siehe FamVaya_Bauplan_2.md), daher gibt es hier noch keine echte
// Seite zum Wiederverwenden wie bei den drei anderen Content-Typen.
export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdForAdmin(id);
  if (!article) notFound();

  const imageUrl = resolveMediaUrl(article.cover_media);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <PreviewBanner status={article.status} />
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
        {imageUrl ? (
          <Image src={imageUrl} alt={article.cover_media?.alt_text ?? article.title} fill className="object-cover" priority />
        ) : (
          <PlaceholderImage kind="accommodation" className="h-full w-full" />
        )}
      </div>
      <h1 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">{article.title}</h1>
      {article.excerpt && <p className="mb-6 text-lg text-muted-foreground">{article.excerpt}</p>}
      {article.content && (
        <div className="whitespace-pre-line text-foreground">{article.content}</div>
      )}
    </div>
  );
}
