import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import type { ContentStatus } from "@/lib/types";

export interface AdminListRow {
  id: string;
  title: string;
  status: ContentStatus;
  updated_at: string;
}

export function ContentTable({
  rows,
  editHref,
  instagramHref,
  duplicateAction,
  deleteAction,
}: {
  rows: AdminListRow[];
  editHref: (id: string) => string;
  instagramHref?: (id: string) => string;
  duplicateAction?: (formData: FormData) => void | Promise<void>;
  deleteAction?: (formData: FormData) => void | Promise<void>;
}) {
  if (rows.length === 0) {
    return <p className="text-muted-foreground">Noch keine Einträge.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Titel</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Zuletzt geändert</th>
            <th className="px-4 py-3 text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">
                <Link href={editHref(row.id)} className="hover:underline">
                  {row.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(row.updated_at).toLocaleDateString("de-DE")}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3 text-right">
                  <Link href={editHref(row.id)} className="text-primary hover:underline">
                    Bearbeiten
                  </Link>
                  {instagramHref && (
                    <Link href={instagramHref(row.id)} className="text-primary hover:underline">
                      Instagram-Post
                    </Link>
                  )}
                  {duplicateAction && (
                    <form action={duplicateAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="text-primary hover:underline">
                        Duplizieren
                      </button>
                    </form>
                  )}
                  {deleteAction && (
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="text-destructive hover:underline">
                        Löschen
                      </button>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
