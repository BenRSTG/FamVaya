import { redirect, notFound } from "next/navigation";
import { getAccommodationByIdForAdmin } from "@/lib/data/accommodations";
import { getActivityByIdForAdmin } from "@/lib/data/activities";
import { getMicroAdventureByIdForAdmin } from "@/lib/data/micro-adventures";
import { getArticleByIdForAdmin } from "@/lib/data/articles";
import { getInstagramPostForContent } from "@/lib/data/instagram";
import type { InstagramContentType } from "@/lib/instagram/types";
import { Button } from "@/components/ui/button";
import { generatePostAction } from "@/app/admin/instagram/actions";

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

export default async function NewInstagramPostPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string }>;
}) {
  const { type, id } = await searchParams;
  if (!type || !id || !CONTENT_TYPES.includes(type as InstagramContentType)) notFound();
  const contentType = type as InstagramContentType;

  const existing = await getInstagramPostForContent(contentType, id);
  if (existing) redirect(`/admin/instagram/${existing.id}`);

  const title = await loadTitle(contentType, id);
  if (!title) notFound();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-2xl font-semibold text-foreground">Instagram-Post erzeugen</h1>
      <p className="text-muted-foreground">
        Erzeugt ein 1080×1080-Bild und einen Vorschlagstext für „{title}".
        Beides kann danach vor dem Veröffentlichen noch angepasst werden.
      </p>
      <form action={generatePostAction}>
        <input type="hidden" name="contentType" value={contentType} />
        <input type="hidden" name="contentId" value={id} />
        <Button type="submit" size="lg">
          Post erzeugen
        </Button>
      </form>
    </div>
  );
}
