import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { MicroAdventureCard } from "@/components/cards/micro-adventure-card";
import { requireUser } from "@/lib/auth";
import { getOrCreateDefaultCollection, getUserFavorites } from "@/lib/data/favorites";
import { toggleListSharing } from "@/app/merkliste/actions";

export const metadata: Metadata = {
  title: "Meine Merkliste",
};

export default async function FavoritesPage() {
  const user = await requireUser("/merkliste");
  const [favorites, collection] = await Promise.all([
    getUserFavorites(user.id),
    getOrCreateDefaultCollection(user.id),
  ]);

  const totalCount =
    favorites.accommodations.length +
    favorites.activities.length +
    favorites.microAdventures.length;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shareUrl = collection.is_public
    ? `${siteUrl}/merkliste/geteilt/${collection.share_token}`
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-foreground">
          Meine Merkliste
        </h1>
        <form action={toggleListSharing}>
          <Button type="submit" variant="outline" size="sm">
            {collection.is_public ? "Freigabe beenden" : "Liste teilen"}
          </Button>
        </form>
      </div>

      {shareUrl && (
        <p className="mb-8 rounded-lg bg-accent/40 px-3 py-2 text-sm text-foreground">
          Öffentlicher Link:{" "}
          <a href={shareUrl} className="underline">
            {shareUrl}
          </a>
        </p>
      )}

      {totalCount === 0 ? (
        <p className="text-muted-foreground">
          Noch nichts gemerkt. Öffne eine Unterkunft, Aktivität oder ein
          Mikro-Abenteuer und klicke dort auf „Merken".
        </p>
      ) : (
        <>
          {favorites.accommodations.length > 0 && (
            <FavoritesSection title="Familienunterkünfte">
              {favorites.accommodations.map((a) => (
                <AccommodationCard key={a.id} accommodation={a} />
              ))}
            </FavoritesSection>
          )}
          {favorites.activities.length > 0 && (
            <FavoritesSection title="Familienaktivitäten">
              {favorites.activities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </FavoritesSection>
          )}
          {favorites.microAdventures.length > 0 && (
            <FavoritesSection title="Mikro-Familienabenteuer">
              {favorites.microAdventures.map((a) => (
                <MicroAdventureCard key={a.id} adventure={a} />
              ))}
            </FavoritesSection>
          )}
        </>
      )}
    </div>
  );
}

function FavoritesSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
