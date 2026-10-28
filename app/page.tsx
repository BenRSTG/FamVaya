import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CheckCircle2, Compass, FerrisWheel, Home as HomeIcon, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickFamilyCheck } from "@/components/quick-family-check";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { MicroAdventureCard } from "@/components/cards/micro-adventure-card";
import { ArticleCard } from "@/components/cards/article-card";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { HomepageSpotlight } from "@/components/homepage-spotlight";
import { getFeaturedAccommodations } from "@/lib/data/accommodations";
import { getFeaturedActivities } from "@/lib/data/activities";
import { getFeaturedMicroAdventures } from "@/lib/data/micro-adventures";
import { getFeaturedArticles } from "@/lib/data/articles";
import { getActiveHomepageSpotlight } from "@/lib/data/spotlights";
import { cn } from "@/lib/utils";
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

  const [accommodations, activities, microAdventures, articles, spotlight] = await Promise.all([
    getFeaturedAccommodations(3),
    getFeaturedActivities(3),
    getFeaturedMicroAdventures(3),
    getFeaturedArticles(3),
    getActiveHomepageSpotlight(),
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
        <QuickFamilyCheck />

        <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 px-6 py-5 text-center backdrop-blur-sm">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-white/20">
            <Compass className="size-5 text-white" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-white drop-shadow-sm">
            Noch unentschlossen?
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-white/90 drop-shadow-sm">
            Unser Inspirations-Finder schlägt euch in ein paar kurzen Fragen
            passende Ideen vor — auch ganz ohne feste Kriterien.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-4 border-white/70 bg-white/10 text-white hover:border-primary hover:bg-primary hover:text-primary-foreground"
            render={<Link href="/lass-dich-inspirieren" />}
            nativeButton={false}
          >
            Lass dich inspirieren
          </Button>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-foreground">
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

      {spotlight && <HomepageSpotlight spotlight={spotlight} />}

      {/* Empfohlene Inhalte: jeder Bereich als eigener, eingerahmter Block */}
      {accommodations.length > 0 && (
        <AreaSection
          id="empfohlene-inhalte"
          tone="accommodations"
          icon={HomeIcon}
          area="Familienunterkünfte"
          title="Besonders geeignet für 3+ Kinder"
          href="/familienunterkuenfte"
          linkLabel="Alle Unterkünfte ansehen"
        >
          {accommodations.map((a) => (
            <AccommodationCard key={a.id} accommodation={a} />
          ))}
        </AreaSection>
      )}

      {activities.length > 0 && (
        <AreaSection
          tone="activities"
          icon={FerrisWheel}
          area="Familienaktivitäten"
          title="Beliebte Familienaktivitäten"
          href="/familienaktivitaeten"
          linkLabel="Alle Aktivitäten ansehen"
        >
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </AreaSection>
      )}

      {microAdventures.length > 0 && (
        <AreaSection
          tone="micro"
          icon={TreePine}
          area="Mikro-Familienabenteuer"
          title="Kleine Abenteuer für den Familienalltag"
          href="/mikro-familienabenteuer"
          linkLabel="Alle Abenteuer ansehen"
        >
          {microAdventures.map((a) => (
            <MicroAdventureCard key={a.id} adventure={a} />
          ))}
        </AreaSection>
      )}

      {articles.length > 0 && (
        <AreaSection
          tone="magazine"
          icon={BookOpen}
          area="Magazin"
          title="Aus dem Magazin"
          href="/magazin"
          linkLabel="Alle Artikel lesen"
        >
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </AreaSection>
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
        <NewsletterSignupForm status={newsletterStatus as "pending" | "duplicate" | "unavailable" | "error" | undefined} />
      </section>
    </div>
  );
}

const AREA_TONES = {
  accommodations: {
    panel: "bg-gradient-to-b from-background via-primary/10 to-background",
    chip: "bg-primary/15 text-primary",
    area: "text-primary",
    title: "text-foreground",
    link: "text-primary",
  },
  activities: {
    panel: "bg-gradient-to-b from-background via-accent/40 to-background",
    chip: "bg-accent text-accent-foreground",
    area: "text-brand-petrol-dark/70",
    title: "text-foreground",
    link: "text-brand-petrol-dark",
  },
  micro: {
    panel: "bg-gradient-to-b from-background via-success/10 to-background",
    chip: "bg-success/20 text-success",
    area: "text-success",
    title: "text-foreground",
    link: "text-success",
  },
  magazine: {
    panel: "bg-brand-petrol-dark",
    chip: "bg-white/15 text-white",
    area: "text-brand-sand",
    title: "text-white",
    link: "text-white",
  },
} as const;

function AreaSection({
  id,
  tone,
  icon: Icon,
  area,
  title,
  href,
  linkLabel,
  children,
}: {
  id?: string;
  tone: keyof typeof AREA_TONES;
  icon: React.ComponentType<{ className?: string }>;
  area: string;
  title: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  const t = AREA_TONES[tone];
  return (
    <section id={id} className={cn("w-full scroll-mt-20", t.panel)}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex items-center gap-4">
            <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", t.chip)}>
              <Icon className="size-6" aria-hidden />
            </div>
            <div>
              <p className={cn("text-xs font-semibold uppercase tracking-wider", t.area)}>{area}</p>
              <h2 className={cn("text-xl font-semibold sm:text-2xl", t.title)}>{title}</h2>
            </div>
          </div>
          <Link
            href={href}
            className={cn("group flex items-center gap-1.5 text-sm font-medium hover:underline", t.link)}
          >
            {linkLabel}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      </div>
    </section>
  );
}
