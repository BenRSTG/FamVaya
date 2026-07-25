import Link from "next/link";
import { getCampaignsForAdmin } from "@/lib/data/newsletter-campaigns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_LABEL = { draft: "Entwurf", sent: "Versendet", failed: "Fehlgeschlagen" } as const;
const STATUS_CLASS = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-success/15 text-success",
  failed: "bg-destructive/10 text-destructive",
} as const;

const CONTENT_TYPE_LABEL = {
  accommodation: "Unterkunft",
  activity: "Aktivität",
  micro_adventure: "Mikro-Abenteuer",
  article: "Magazin",
} as const;

export default async function NewsletterCampaignsPage() {
  const campaigns = await getCampaignsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Newsletter</h1>
          <p className="text-sm text-muted-foreground">
            Kampagnen erstellen und an alle bestätigten Newsletter-Abonnent:innen
            versenden. Versand erfordert einen eingerichteten Resend-Zugang
            (siehe README.md).
          </p>
        </div>
        <Button size="lg" render={<Link href="/admin/newsletter/neu" />} nativeButton={false}>
          Neue Kampagne
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-muted-foreground">
          Noch keine Kampagnen erstellt. Nutze „Neue Kampagne" oder den
          „Newsletter"-Link in einer der Content-Listen (Unterkünfte,
          Aktivitäten, Mikro-Abenteuer, Magazin).
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Betreff</th>
                <th className="px-4 py-3">Herkunft</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Empfänger:innen</th>
                <th className="px-4 py-3">Datum</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href={`/admin/newsletter/${campaign.id}`} className="hover:underline">
                      {campaign.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {campaign.content_type ? CONTENT_TYPE_LABEL[campaign.content_type] : "Frei erstellt"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLASS[campaign.status])}>
                      {STATUS_LABEL[campaign.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{campaign.recipient_count ?? "–"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(campaign.created_at).toLocaleString("de-DE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
