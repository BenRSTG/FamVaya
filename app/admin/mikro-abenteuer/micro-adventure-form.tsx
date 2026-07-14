import { filterInputClass } from "@/components/filter-field";
import { FormField, FormSection } from "@/components/admin/form-field";
import { StatusSelect } from "@/components/admin/status-select";
import { CheckboxGroup } from "@/components/admin/checkbox-group";
import { MediaPicker } from "@/components/admin/media-picker";
import type { MicroAdventureFormData } from "@/lib/data/micro-adventures";
import type { AgeGroup, Category, Tag } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";

export function MicroAdventureForm({
  microAdventure,
  categories,
  ageGroups,
  tags,
  action,
}: {
  microAdventure: MicroAdventureFormData | null;
  categories: Category[];
  ageGroups: AgeGroup[];
  tags: Tag[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const m = microAdventure;

  return (
    <form action={action} className="flex flex-col gap-6">
      {m && <input type="hidden" name="id" value={m.id} />}

      <FormSection title="Basisdaten">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Titel" htmlFor="title">
            <input id="title" name="title" required defaultValue={m?.title ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="Slug" htmlFor="slug">
            <input id="slug" name="slug" required defaultValue={m?.slug ?? ""} className={filterInputClass} />
          </FormField>
        </div>
        <FormField label="Kurzbeschreibung" htmlFor="short_description">
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            defaultValue={m?.short_description ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField label="Ausführliche Beschreibung" htmlFor="full_description">
          <textarea
            id="full_description"
            name="full_description"
            rows={4}
            defaultValue={m?.full_description ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField label="Kategorie" htmlFor="category_id">
          <select id="category_id" name="category_id" defaultValue={m?.category_id ?? ""} className={filterInputClass}>
            <option value="">– keine –</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </FormSection>

      <FormSection title="Rahmenbedingungen">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Dauer min. (Minuten)" htmlFor="duration_min">
            <input
              type="number"
              id="duration_min"
              name="duration_min"
              min={0}
              defaultValue={m?.duration_min ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Dauer max. (Minuten)" htmlFor="duration_max">
            <input
              type="number"
              id="duration_max"
              name="duration_max"
              min={0}
              defaultValue={m?.duration_max ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Kostenniveau" htmlFor="cost_level">
            <select id="cost_level" name="cost_level" defaultValue={m?.cost_level ?? ""} className={filterInputClass}>
              <option value="">– keins –</option>
              <option value="free">Kostenlos</option>
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </FormField>
          <FormField label="Geschätzte Gesamtkosten" htmlFor="estimated_total_cost">
            <input
              type="number"
              id="estimated_total_cost"
              name="estimated_total_cost"
              step="0.01"
              min={0}
              defaultValue={m?.estimated_total_cost ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Vorbereitungsaufwand" htmlFor="preparation_level">
            <select
              id="preparation_level"
              name="preparation_level"
              defaultValue={m?.preparation_level ?? ""}
              className={filterInputClass}
            >
              <option value="">– keiner –</option>
              <option value="none">Keiner</option>
              <option value="light">Leicht</option>
              <option value="moderate">Moderat</option>
            </select>
          </FormField>
          <FormField label="Schwierigkeit" htmlFor="difficulty_level">
            <select
              id="difficulty_level"
              name="difficulty_level"
              defaultValue={m?.difficulty_level ?? ""}
              className={filterInputClass}
            >
              <option value="">– keine –</option>
              <option value="easy">Leicht</option>
              <option value="medium">Mittel</option>
              <option value="hard">Schwer</option>
            </select>
          </FormField>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="indoor" defaultChecked={m?.indoor ?? false} className="size-4" />
            Indoor
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="outdoor" defaultChecked={m?.outdoor ?? false} className="size-4" />
            Outdoor
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="location_optional"
              defaultChecked={m?.location_optional ?? true}
              className="size-4"
            />
            Ohne festen Ort umsetzbar
          </label>
        </div>
      </FormSection>

      <FormSection title="Details">
        <FormField label="Materialliste" htmlFor="materials" hint="kommagetrennt, z. B. „Seil, Taschenlampe, Rucksack“">
          <input
            id="materials"
            name="materials"
            defaultValue={m?.materials.join(", ") ?? ""}
            className={filterInputClass}
          />
        </FormField>
        <FormField label="Saison-Tags" htmlFor="seasonal_tags" hint="kommagetrennt, z. B. „Sommer, Herbst“">
          <input
            id="seasonal_tags"
            name="seasonal_tags"
            defaultValue={m?.seasonal_tags.join(", ") ?? ""}
            className={filterInputClass}
          />
        </FormField>
        <FormField label="Wetter-Tags" htmlFor="weather_tags" hint="kommagetrennt, z. B. „sonnig, regenfest“">
          <input
            id="weather_tags"
            name="weather_tags"
            defaultValue={m?.weather_tags.join(", ") ?? ""}
            className={filterInputClass}
          />
        </FormField>
        <FormField label="Anleitung" htmlFor="instructions">
          <textarea
            id="instructions"
            name="instructions"
            rows={6}
            defaultValue={m?.instructions ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField label="Sicherheitshinweise" htmlFor="safety_notes">
          <textarea
            id="safety_notes"
            name="safety_notes"
            rows={3}
            defaultValue={m?.safety_notes ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
      </FormSection>

      <FormSection title="Reality Check">
        <FormField
          label="Das spricht dafür"
          htmlFor="pros"
          hint="kommagetrennt, z. B. „Kostenlos, in 10 Minuten startklar“"
        >
          <textarea
            id="pros"
            name="pros"
            rows={2}
            defaultValue={m?.pros.join(", ") ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField
          label="Das solltet ihr wissen"
          htmlFor="cons"
          hint="kommagetrennt, z. B. „Nur bei trockenem Wetter geeignet“"
        >
          <textarea
            id="cons"
            name="cons"
            rows={2}
            defaultValue={m?.cons.join(", ") ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
      </FormSection>

      <FormSection title="Links">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Affiliate-Link" htmlFor="affiliate_url">
            <input id="affiliate_url" name="affiliate_url" type="url" defaultValue={m?.affiliate_url ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="Externer Link" htmlFor="external_url">
            <input id="external_url" name="external_url" type="url" defaultValue={m?.external_url ?? ""} className={filterInputClass} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Titelbild">
        <MediaPicker
          currentImageUrl={resolveMediaUrl(m?.cover_media ?? null)}
          currentAltText={m?.cover_media?.alt_text}
        />
      </FormSection>

      <FormSection title="Altersgruppen & Tags">
        <FormField label="Altersgruppen" htmlFor="age_group_ids">
          <CheckboxGroup name="age_group_ids" options={ageGroups} selectedIds={m?.age_group_ids ?? []} />
        </FormField>
        <FormField label="Tags" htmlFor="tag_ids">
          <CheckboxGroup name="tag_ids" options={tags} selectedIds={m?.tag_ids ?? []} />
        </FormField>
      </FormSection>

      <FormSection title="Status & Sichtbarkeit">
        <FormField label="Status" htmlFor="status">
          <StatusSelect defaultValue={m?.status ?? "draft"} />
        </FormField>
        <FormField label="FamVaya Family Fit (0–100)" htmlFor="family_rating">
          <input
            type="number"
            id="family_rating"
            name="family_rating"
            min={0}
            max={100}
            defaultValue={m?.family_rating ?? ""}
            className={filterInputClass}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="featured" defaultChecked={m?.featured ?? false} className="size-4" />
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
