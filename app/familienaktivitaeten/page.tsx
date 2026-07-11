import type { Metadata } from "next";
import { ActivityCard } from "@/components/cards/activity-card";
import { ActivitiesFilterForm } from "@/components/activities-filter-form";
import { getActivityCategories, getPublishedActivities } from "@/lib/data/activities";
import type { ActivityFilters } from "@/lib/types";
import { toBoolean, toNumber, toStringParam, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Familienaktivitäten",
  description:
    "Freizeitparks, Erlebnisbäder, Zoos und mehr – für Wochenenden und Kurzurlaube mit der ganzen Familie.",
};

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const indoorOutdoorRaw = toStringParam(params.indoorOutdoor);
  const filters: ActivityFilters = {
    categorySlug: toStringParam(params.category),
    indoorOutdoor:
      indoorOutdoorRaw === "indoor" || indoorOutdoorRaw === "outdoor"
        ? indoorOutdoorRaw
        : undefined,
    maxPrice: toNumber(params.maxPrice),
    largeFamilyDiscount: toBoolean(params.largeFamilyDiscount) || undefined,
  };
  const hasActiveFilters = Object.values(filters).some((v) => v != null);

  const [activities, categories] = await Promise.all([
    getPublishedActivities(filters),
    getActivityCategories(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">
          Familienaktivitäten
        </h1>
        <p className="mt-3 text-muted-foreground">
          Für Wochenenden, Kurzurlaube und besondere gemeinsame Erlebnisse –
          mit ehrlichen Angaben zu Gesamtpreisen und Großfamilienrabatten.
        </p>
      </div>

      <ActivitiesFilterForm
        categories={categories}
        values={{
          category: toStringParam(params.category),
          indoorOutdoor: indoorOutdoorRaw,
          maxPrice: toStringParam(params.maxPrice),
          largeFamilyDiscount: toStringParam(params.largeFamilyDiscount),
        }}
        hasActiveFilters={hasActiveFilters}
      />

      {activities.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : hasActiveFilters ? (
        <p className="text-muted-foreground">
          Keine Aktivitäten für diese Filter gefunden.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Aktuell sind noch keine Aktivitäten veröffentlicht.
        </p>
      )}
    </div>
  );
}
