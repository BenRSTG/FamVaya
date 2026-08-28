import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kooperationen",
  description:
    "Werdet Partner von FamVaya und erreicht Familien mit drei oder mehr Kindern — als vorgestellter Anbieter oder mit einem Spotlight auf der Startseite.",
};

const COOPERATION_EMAIL = "kooperationen@famvaya.com";

const FORMATS = [
  "Anbieter-Vorstellung mit Logo, Bildergalerie und Kurztext auf euren verknüpften Angeboten",
  "Spotlight-Fläche auf der Startseite, zeitlich befristet oder dauerhaft",
  "Individuelle Absprachen, z. B. rund um neue Angebote oder saisonale Aktionen",
];

export default function CooperationsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold text-foreground">Kooperationen</h1>
      <p className="mb-8 text-muted-foreground">
        FamVaya richtet sich gezielt an Familien mit drei oder mehr Kindern — eine
        Zielgruppe, die bei den meisten Plattformen zu kurz kommt. Wenn ihr Unterkünfte,
        Aktivitäten oder Angebote für Großfamilien anbietet, sprecht uns gerne an.
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-foreground">Mögliche Formate</h2>
        <ul className="flex flex-col gap-2">
          {FORMATS.map((format) => (
            <li key={format} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {format}
            </li>
          ))}
        </ul>
      </section>

      <Button size="lg" render={<Link href={`mailto:${COOPERATION_EMAIL}`} />} nativeButton={false}>
        <Mail aria-hidden />
        Kontakt aufnehmen
      </Button>
      <p className="mt-2 text-sm text-muted-foreground">{COOPERATION_EMAIL}</p>
    </div>
  );
}
