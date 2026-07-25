import Link from "next/link";
import { getAllMicroAdventuresForAdmin } from "@/lib/data/micro-adventures";
import { ContentTable } from "@/components/admin/content-table";
import { deleteMicroAdventure, duplicateMicroAdventure } from "@/app/admin/mikro-abenteuer/actions";

export default async function AdminMicroAdventuresPage() {
  const rows = await getAllMicroAdventuresForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Mikro-Familienabenteuer</h1>
        <Link
          href="/admin/mikro-abenteuer/neu"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Neues Mikro-Abenteuer
        </Link>
      </div>
      <ContentTable
        rows={rows}
        editHref={(id) => `/admin/mikro-abenteuer/${id}`}
        instagramHref={(id) => `/admin/instagram/neu?type=micro_adventure&id=${id}`}
        newsletterHref={(id) => `/admin/newsletter/neu?type=micro_adventure&id=${id}`}
        duplicateAction={duplicateMicroAdventure}
        deleteAction={deleteMicroAdventure}
      />
    </div>
  );
}
