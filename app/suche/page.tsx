import type { Metadata } from "next";
import { Search } from "lucide-react";
import { SearchResultItem } from "@/components/search-result-item";
import { filterInputClass } from "@/components/filter-field";
import { Button } from "@/components/ui/button";
import { searchAllContent } from "@/lib/data/search";
import { toStringParam, type SearchParams } from "@/lib/search-params";
import { trackEvent } from "@/lib/analytics/server";

export const metadata: Metadata = {
  title: "Suche",
  description:
    "Durchsuche alle FamVaya-Familienunterkünfte, -aktivitäten, Mikro-Familienabenteuer und Magazinartikel.",
};

const GROUP_LABELS = {
  accommodation: "Familienunterkünfte",
  activity: "Familienaktivitäten",
  micro_adventure: "Mikro-Familienabenteuer",
  article: "Magazin",
} as const;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = toStringParam(params.q) ?? "";

  const results = query ? await searchAllContent(query) : null;
  if (query) await trackEvent("search_performed", { query });
  const totalCount = results
    ? results.accommodation.length +
      results.activity.length +
      results.micro_adventure.length +
      results.article.length
    : 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-3xl font-semibold text-foreground">Suche</h1>

      <form
        method="get"
        action="/suche"
        className="mb-10 flex gap-3 rounded-2xl border border-border bg-card p-4"
      >
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="z. B. Ferienhaus, Nachtwanderung, München…"
          className={filterInputClass + " flex-1"}
          autoFocus
        />
        <Button type="submit">
          <Search aria-hidden />
          Suchen
        </Button>
      </form>

      {!results && (
        <p className="text-muted-foreground">
          Durchsucht Familienunterkünfte, -aktivitäten, Mikro-Familienabenteuer und
          das Magazin — auch mit kleinen Tippfehlern.
        </p>
      )}

      {results && totalCount === 0 && (
        <p className="text-muted-foreground">
          Keine Treffer für „{query}". Versuch es mit einem anderen Begriff.
        </p>
      )}

      {results &&
        (Object.keys(GROUP_LABELS) as (keyof typeof GROUP_LABELS)[]).map((type) =>
          results[type].length > 0 ? (
            <section key={type} className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {GROUP_LABELS[type]}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {results[type].map((result) => (
                  <SearchResultItem key={result.id} result={result} />
                ))}
              </div>
            </section>
          ) : null
        )}
    </div>
  );
}
