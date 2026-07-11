import type { Metadata } from "next";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { AccommodationsFilterForm } from "@/components/accommodations-filter-form";
import {
  getAccommodationTypes,
  getPublishedAccommodations,
} from "@/lib/data/accommodations";
import type { AccommodationFilters } from "@/lib/types";
import { toNumber, toStringParam, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Familienunterkünfte",
  description:
    "Familienhotels, Ferienhäuser, Ferienwohnungen und mehr – speziell geeignet für Familien mit drei oder mehr Kindern.",
};

export default async function AccommodationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters: AccommodationFilters = {
    minGuests: toNumber(params.minGuests),
    minChildren: toNumber(params.minChildren),
    minBedrooms: toNumber(params.minBedrooms),
    maxPrice: toNumber(params.maxPrice),
    typeSlug: toStringParam(params.type),
  };
  const hasActiveFilters = Object.values(filters).some((v) => v != null);

  const [accommodations, accommodationTypes] = await Promise.all([
    getPublishedAccommodations(filters),
    getAccommodationTypes(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">
          Familienunterkünfte
        </h1>
        <p className="mt-3 text-muted-foreground">
          Für Urlaub, Ferien und längere Auszeiten. Von Ferienhäusern über
          Familienhotels bis zu Bauernhöfen – ausgewählt danach, ob sie
          tatsächlich für Familien mit drei oder mehr Kindern funktionieren.
        </p>
      </div>

      <AccommodationsFilterForm
        accommodationTypes={accommodationTypes}
        values={{
          minGuests: toStringParam(params.minGuests),
          minChildren: toStringParam(params.minChildren),
          minBedrooms: toStringParam(params.minBedrooms),
          maxPrice: toStringParam(params.maxPrice),
          type: toStringParam(params.type),
        }}
        hasActiveFilters={hasActiveFilters}
      />

      {accommodations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accommodations.map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </div>
      ) : hasActiveFilters ? (
        <p className="text-muted-foreground">
          Keine Unterkünfte für diese Filter gefunden.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Aktuell sind noch keine Unterkünfte veröffentlicht.
        </p>
      )}
    </div>
  );
}
