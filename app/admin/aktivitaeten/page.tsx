import Link from "next/link";
import { getAllActivitiesForAdmin } from "@/lib/data/activities";
import { ContentTable } from "@/components/admin/content-table";
import { deleteActivity, duplicateActivity } from "@/app/admin/aktivitaeten/actions";

export default async function AdminActivitiesPage() {
  const rows = await getAllActivitiesForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Familienaktivitäten</h1>
        <Link
          href="/admin/aktivitaeten/neu"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Neue Aktivität
        </Link>
      </div>
      <ContentTable
        rows={rows}
        editHref={(id) => `/admin/aktivitaeten/${id}`}
        instagramHref={(id) => `/admin/instagram/neu?type=activity&id=${id}`}
        newsletterHref={(id) => `/admin/newsletter/neu?type=activity&id=${id}`}
        duplicateAction={duplicateActivity}
        deleteAction={deleteActivity}
      />
    </div>
  );
}
