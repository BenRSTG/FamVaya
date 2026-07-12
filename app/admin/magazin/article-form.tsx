import { filterInputClass } from "@/components/filter-field";
import { FormField, FormSection } from "@/components/admin/form-field";
import { StatusSelect } from "@/components/admin/status-select";
import { MediaPicker } from "@/components/admin/media-picker";
import type { Article, Category } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";

export function ArticleForm({
  article,
  categories,
  action,
}: {
  article: Article | null;
  categories: Category[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const a = article;

  return (
    <form action={action} className="flex flex-col gap-6">
      {a && <input type="hidden" name="id" value={a.id} />}
      {a && <input type="hidden" name="author_id" value={a.author_id ?? ""} />}
      {a && <input type="hidden" name="existing_cover_media_id" value={a.cover_media_id ?? ""} />}

      <FormSection title="Basisdaten">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Titel" htmlFor="title">
            <input id="title" name="title" required defaultValue={a?.title ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="Slug" htmlFor="slug">
            <input id="slug" name="slug" required defaultValue={a?.slug ?? ""} className={filterInputClass} />
          </FormField>
        </div>
        <FormField label="Einleitung" htmlFor="excerpt">
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={a?.excerpt ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <FormField label="Inhalt" htmlFor="content">
          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={a?.content ?? ""}
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

      <FormSection title="Titelbild">
        <MediaPicker
          currentImageUrl={resolveMediaUrl(a?.cover_media ?? null)}
          currentAltText={a?.cover_media?.alt_text}
        />
      </FormSection>

      <FormSection title="Status & Veröffentlichung">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Status" htmlFor="status">
            <StatusSelect defaultValue={a?.status ?? "draft"} />
          </FormField>
          <FormField label="Veröffentlicht am" htmlFor="published_at">
            <input
              type="date"
              id="published_at"
              name="published_at"
              defaultValue={a?.published_at ? a.published_at.slice(0, 10) : ""}
              className={filterInputClass}
            />
          </FormField>
        </div>
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
