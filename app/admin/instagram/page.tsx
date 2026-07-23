import Link from "next/link";
import Image from "next/image";
import { getInstagramPostsForAdmin } from "@/lib/data/instagram";
import { cn } from "@/lib/utils";

const STATUS_LABEL = { draft: "Entwurf", published: "Veröffentlicht", failed: "Fehlgeschlagen" } as const;
const STATUS_CLASS = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-success/15 text-success",
  failed: "bg-destructive/10 text-destructive",
} as const;

const CONTENT_TYPE_LABEL = {
  accommodation: "Unterkunft",
  activity: "Aktivität",
  micro_adventure: "Mikro-Abenteuer",
  article: "Magazin",
} as const;

export default async function InstagramPostsPage() {
  const posts = await getInstagramPostsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Instagram-Posts</h1>
        <p className="text-sm text-muted-foreground">
          Aus Inseraten erzeugte Bild+Text-Vorlagen. Direktes Veröffentlichen
          erfordert einen eingerichteten Instagram-Zugang (siehe README.md).
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">
          Noch keine Instagram-Posts erzeugt. Nutze den „Instagram-Post"-Link
          in einer der Content-Listen (Unterkünfte, Aktivitäten,
          Mikro-Abenteuer, Magazin).
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/instagram/${post.id}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 w-full shrink-0 bg-muted">
                {post.media?.storage_path && (
                  <Image
                    src={post.media.storage_path}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {CONTENT_TYPE_LABEL[post.content_type]}
                  </span>
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLASS[post.status])}>
                    {STATUS_LABEL[post.status]}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-foreground">{post.caption}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleString("de-DE")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
