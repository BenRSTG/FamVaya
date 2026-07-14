import { filterInputClass } from "@/components/filter-field";
import { FormField, FormSection } from "@/components/admin/form-field";
import { StatusSelect } from "@/components/admin/status-select";
import { CheckboxGroup } from "@/components/admin/checkbox-group";
import { MediaPicker } from "@/components/admin/media-picker";
import type { ActivityFormData } from "@/lib/data/activities";
import type { AgeGroup, Category, Provider, RegionWithCountry, Tag, ActivityFeature } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";

export function ActivityForm({
  activity,
  categories,
  providers,
  regions,
  features,
  ageGroups,
  tags,
  action,
}: {
  activity: ActivityFormData | null;
  categories: Category[];
  providers: Provider[];
  regions: RegionWithCountry[];
  features: ActivityFeature[];
  ageGroups: AgeGroup[];
  tags: Tag[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const a = activity;

  return (
    <form action={action} className="flex flex-col gap-6">
      {a && <input type="hidden" name="id" value={a.id} />}

      <FormSection title="Basisdaten">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Titel" htmlFor="title">
            <input id="title" name="title" required defaultValue={a?.title ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="Slug" htmlFor="slug">
            <input id="slug" name="slug" required defaultValue={a?.slug ?? ""} className={filterInputClass} />
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
        <FormField label="Kategorie" htmlFor="category_id">
          <select id="category_id" name="category_id" defaultValue={a?.category_id ?? ""} className={filterInputClass}>
            <option value="">– keine –</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </FormSection>

      <FormSection title="Standort">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Region" htmlFor="region_id">
            <select id="region_id" name="region_id" defaultValue={a?.region_id ?? ""} className={filterInputClass}>
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
        </div>
      </FormSection>

      <FormSection title="Dauer & Rahmenbedingungen">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Dauer min. (Minuten)" htmlFor="duration_min">
            <input
              type="number"
              id="duration_min"
              name="duration_min"
              min={0}
              defaultValue={a?.duration_min ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Dauer max. (Minuten)" htmlFor="duration_max">
            <input
              type="number"
              id="duration_max"
              name="duration_max"
              min={0}
              defaultValue={a?.duration_max ?? ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="indoor" defaultChecked={a?.indoor ?? false} className="size-4" />
            Indoor
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="outdoor" defaultChecked={a?.outdoor ?? false} className="size-4" />
            Outdoor
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="weather_suitable"
              defaultChecked={a?.weather_suitable ?? true}
              className="size-4"
            />
            Bei jedem Wetter geeignet
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="booking_required"
              defaultChecked={a?.booking_required ?? false}
              className="size-4"
            />
            Buchung erforderlich
          </label>
        </div>
      </FormSection>

      <FormSection title="Merkmale">
        <CheckboxGroup name="feature_ids" options={features} selectedIds={a?.feature_ids ?? []} />
      </FormSection>

      <FormSection title="Preis">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Erwachsenenpreis" htmlFor="adult_price">
            <input
              type="number"
              id="adult_price"
              name="adult_price"
              step="0.01"
              min={0}
              defaultValue={a?.adult_price ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Kinderpreis" htmlFor="child_price">
            <input
              type="number"
              id="child_price"
              name="child_price"
              step="0.01"
              min={0}
              defaultValue={a?.child_price ?? ""}
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
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="family_ticket"
              defaultChecked={a?.family_ticket ?? false}
              className="size-4"
            />
            Familienticket verfügbar
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="large_family_discount"
              defaultChecked={a?.large_family_discount ?? false}
              className="size-4"
            />
            Rabatt für Großfamilien
          </label>
        </div>
      </FormSection>

      <FormSection title="Anbieter & Links">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Anbieter" htmlFor="provider_id">
            <select id="provider_id" name="provider_id" defaultValue={a?.provider_id ?? ""} className={filterInputClass}>
              <option value="">– keiner –</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Affiliate-Link" htmlFor="affiliate_url">
            <input id="affiliate_url" name="affiliate_url" type="url" defaultValue={a?.affiliate_url ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="Externer Link" htmlFor="external_url">
            <input id="external_url" name="external_url" type="url" defaultValue={a?.external_url ?? ""} className={filterInputClass} />
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

      <FormSection title="Reality Check">
        <FormField
          label="Das spricht dafür"
          htmlFor="pros"
          hint="kommagetrennt, z. B. „Kinderwagenfreundlich, Familienrabatt“"
        >
          <textarea
            id="pros"
            name="pros"
            rows={2}
            defaultValue={a?.pros.join(", ") ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField
          label="Das solltet ihr wissen"
          htmlFor="cons"
          hint="kommagetrennt, z. B. „Lange Wartezeiten am Wochenende“"
        >
          <textarea
            id="cons"
            name="cons"
            rows={2}
            defaultValue={a?.cons.join(", ") ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
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
