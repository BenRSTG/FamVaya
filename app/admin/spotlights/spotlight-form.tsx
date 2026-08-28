import { filterInputClass } from "@/components/filter-field";
import { FormField, FormSection } from "@/components/admin/form-field";
import { MediaPicker } from "@/components/admin/media-picker";
import { getPublishedTitlesForContentType } from "@/lib/data/spotlights";
import type { HomepageSpotlight } from "@/lib/types";
import type { ContentType } from "@/lib/types";

const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  accommodation: "Unterkünfte",
  activity: "Aktivitäten",
  micro_adventure: "Mikro-Abenteuer",
};

export async function SpotlightForm({
  spotlight,
  action,
}: {
  spotlight: HomepageSpotlight | null;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const s = spotlight;
  const [accommodations, activities, microAdventures] = await Promise.all([
    getPublishedTitlesForContentType("accommodation"),
    getPublishedTitlesForContentType("activity"),
    getPublishedTitlesForContentType("micro_adventure"),
  ]);
  const groups: [ContentType, { id: string; title: string }[]][] = [
    ["accommodation", accommodations],
    ["activity", activities],
    ["micro_adventure", microAdventures],
  ];
  const currentInternalTarget =
    s?.link_type === "internal" && s.content_type && s.content_id
      ? `${s.content_type}:${s.content_id}`
      : "";

  return (
    <form action={action} className="flex flex-col gap-6">
      {s && <input type="hidden" name="id" value={s.id} />}

      <FormSection title="Inhalt">
        <FormField label="Titel" htmlFor="title">
          <input id="title" name="title" required defaultValue={s?.title ?? ""} className={filterInputClass} />
        </FormField>
        <FormField label="Text" htmlFor="body_text" hint="Kurzer Beschreibungstext, 1-3 Sätze.">
          <textarea
            id="body_text"
            name="body_text"
            required
            rows={3}
            defaultValue={s?.body_text ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <MediaPicker
          currentImageUrl={s?.image?.storage_path}
          currentAltText={s?.image?.alt_text}
          name="image"
          altName="image_alt"
          label="Bild"
        />
        {!s && (
          <p className="text-xs text-muted-foreground">
            Ein Bild ist Pflicht — Spotlights sind visuell, kein reiner Textblock.
          </p>
        )}
      </FormSection>

      <FormSection title="Verlinkung">
        <FormField
          label="Ziel im System"
          htmlFor="internal_target"
          hint="Wähle entweder ein Ziel im System ODER trage unten eine externe URL ein — nicht beides."
        >
          <select
            id="internal_target"
            name="internal_target"
            defaultValue={currentInternalTarget}
            className={filterInputClass}
          >
            <option value="">– kein internes Ziel –</option>
            {groups.map(([type, items]) => (
              <optgroup key={type} label={CONTENT_TYPE_LABEL[type]}>
                {items.map((item) => (
                  <option key={item.id} value={`${type}:${item.id}`}>
                    {item.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </FormField>
        <FormField label="Externe URL" htmlFor="external_url">
          <input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={s?.link_type === "external" ? s.external_url ?? "" : ""}
            placeholder="https://..."
            className={filterInputClass}
          />
        </FormField>
      </FormSection>

      <FormSection title="Steuerung">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="is_active" defaultChecked={s?.is_active ?? false} className="size-4" />
          Aktiv (wird auf der Startseite angezeigt)
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="is_sponsored"
            defaultChecked={s?.is_sponsored ?? false}
            className="size-4"
          />
          Bezahlte Partnerschaft
        </label>
        <p className="text-xs text-muted-foreground">
          Bei bezahlten Partnerschaften aktivieren — erzeugt automatisch die Pflichtkennzeichnung
          „Anzeige" auf der Fläche, die sich nicht separat ausblenden lässt.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Aktiv ab (optional)" htmlFor="starts_at">
            <input
              type="date"
              id="starts_at"
              name="starts_at"
              defaultValue={s?.starts_at ? s.starts_at.slice(0, 10) : ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Aktiv bis (optional)" htmlFor="ends_at">
            <input
              type="date"
              id="ends_at"
              name="ends_at"
              defaultValue={s?.ends_at ? s.ends_at.slice(0, 10) : ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
        <FormField
          label="Reihenfolge"
          htmlFor="sort_order"
          hint="Bei mehreren gleichzeitig aktiven Spotlights wird nur der mit der niedrigsten Zahl angezeigt."
        >
          <input
            type="number"
            id="sort_order"
            name="sort_order"
            defaultValue={s?.sort_order ?? 0}
            className={filterInputClass}
          />
        </FormField>
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
