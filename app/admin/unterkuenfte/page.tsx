import Link from "next/link";
import { getAllAccommodationsForAdmin } from "@/lib/data/accommodations";
import { ContentTable } from "@/components/admin/content-table";
import { deleteAccommodation, duplicateAccommodation } from "@/app/admin/unterkuenfte/actions";

export default async function AdminAccommodationsPage() {
  const rows = await getAllAccommodationsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Familienunterkünfte</h1>
        <Link
          href="/admin/unterkuenfte/neu"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Neue Unterkunft
        </Link>
      </div>
      <ContentTable
        rows={rows}
        editHref={(id) => `/admin/unterkuenfte/${id}`}
        instagramHref={(id) => `/admin/instagram/neu?type=accommodation&id=${id}`}
        newsletterHref={(id) => `/admin/newsletter/neu?type=accommodation&id=${id}`}
        duplicateAction={duplicateAccommodation}
        deleteAction={deleteAccommodation}
      />
    </div>
  );
}
