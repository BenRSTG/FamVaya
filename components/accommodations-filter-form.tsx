import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilterField, filterInputClass } from "@/components/filter-field";
import type { AccommodationType } from "@/lib/types";

export function AccommodationsFilterForm({
  accommodationTypes,
  values,
  hasActiveFilters,
}: {
  accommodationTypes: AccommodationType[];
  values: {
    minGuests?: string;
    minChildren?: string;
    minBedrooms?: string;
    maxPrice?: string;
    type?: string;
  };
  hasActiveFilters: boolean;
}) {
  return (
    <form
      method="get"
      action="/familienunterkuenfte"
      className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <FilterField label="Mind. Personen" htmlFor="minGuests">
        <input
          id="minGuests"
          type="number"
          name="minGuests"
          min={0}
          defaultValue={values.minGuests}
          className={filterInputClass}
        />
      </FilterField>

      <FilterField label="Mind. Kinder" htmlFor="minChildren">
        <input
          id="minChildren"
          type="number"
          name="minChildren"
          min={0}
          defaultValue={values.minChildren}
          className={filterInputClass}
        />
      </FilterField>

      <FilterField label="Mind. Schlafzimmer" htmlFor="minBedrooms">
        <input
          id="minBedrooms"
          type="number"
          name="minBedrooms"
          min={0}
          defaultValue={values.minBedrooms}
          className={filterInputClass}
        />
      </FilterField>

      <FilterField label="Preis bis (€)" htmlFor="maxPrice">
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          min={0}
          defaultValue={values.maxPrice}
          className={filterInputClass}
        />
      </FilterField>

      <FilterField label="Typ" htmlFor="type">
        <select
          id="type"
          name="type"
          defaultValue={values.type ?? ""}
          className={filterInputClass}
        >
          <option value="">Alle Typen</option>
          {accommodationTypes.map((type) => (
            <option key={type.id} value={type.slug}>
              {type.name}
            </option>
          ))}
        </select>
      </FilterField>

      <Button type="submit" size="sm">
        Filtern
      </Button>

      {hasActiveFilters && (
        <Link
          href="/familienunterkuenfte"
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Filter zurücksetzen
        </Link>
      )}
    </form>
  );
}
