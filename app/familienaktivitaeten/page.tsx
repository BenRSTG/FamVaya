import type { Metadata } from "next";
import { ActivityCard } from "@/components/cards/activity-card";
import { ActivitiesFilterForm } from "@/components/activities-filter-form";
import { Pagination, paginate, PAGE_SIZE } from "@/components/pagination";
import { getActivityCategories, getPublishedActivities } from "@/lib/data/activities";
import type { ActivityFilters } from "@/lib/types";
import { toBoolean, toNumber, toStringParam, type SearchParams } from "@/lib/search-params";
import { logZeroResultSearch } from "@/lib/data/search-events";

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
  const page = Math.max(1, toNumber(params.page) ?? 1);

  const [activities, categories] = await Promise.all([
    getPublishedActivities(filters),
    getActivityCategories(),
  ]);

  if (hasActiveFilters && activities.length === 0) {
    await logZeroResultSearch({ filters: filters as Record<string, unknown> });
  }

  const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));
  const pageItems = paginate(activities, page);
  const buildHref = (targetPage: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "page" || !value) continue;
      search.set(key, Array.isArray(value) ? value[0] : value);
    }
    if (targetPage > 1) search.set("page", String(targetPage));
    const query = search.toString();
    return query ? `/familienaktivitaeten?${query}` : "/familienaktivitaeten";
  };

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

      {pageItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : hasActiveFilters ? (
        <p className="text-muted-foreground">
          Keine Aktivitäten für diese Filter gefunden. Wir merken uns diese
          Suche, um passende Angebote zu ergänzen.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Aktuell sind noch keine Aktivitäten veröffentlicht.
        </p>
      )}

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
