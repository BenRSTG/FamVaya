import { getCategoriesByContentType } from "@/lib/data/shared";
import { ArticleForm } from "@/app/admin/magazin/article-form";
import { createArticle } from "@/app/admin/magazin/actions";

export default async function NewArticlePage() {
  const categories = await getCategoriesByContentType("article");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Neuer Magazinartikel</h1>
      <ArticleForm article={null} categories={categories} action={createArticle} />
    </div>
  );
}
