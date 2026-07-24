import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, FerrisWheel, Home as HomeIcon, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickFamilyCheck } from "@/components/quick-family-check";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { MicroAdventureCard } from "@/components/cards/micro-adventure-card";
import { ArticleCard } from "@/components/cards/article-card";
import { filterInputClass } from "@/components/filter-field";
import { getFeaturedAccommodations } from "@/lib/data/accommodations";
import { getFeaturedActivities } from "@/lib/data/activities";
import { getFeaturedMicroAdventures } from "@/lib/data/micro-adventures";
import { getFeaturedArticles } from "@/lib/data/articles";
import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { toStringParam, type SearchParams } from "@/lib/search-params";

const WORLDS = [
  {
    href: "/familienunterkuenfte",
    icon: HomeIcon,
    title: "Familienunterkünfte",
    description: "Für Urlaub, Ferien und längere Auszeiten.",
  },
  {
    href: "/familienaktivitaeten",
    icon: FerrisWheel,
    title: "Familienaktivitäten",
    description:
      "Für Wochenenden, Kurzurlaube und besondere gemeinsame Erlebnisse.",
  },
  {
    href: "/mikro-familienabenteuer",
    icon: TreePine,
    title: "Mikro-Familienabenteuer",
    description: "Für spontane Tagesausflüge und kleine Abenteuer im Familienalltag.",
  },
] as const;

const PROMISES = [
  "Geprüft auf echte Familientauglichkeit",
  "Gesamtpreise statt irreführender Einzelpreise",
  "Fokus auf drei oder mehr Kinder",
  "Ehrliche Hinweise zu Platz, Kosten und Ausstattung",
  "Transparente Weiterleitung zu externen Anbietern",
];

// Bewusst keine (erfundenen) Zahlen wie "160+ Reiseziele" — bei fast
// ausschließlich Demo-Inhalten und kaum echtem Traffic wäre das
// irreführend und würde dem "Ehrliche Hinweise"-Versprechen oben
// widersprechen. Stattdessen die echten Werte als kurze Highlights.
const HERO_HIGHLIGHTS = [
  "3+ Kinder im Fokus",
  "Geprüfte Familientauglichkeit",
  "Ehrliche Gesamtpreise",
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const newsletterStatus = toStringParam(params.newsletter);

  const [accommodations, activities, microAdventures, articles] = await Promise.all([
    getFeaturedAccommodations(3),
    getFeaturedActivities(3),
    getFeaturedMicroAdventures(3),
    getFeaturedArticles(3),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative isolate flex flex-col items-center gap-8 overflow-hidden px-6 py-20 text-center sm:py-28">
        <Image
          src="/images/hero-familie-berge.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-petrol-dark/75 via-brand-petrol-dark/45 to-background" />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Abenteuer für die ganze Familie.
            <br />
            Wirklich die ganze.
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/90 drop-shadow-sm sm:text-lg">
            Entdeckt besondere Unterkünfte, gemeinsame Aktivitäten und kleine
            Abenteuer – speziell ausgewählt für Familien mit drei oder mehr
            Kindern.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            render={<Link href="/familienunterkuenfte" />}
            nativeButton={false}
          >
            Jetzt entdecken
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/70 bg-white/10 text-white hover:bg-white/20"
            render={<Link href="/lass-dich-inspirieren" />}
            nativeButton={false}
          >
            Lass dich inspirieren
          </Button>
        </div>

        <QuickFamilyCheck />

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-white/90">
          {HERO_HIGHLIGHTS.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      {/* Drei Welten */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {WORLDS.map((world) => (
            <Link
              key={world.href}
              href={world.href}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <world.icon className="size-6" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {world.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {world.description}
                </p>
              </div>
              <span className="mt-auto text-sm font-medium text-primary group-hover:underline">
                Entdecken
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Empfohlene Inhalte */}
      {accommodations.length > 0 && (
        <RecommendedSection id="empfohlene-inhalte" title="Besonders geeignet für 3+ Kinder">
          {accommodations.map((a) => (
            <AccommodationCard key={a.id} accommodation={a} />
          ))}
        </RecommendedSection>
      )}

      {activities.length > 0 && (
        <RecommendedSection title="Beliebte Familienaktivitäten">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </RecommendedSection>
      )}

      {microAdventures.length > 0 && (
        <RecommendedSection title="Kleine Abenteuer für den Familienalltag">
          {microAdventures.map((a) => (
            <MicroAdventureCard key={a.id} adventure={a} />
          ))}
        </RecommendedSection>
      )}

      {articles.length > 0 && (
        <RecommendedSection title="Aus dem Magazin">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </RecommendedSection>
      )}

      {/* FamVaya-Versprechen */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
            Das FamVaya-Versprechen
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PROMISES.map((promise) => (
              <li
                key={promise}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden
                />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="scroll-mt-20 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            Neue Ideen direkt ins Postfach
          </h2>
          <p className="mb-6 text-muted-foreground">
            Neue Familienideen, passende Unterkünfte und besondere Abenteuer
            direkt ins Postfach.
          </p>

          {newsletterStatus === "success" && (
            <p className="mb-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              Danke für deine Anmeldung!
            </p>
          )}
          {newsletterStatus === "duplicate" && (
            <p className="mb-4 rounded-lg bg-accent/40 px-3 py-2 text-sm text-foreground">
              Diese E-Mail-Adresse ist schon angemeldet.
            </p>
          )}
          {newsletterStatus === "error" && (
            <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Da ist etwas schiefgelaufen — bitte versuch es noch einmal.
            </p>
          )}

          <form
            action={subscribeNewsletter}
            className="flex flex-wrap items-end justify-center gap-3"
          >
            <label className="flex w-56 flex-col gap-1 text-left text-sm">
              E-Mail
              <input
                type="email"
                name="email"
                required
                placeholder="deine@email.de"
                className={filterInputClass}
              />
            </label>
            <label className="flex w-36 flex-col gap-1 text-left text-sm">
              Wohnort (optional)
              <input type="text" name="city" className={filterInputClass} />
            </label>
            <label className="flex w-28 flex-col gap-1 text-left text-sm">
              Kinder (optional)
              <input
                type="number"
                name="children_count"
                min={0}
                className={filterInputClass}
              />
            </label>
            <Button type="submit">Anmelden</Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function RecommendedSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-8 sm:px-6">
      <h2 className="mb-5 text-xl font-semibold text-foreground">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
