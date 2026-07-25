import { redirect } from "next/navigation";
import { getAccommodationByIdForAdmin } from "@/lib/data/accommodations";
import { getActivityByIdForAdmin } from "@/lib/data/activities";
import { getMicroAdventureByIdForAdmin } from "@/lib/data/micro-adventures";
import { getArticleByIdForAdmin } from "@/lib/data/articles";
import { getCampaignForContent } from "@/lib/data/newsletter-campaigns";
import type { InstagramContentType } from "@/lib/instagram/types";
import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { generateCampaignAction, createManualCampaignAction } from "@/app/admin/newsletter/actions";

const CONTENT_TYPES: InstagramContentType[] = ["accommodation", "activity", "micro_adventure", "article"];

async function loadTitle(contentType: InstagramContentType, contentId: string): Promise<string | null> {
  switch (contentType) {
    case "accommodation":
      return (await getAccommodationByIdForAdmin(contentId))?.title ?? null;
    case "activity":
      return (await getActivityByIdForAdmin(contentId))?.title ?? null;
    case "micro_adventure":
      return (await getMicroAdventureByIdForAdmin(contentId))?.title ?? null;
    case "article":
      return (await getArticleByIdForAdmin(contentId))?.title ?? null;
  }
}

export default async function NewNewsletterCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string }>;
}) {
  const { type, id } = await searchParams;

  if (type && id && CONTENT_TYPES.includes(type as InstagramContentType)) {
    const contentType = type as InstagramContentType;
    const existing = await getCampaignForContent(contentType, id);
    if (existing) redirect(`/admin/newsletter/${existing.id}`);

    const title = await loadTitle(contentType, id);
    if (!title) redirect("/admin/newsletter");

    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Newsletter-Kampagne erzeugen</h1>
        <p className="text-muted-foreground">
          Erzeugt einen E-Mail-Entwurf mit Bild, Titel und Preis für „{title}
          ". Betreff und Text lassen sich danach noch anpassen, bevor die
          Kampagne an alle Abonnent:innen verschickt wird.
        </p>
        <form action={generateCampaignAction}>
          <input type="hidden" name="contentType" value={contentType} />
          <input type="hidden" name="contentId" value={id} />
          <Button type="submit" size="lg">
            Kampagne erzeugen
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-2xl font-semibold text-foreground">Neue Newsletter-Kampagne</h1>
      <p className="text-muted-foreground">
        Freier Betreff und Text, ohne Bezug zu einem bestimmten Inserat.
      </p>
      <form action={createManualCampaignAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          Betreff
          <input type="text" name="subject" required className={filterInputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          Text
          <textarea
            name="introText"
            required
            rows={10}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <Button type="submit" size="lg">
          Entwurf anlegen
        </Button>
      </form>
    </div>
  );
}
