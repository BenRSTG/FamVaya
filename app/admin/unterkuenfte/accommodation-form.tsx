import { filterInputClass } from "@/components/filter-field";
import { FormField, FormSection } from "@/components/admin/form-field";
import { StatusSelect } from "@/components/admin/status-select";
import { CheckboxGroup } from "@/components/admin/checkbox-group";
import { MediaPicker } from "@/components/admin/media-picker";
import type { AccommodationFormData } from "@/lib/data/accommodations";
import type { AccommodationType, AgeGroup, Provider, RegionWithCountry, Tag, Amenity } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";

export function AccommodationForm({
  accommodation,
  accommodationTypes,
  providers,
  regions,
  amenities,
  ageGroups,
  tags,
  action,
}: {
  accommodation: AccommodationFormData | null;
  accommodationTypes: AccommodationType[];
  providers: Provider[];
  regions: RegionWithCountry[];
  amenities: Amenity[];
  ageGroups: AgeGroup[];
  tags: Tag[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const a = accommodation;

  return (
    <form action={action} className="flex flex-col gap-6">
      {a && <input type="hidden" name="id" value={a.id} />}

      <FormSection title="Basisdaten">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Titel" htmlFor="title">
            <input
              id="title"
              name="title"
              required
              defaultValue={a?.title ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Slug" htmlFor="slug">
            <input
              id="slug"
              name="slug"
              required
              defaultValue={a?.slug ?? ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
        <FormField label="Kurzbeschreibung" htmlFor="short_description">
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            defaultValue={a?.short_description ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField label="Ausführliche Beschreibung" htmlFor="full_description">
          <textarea
            id="full_description"
            name="full_description"
            rows={6}
            defaultValue={a?.full_description ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField label="Unterkunftstyp" htmlFor="accommodation_type_id">
          <select
            id="accommodation_type_id"
            name="accommodation_type_id"
            defaultValue={a?.accommodation_type_id ?? ""}
            className={filterInputClass}
          >
            <option value="">– keiner –</option>
            {accommodationTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </FormField>
      </FormSection>

      <FormSection title="Standort">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Region" htmlFor="region_id">
            <select
              id="region_id"
              name="region_id"
              defaultValue={a?.region_id ?? ""}
              className={filterInputClass}
            >
              <option value="">– keine –</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.country_name} – {r.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Ort" htmlFor="city">
            <input id="city" name="city" defaultValue={a?.city ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="PLZ" htmlFor="postal_code">
            <input
              id="postal_code"
              name="postal_code"
              defaultValue={a?.postal_code ?? ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Kapazität">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Max. Gäste" htmlFor="max_guests">
            <input
              type="number"
              id="max_guests"
              name="max_guests"
              min={0}
              defaultValue={a?.max_guests ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Max. Erwachsene" htmlFor="max_adults">
            <input
              type="number"
              id="max_adults"
              name="max_adults"
              min={0}
              defaultValue={a?.max_adults ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Max. Kinder" htmlFor="max_children">
            <input
              type="number"
              id="max_children"
              name="max_children"
              min={0}
              defaultValue={a?.max_children ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Schlafzimmer" htmlFor="bedrooms">
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              min={0}
              defaultValue={a?.bedrooms ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Badezimmer" htmlFor="bathrooms">
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              min={0}
              defaultValue={a?.bathrooms ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Betten" htmlFor="beds">
            <input
              type="number"
              id="beds"
              name="beds"
              min={0}
              defaultValue={a?.beds ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Wohnfläche (m²)" htmlFor="living_area">
            <input
              type="number"
              id="living_area"
              name="living_area"
              step="0.1"
              min={0}
              defaultValue={a?.living_area ?? ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Ausstattung">
        <CheckboxGroup name="amenity_ids" options={amenities} selectedIds={a?.amenity_ids ?? []} />
      </FormSection>

      <FormSection title="Preis">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Preis ab" htmlFor="price_from">
            <input
              type="number"
              id="price_from"
              name="price_from"
              step="0.01"
              min={0}
              defaultValue={a?.price_from ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Preistyp" htmlFor="price_type">
            <select
              id="price_type"
              name="price_type"
              defaultValue={a?.price_type ?? ""}
              className={filterInputClass}
            >
              <option value="">– keiner –</option>
              <option value="per_night">pro Nacht</option>
              <option value="total">Gesamtpreis</option>
            </select>
          </FormField>
          <FormField label="Währung" htmlFor="currency">
            <input
              id="currency"
              name="currency"
              defaultValue={a?.currency ?? "EUR"}
              className={filterInputClass}
            />
          </FormField>
          <FormField
            label="Beispiel-Familiengröße"
            htmlFor="example_family_size"
            hint="z. B. „2 Erwachsene, 3 Kinder“"
          >
            <input
              id="example_family_size"
              name="example_family_size"
              defaultValue={a?.example_family_size ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Beispiel-Gesamtpreis" htmlFor="example_total_price">
            <input
              type="number"
              id="example_total_price"
              name="example_total_price"
              step="0.01"
              min={0}
              defaultValue={a?.example_total_price ?? ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Anbieter & Links">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Anbieter" htmlFor="provider_id">
            <select
              id="provider_id"
              name="provider_id"
              defaultValue={a?.provider_id ?? ""}
              className={filterInputClass}
            >
              <option value="">– keiner –</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Affiliate-Link" htmlFor="affiliate_url">
            <input
              id="affiliate_url"
              name="affiliate_url"
              type="url"
              defaultValue={a?.affiliate_url ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Externer Link" htmlFor="external_url">
            <input
              id="external_url"
              name="external_url"
              type="url"
              defaultValue={a?.external_url ?? ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Titelbild">
        <MediaPicker
          currentImageUrl={resolveMediaUrl(a?.cover_media ?? null)}
          currentAltText={a?.cover_media?.alt_text}
        />
      </FormSection>

      <FormSection title="Altersgruppen & Tags">
        <FormField label="Altersgruppen" htmlFor="age_group_ids">
          <CheckboxGroup name="age_group_ids" options={ageGroups} selectedIds={a?.age_group_ids ?? []} />
        </FormField>
        <FormField label="Tags" htmlFor="tag_ids">
          <CheckboxGroup name="tag_ids" options={tags} selectedIds={a?.tag_ids ?? []} />
        </FormField>
      </FormSection>

      <FormSection title="Status & Sichtbarkeit">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Status" htmlFor="status">
            <StatusSelect defaultValue={a?.status ?? "draft"} />
          </FormField>
          <FormField
            label="Großfamilien-Score (0–100)"
            htmlFor="family_rating"
            hint="Redaktionelle Einschätzung der Eignung für große Familien"
          >
            <input
              type="number"
              id="family_rating"
              name="family_rating"
              min={0}
              max={100}
              defaultValue={a?.family_rating ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Läuft ab am" htmlFor="expires_at">
            <input
              type="date"
              id="expires_at"
              name="expires_at"
              defaultValue={a?.expires_at ? a.expires_at.slice(0, 10) : ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="featured" defaultChecked={a?.featured ?? false} className="size-4" />
          Hervorgehoben (Featured)
        </label>
      </FormSection>

      <button
        type="submit"
        className="self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Speichern
      </button>
    </form>
  );
}
