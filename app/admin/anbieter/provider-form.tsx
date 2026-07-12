import { filterInputClass } from "@/components/filter-field";
import { FormField, FormSection } from "@/components/admin/form-field";
import type { Provider } from "@/lib/types";

export function ProviderForm({
  provider,
  action,
}: {
  provider: Provider | null;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const p = provider;

  return (
    <form action={action} className="flex flex-col gap-6">
      {p && <input type="hidden" name="id" value={p.id} />}

      <FormSection title="Basisdaten">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name">
            <input id="name" name="name" required defaultValue={p?.name ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="Slug" htmlFor="slug">
            <input id="slug" name="slug" required defaultValue={p?.slug ?? ""} className={filterInputClass} />
          </FormField>
        </div>
        <FormField label="Beschreibung" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={p?.description ?? ""}
            className={filterInputClass + " h-auto py-2"}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Website" htmlFor="website">
            <input id="website" name="website" type="url" defaultValue={p?.website ?? ""} className={filterInputClass} />
          </FormField>
          <FormField label="Affiliate-Netzwerk" htmlFor="affiliate_network">
            <input
              id="affiliate_network"
              name="affiliate_network"
              defaultValue={p?.affiliate_network ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Kontakt-E-Mail" htmlFor="contact_email">
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={p?.contact_email ?? ""}
              className={filterInputClass}
            />
          </FormField>
          <FormField label="Status" htmlFor="status">
            <select id="status" name="status" defaultValue={p?.status ?? "active"} className={filterInputClass}>
              <option value="active">Aktiv</option>
              <option value="inactive">Inaktiv</option>
              <option value="pending">Ausstehend</option>
            </select>
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
