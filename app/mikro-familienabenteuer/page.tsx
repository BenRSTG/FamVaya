import type { Metadata } from "next";
import { MicroAdventureCard } from "@/components/cards/micro-adventure-card";
import { MicroAdventuresFilterForm } from "@/components/micro-adventures-filter-form";
import { Pagination, paginate, PAGE_SIZE } from "@/components/pagination";
import {
  getMicroAdventureCategories,
  getPublishedMicroAdventures,
} from "@/lib/data/micro-adventures";
import type { MicroAdventureFilters } from "@/lib/types";
import { toNumber, toStringParam, type SearchParams } from "@/lib/search-params";
import { logZeroResultSearch } from "@/lib/data/search-events";

export const metadata: Metadata = {
  title: "Mikro-Familienabenteuer",
  description:
    "Kleine, spontane, oft kostenlose Erlebnisse für den Familienalltag – von der Nachtwanderung bis zur Schatzsuche im Garten.",
};

const COST_LEVELS = ["free", "low", "medium", "high"] as const;
const PREPARATION_LEVELS = ["none", "light", "moderate"] as const;

export default async function MicroAdventuresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const costLevelRaw = toStringParam(params.costLevel);
  const preparationLevelRaw = toStringParam(params.preparationLevel);
  const indoorOutdoorRaw = toStringParam(params.indoorOutdoor);

  const filters: MicroAdventureFilters = {
    categorySlug: toStringParam(params.category),
    costLevel: COST_LEVELS.includes(costLevelRaw as (typeof COST_LEVELS)[number])
      ? (costLevelRaw as MicroAdventureFilters["costLevel"])
      : undefined,
    preparationLevel: PREPARATION_LEVELS.includes(
      preparationLevelRaw as (typeof PREPARATION_LEVELS)[number]
    )
      ? [preparationLevelRaw as (typeof PREPARATION_LEVELS)[number]]
      : undefined,
    indoorOutdoor:
      indoorOutdoorRaw === "indoor" || indoorOutdoorRaw === "outdoor"
        ? indoorOutdoorRaw
        : undefined,
  };
  const hasActiveFilters = Object.values(filters).some((v) => v != null);
  const page = Math.max(1, toNumber(params.page) ?? 1);

  const [adventures, categories] = await Promise.all([
    getPublishedMicroAdventures(filters),
    getMicroAdventureCategories(),
  ]);

  if (hasActiveFilters && adventures.length === 0) {
    await logZeroResultSearch({ filters: filters as Record<string, unknown> });
  }

  const totalPages = Math.max(1, Math.ceil(adventures.length / PAGE_SIZE));
  const pageItems = paginate(adventures, page);
  const buildHref = (targetPage: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "page" || !value) continue;
      search.set(key, Array.isArray(value) ? value[0] : value);
    }
    if (targetPage > 1) search.set("page", String(targetPage));
    const query = search.toString();
    return query ? `/mikro-familienabenteuer?${query}` : "/mikro-familienabenteuer";
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">
          Mikro-Familienabenteuer
        </h1>
        <p className="mt-3 text-muted-foreground">
          Für spontane Tagesausflüge und kleine Abenteuer im Familienalltag –
          günstig oder kostenlos, mit oder ohne Vorbereitung.
        </p>
      </div>

      <MicroAdventuresFilterForm
        categories={categories}
        values={{
          category: toStringParam(params.category),
          costLevel: costLevelRaw,
          preparationLevel: preparationLevelRaw,
          indoorOutdoor: indoorOutdoorRaw,
        }}
        hasActiveFilters={hasActiveFilters}
      />

      {pageItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((adventure) => (
            <MicroAdventureCard key={adventure.id} adventure={adventure} />
          ))}
        </div>
      ) : hasActiveFilters ? (
        <p className="text-muted-foreground">
          Keine Mikro-Abenteuer für diese Filter gefunden. Wir merken uns
          diese Suche, um passende Angebote zu ergänzen.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Aktuell sind noch keine Mikro-Abenteuer veröffentlicht.
        </p>
      )}

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
