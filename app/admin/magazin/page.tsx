import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/data/articles";
import { ContentTable } from "@/components/admin/content-table";
import { deleteArticle, duplicateArticle } from "@/app/admin/magazin/actions";

export default async function AdminArticlesPage() {
  const rows = await getAllArticlesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Magazin</h1>
        <Link
          href="/admin/magazin/neu"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Neuer Artikel
        </Link>
      </div>
      <ContentTable
        rows={rows}
        editHref={(id) => `/admin/magazin/${id}`}
        instagramHref={(id) => `/admin/instagram/neu?type=article&id=${id}`}
        duplicateAction={duplicateArticle}
        deleteAction={deleteArticle}
      />
    </div>
  );
}
