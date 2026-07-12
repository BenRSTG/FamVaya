import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { MicroAdventureCard } from "@/components/cards/micro-adventure-card";
import {
  getCollectionByShareToken,
  getFavoritesForCollection,
} from "@/lib/data/favorites";

export const metadata: Metadata = {
  title: "Geteilte Merkliste",
};

// Öffentliche Seite ohne Auth — lädt bewusst über den service_role-Client
// mit exaktem Token-Match statt einer RLS-Ausnahme (siehe DECISIONS.md).
export default async function SharedFavoritesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const collection = await getCollectionByShareToken(token);
  if (!collection) notFound();

  const favorites = await getFavoritesForCollection(collection.id);
  const totalCount =
    favorites.accommodations.length +
    favorites.activities.length +
    favorites.microAdventures.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="mb-2 text-sm text-muted-foreground">
        Eine geteilte FamVaya-Merkliste
      </p>
      <h1 className="mb-8 text-3xl font-semibold text-foreground">
        {collection.name}
      </h1>

      {totalCount === 0 ? (
        <p className="text-muted-foreground">Diese Liste ist noch leer.</p>
      ) : (
        <>
          {favorites.accommodations.length > 0 && (
            <SharedSection title="Familienunterkünfte">
              {favorites.accommodations.map((a) => (
                <AccommodationCard key={a.id} accommodation={a} />
              ))}
            </SharedSection>
          )}
          {favorites.activities.length > 0 && (
            <SharedSection title="Familienaktivitäten">
              {favorites.activities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </SharedSection>
          )}
          {favorites.microAdventures.length > 0 && (
            <SharedSection title="Mikro-Familienabenteuer">
              {favorites.microAdventures.map((a) => (
                <MicroAdventureCard key={a.id} adventure={a} />
              ))}
            </SharedSection>
          )}
        </>
      )}
    </div>
  );
}

function SharedSection({
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
