import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilterField, filterInputClass } from "@/components/filter-field";
import type { Category } from "@/lib/types";

export function MicroAdventuresFilterForm({
  categories,
  values,
  hasActiveFilters,
}: {
  categories: Category[];
  values: {
    category?: string;
    costLevel?: string;
    preparationLevel?: string;
    indoorOutdoor?: string;
  };
  hasActiveFilters: boolean;
}) {
  return (
    <form
      method="get"
      action="/mikro-familienabenteuer"
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

      <FilterField label="Budget" htmlFor="costLevel">
        <select
          id="costLevel"
          name="costLevel"
          defaultValue={values.costLevel ?? ""}
          className={filterInputClass}
        >
          <option value="">Egal</option>
          <option value="free">Kostenlos</option>
          <option value="low">Günstig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
      </FilterField>

      <FilterField label="Vorbereitung" htmlFor="preparationLevel">
        <select
          id="preparationLevel"
          name="preparationLevel"
          defaultValue={values.preparationLevel ?? ""}
          className={filterInputClass}
        >
          <option value="">Egal</option>
          <option value="none">Spontan umsetzbar</option>
          <option value="light">Wenig Vorbereitung</option>
          <option value="moderate">Etwas Vorbereitung</option>
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

      <Button type="submit" size="sm">
        Filtern
      </Button>

      {hasActiveFilters && (
        <Link
          href="/mikro-familienabenteuer"
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Filter zurücksetzen
        </Link>
      )}
    </form>
  );
}
