import Link from "next/link";
import { getDashboardStats, editHrefForRecentItem, type StatusCounts } from "@/lib/data/admin";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const kpis = [
    { label: "Klicks gesamt", value: stats.totalClicks },
    { label: "Newsletter-Anmeldungen", value: stats.newsletterSubscribers },
    { label: "Neue Nutzer (7 Tage)", value: stats.newUsersLast7Days },
    { label: "Abgelaufene Angebote", value: stats.expiredCount },
  ];

  const statusRows: { label: string; href: string; counts: StatusCounts }[] = [
    { label: "Familienunterkünfte", href: "/admin/unterkuenfte", counts: stats.accommodations },
    { label: "Familienaktivitäten", href: "/admin/aktivitaeten", counts: stats.activities },
    { label: "Mikro-Familienabenteuer", href: "/admin/mikro-abenteuer", counts: stats.microAdventures },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Überblick über Inhalte und Nutzung.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border p-4">
            <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Inhalte nach Status</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Typ</th>
                <th className="px-4 py-3">Entwurf</th>
                <th className="px-4 py-3">Zur Prüfung</th>
                <th className="px-4 py-3">Veröffentlicht</th>
                <th className="px-4 py-3">Pausiert</th>
                <th className="px-4 py-3">Archiviert</th>
              </tr>
            </thead>
            <tbody>
              {statusRows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href={row.href} className="hover:underline">
                      {row.label}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{row.counts.draft}</td>
                  <td className="px-4 py-3">{row.counts.in_review}</td>
                  <td className="px-4 py-3">{row.counts.published}</td>
                  <td className="px-4 py-3">{row.counts.paused}</td>
                  <td className="px-4 py-3">{row.counts.archived}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href="/admin/magazin" className="hover:underline">
                    Magazinartikel
                  </Link>
                </td>
                <td colSpan={5} className="px-4 py-3 text-muted-foreground">
                  {stats.articleCount} Artikel insgesamt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Zuletzt bearbeitet</h2>
        {stats.recentlyUpdated.length === 0 ? (
          <p className="text-muted-foreground">Noch keine Inhalte vorhanden.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Titel</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Zuletzt geändert</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentlyUpdated.map((item) => (
                  <tr key={`${item.contentType}-${item.id}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={editHrefForRecentItem(item)} className="hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(item.updated_at).toLocaleString("de-DE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
