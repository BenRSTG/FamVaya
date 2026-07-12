import Link from "next/link";
import { notFound } from "next/navigation";
import { getActivityByIdForAdmin, getActivityCategories } from "@/lib/data/activities";
import {
  getAllActivityFeatures,
  getAllAgeGroups,
  getAllProviders,
  getAllRegions,
  getAllTags,
} from "@/lib/data/shared";
import { ActivityForm } from "@/app/admin/aktivitaeten/activity-form";
import { updateActivity } from "@/app/admin/aktivitaeten/actions";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [activity, categories, providers, regions, features, ageGroups, tags] = await Promise.all([
    getActivityByIdForAdmin(id),
    getActivityCategories(),
    getAllProviders(),
    getAllRegions(),
    getAllActivityFeatures(),
    getAllAgeGroups(),
    getAllTags(),
  ]);

  if (!activity) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{activity.title}</h1>
        <Link
          href={`/familienaktivitaeten/${activity.slug}?preview=1`}
          target="_blank"
          className="text-sm text-primary hover:underline"
        >
          Vorschau ansehen
        </Link>
      </div>
      <ActivityForm
        activity={activity}
        categories={categories}
        providers={providers}
        regions={regions}
        features={features}
        ageGroups={ageGroups}
        tags={tags}
        action={updateActivity}
      />
    </div>
  );
}
