import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilterField, filterInputClass } from "@/components/filter-field";
import type { Category } from "@/lib/types";

export function ActivitiesFilterForm({
  categories,
  values,
  hasActiveFilters,
}: {
  categories: Category[];
  values: {
    category?: string;
    indoorOutdoor?: string;
    maxPrice?: string;
    largeFamilyDiscount?: string;
  };
  hasActiveFilters: boolean;
}) {
  return (
    <form
      method="get"
      action="/familienaktivitaeten"
      className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <FilterField label="Kategorie" htmlFor="category">
        <select
          id="category"
          name="category"
          defaultValue={values.category ?? ""}
          className={filterInputClass}
        >
          <option value="">Alle Kategorien</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Indoor/Outdoor" htmlFor="indoorOutdoor">
        <select
          id="indoorOutdoor"
          name="indoorOutdoor"
          defaultValue={values.indoorOutdoor ?? ""}
          className={filterInputClass}
        >
          <option value="">Egal</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </FilterField>

      <FilterField label="Gesamtpreis bis (€)" htmlFor="maxPrice">
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          min={0}
          defaultValue={values.maxPrice}
          className={filterInputClass}
        />
      </FilterField>

      <label className="flex h-9 items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="largeFamilyDiscount"
          value="true"
          defaultChecked={values.largeFamilyDiscount === "true"}
          className="size-4 rounded border-border"
        />
        Großfamilienrabatt
      </label>

      <Button type="submit" size="sm">
        Filtern
      </Button>

      {hasActiveFilters && (
        <Link
          href="/familienaktivitaeten"
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Filter zurücksetzen
        </Link>
      )}
    </form>
  );
}
