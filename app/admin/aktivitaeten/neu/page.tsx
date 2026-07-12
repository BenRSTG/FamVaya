import { getActivityCategories } from "@/lib/data/activities";
import {
  getAllActivityFeatures,
  getAllAgeGroups,
  getAllProviders,
  getAllRegions,
  getAllTags,
} from "@/lib/data/shared";
import { ActivityForm } from "@/app/admin/aktivitaeten/activity-form";
import { createActivity } from "@/app/admin/aktivitaeten/actions";

export default async function NewActivityPage() {
  const [categories, providers, regions, features, ageGroups, tags] = await Promise.all([
    getActivityCategories(),
    getAllProviders(),
    getAllRegions(),
    getAllActivityFeatures(),
    getAllAgeGroups(),
    getAllTags(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Neue Aktivität</h1>
      <ActivityForm
        activity={null}
        categories={categories}
        providers={providers}
        regions={regions}
        features={features}
        ageGroups={ageGroups}
        tags={tags}
        action={createActivity}
      />
    </div>
  );
}
