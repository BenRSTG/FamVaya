import type { Metadata } from "next";
import { InspirationFinder } from "@/components/inspiration-finder";
import { getAllTags } from "@/lib/data/shared";

export const metadata: Metadata = {
  title: "Lass dich inspirieren",
  description:
    "Beantwortet ein paar Fragen und erhaltet passende Unterkünfte, Aktivitäten und Mikro-Abenteuer für eure Familie.",
};

export default async function InspirationFinderPage() {
  const tags = await getAllTags();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">
          Lass dich inspirieren
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ein paar kurze Fragen — dann zeigen wir euch passende Ideen aus
          allen drei FamVaya-Bereichen.
        </p>
      </div>

      <InspirationFinder tags={tags} />
    </div>
  );
}
