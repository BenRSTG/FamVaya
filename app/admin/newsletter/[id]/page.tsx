import { notFound } from "next/navigation";
import { getCampaignById, renderCampaignHtml } from "@/lib/data/newsletter-campaigns";
import { isResendConfigured } from "@/lib/newsletter/resend";
import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { updateCampaignAction, sendCampaignAction } from "@/app/admin/newsletter/actions";

const CONTENT_TYPE_LABEL = {
  accommodation: "Unterkunft",
  activity: "Aktivität",
  micro_adventure: "Mikro-Abenteuer",
  article: "Magazin",
} as const;

export default async function NewsletterCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();

  const configured = isResendConfigured();
  const previewHtml = renderCampaignHtml(campaign);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Newsletter-Kampagne
          {campaign.content_type && ` — ${CONTENT_TYPE_LABEL[campaign.content_type]}`}
        </h1>
        {campaign.status === "sent" && (
          <p className="mt-1 text-sm text-success">
            Versendet am {campaign.sent_at ? new Date(campaign.sent_at).toLocaleString("de-DE") : "–"} an{" "}
            {campaign.recipient_count ?? 0} Abonnent:innen.
          </p>
        )}
        {campaign.status === "failed" && campaign.error_message && (
          <p className="mt-1 text-sm text-destructive">Fehlgeschlagen: {campaign.error_message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Vorschau</p>
          <iframe
            srcDoc={previewHtml}
            title="E-Mail-Vorschau"
            className="h-[520px] w-full rounded-2xl border border-border bg-white"
          />
        </div>

        <div className="flex flex-col gap-6">
          <form action={updateCampaignAction} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={campaign.id} />
            <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
              Betreff
              <input type="text" name="subject" defaultValue={campaign.subject} required className={filterInputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
              Text
              <textarea
                name="introText"
                defaultValue={campaign.intro_text}
                rows={8}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <Button type="submit" variant="outline" size="sm" className="w-fit">
              Änderungen speichern
            </Button>
          </form>

          <form action={sendCampaignAction}>
            <input type="hidden" name="id" value={campaign.id} />
            {configured ? (
              <Button type="submit" size="lg" disabled={campaign.status === "sent"}>
                {campaign.status === "sent" ? "Bereits versendet" : "Jetzt an alle Abonnent:innen senden"}
              </Button>
            ) : (
              <Button size="lg" disabled title="Newsletter-Versand noch nicht eingerichtet">
                Jetzt an alle Abonnent:innen senden
              </Button>
            )}
          </form>
          {!configured && (
            <p className="text-xs text-muted-foreground">
              Newsletter-Versand noch nicht eingerichtet — siehe README.md,
              Abschnitt „Newsletter-Versand aktivieren".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
