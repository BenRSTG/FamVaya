import Link from "next/link";
import { requireAdminOrEditor } from "@/lib/auth";
import { getSpotlightsForAdmin } from "@/lib/data/spotlights";
import { toggleSpotlightAction } from "@/app/admin/spotlights/actions";

export default async function SpotlightsPage() {
  await requireAdminOrEditor("/admin/spotlights");
  const spotlights = await getSpotlightsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Spotlights</h1>
        <Link
          href="/admin/spotlights/neu"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Neuer Spotlight
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        Nur der oberste aktive Spotlight erscheint auf der Startseite (nach der "Drei Welten"-Sektion).
      </p>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Titel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Anzeige</th>
              <th className="px-4 py-3">Zeitraum</th>
              <th className="px-4 py-3">Reihenfolge</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {spotlights.map((spotlight) => (
              <tr key={spotlight.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/admin/spotlights/${spotlight.id}`} className="hover:underline">
                    {spotlight.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      spotlight.is_active
                        ? "inline-flex rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success"
                        : "inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {spotlight.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {spotlight.is_sponsored ? "Anzeige" : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {spotlight.starts_at ? new Date(spotlight.starts_at).toLocaleDateString("de-DE") : "–"}
                  {" – "}
                  {spotlight.ends_at ? new Date(spotlight.ends_at).toLocaleDateString("de-DE") : "offen"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{spotlight.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <form action={toggleSpotlightAction}>
                    <input type="hidden" name="id" value={spotlight.id} />
                    <input type="hidden" name="active" value={(!spotlight.is_active).toString()} />
                    <button
                      type="submit"
                      className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:opacity-90"
                    >
                      {spotlight.is_active ? "Deaktivieren" : "Aktivieren"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {spotlights.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Noch keine Spotlights angelegt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
