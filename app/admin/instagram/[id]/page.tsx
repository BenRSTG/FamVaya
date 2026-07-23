import { notFound } from "next/navigation";
import Image from "next/image";
import { getInstagramPostById } from "@/lib/data/instagram";
import { isInstagramConfigured } from "@/lib/instagram/graph-api";
import { Button } from "@/components/ui/button";
import { updateCaptionAction, publishAction } from "@/app/admin/instagram/actions";

const CONTENT_TYPE_LABEL = {
  accommodation: "Unterkunft",
  activity: "Aktivität",
  micro_adventure: "Mikro-Abenteuer",
  article: "Magazin",
} as const;

export default async function InstagramPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getInstagramPostById(id);
  if (!post) notFound();

  const configured = isInstagramConfigured();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Instagram-Post — {CONTENT_TYPE_LABEL[post.content_type]}
        </h1>
        {post.status === "published" && (
          <p className="mt-1 text-sm text-success">
            Veröffentlicht am {post.published_at ? new Date(post.published_at).toLocaleString("de-DE") : "–"}
          </p>
        )}
        {post.status === "failed" && post.error_message && (
          <p className="mt-1 text-sm text-destructive">Fehlgeschlagen: {post.error_message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
            {post.media?.storage_path && (
              <Image src={post.media.storage_path} alt="" fill sizes="480px" className="object-cover" />
            )}
          </div>
          {post.media?.storage_path && (
            <a
              href={post.media.storage_path}
              download
              className="text-sm font-medium text-primary hover:underline"
            >
              Bild herunterladen
            </a>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <form action={updateCaptionAction} className="flex flex-col gap-2">
            <input type="hidden" name="id" value={post.id} />
            <label htmlFor="caption" className="text-sm font-medium text-foreground">
              Bildtext
            </label>
            <textarea
              id="caption"
              name="caption"
              defaultValue={post.caption}
              rows={12}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            <Button type="submit" variant="outline" size="sm">
              Text speichern
            </Button>
          </form>

          <form action={publishAction}>
            <input type="hidden" name="id" value={post.id} />
            {configured ? (
              <Button type="submit" size="lg" disabled={post.status === "published"}>
                {post.status === "published" ? "Bereits veröffentlicht" : "Jetzt bei Instagram posten"}
              </Button>
            ) : (
              <Button size="lg" disabled title="Instagram-Zugang noch nicht eingerichtet">
                Jetzt bei Instagram posten
              </Button>
            )}
          </form>
          {!configured && (
            <p className="text-xs text-muted-foreground">
              Instagram-Zugang noch nicht eingerichtet — siehe README.md,
              Abschnitt „Instagram-Anbindung aktivieren".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
