import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleByIdForAdmin } from "@/lib/data/articles";
import { getCategoriesByContentType } from "@/lib/data/shared";
import { ArticleForm } from "@/app/admin/magazin/article-form";
import { updateArticle } from "@/app/admin/magazin/actions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleByIdForAdmin(id),
    getCategoriesByContentType("article"),
  ]);

  if (!article) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{article.title}</h1>
        <Link href={`/magazin/${article.slug}?preview=1`} target="_blank" className="text-sm text-primary hover:underline">
          Vorschau ansehen
        </Link>
      </div>
      <ArticleForm article={article} categories={categories} action={updateArticle} />
    </div>
  );
}
