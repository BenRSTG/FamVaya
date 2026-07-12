import Link from "next/link";
import { getAllProvidersForAdmin } from "@/lib/data/providers";

const PROVIDER_STATUS_LABEL: Record<string, string> = {
  active: "Aktiv",
  inactive: "Inaktiv",
  pending: "Ausstehend",
};

export default async function AdminProvidersPage() {
  const providers = await getAllProvidersForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Anbieter</h1>
        <Link
          href="/admin/anbieter/neu"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Neuer Anbieter
        </Link>
      </div>
      {providers.length === 0 ? (
        <p className="text-muted-foreground">Noch keine Anbieter vorhanden.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Affiliate-Netzwerk</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href={`/admin/anbieter/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {PROVIDER_STATUS_LABEL[p.status] ?? p.status}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.affiliate_network ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
