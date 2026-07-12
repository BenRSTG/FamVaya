import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold text-foreground">Impressum</h1>
      <p className="mb-8 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
        Diese Seite ist ein strukturierter Platzhalter und wurde nicht
        anwaltlich geprüft. Vor einem echten Launch muss sie durch
        rechtsverbindliche Angaben ersetzt werden.
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
        <p className="text-muted-foreground">
          [Firmenname / Name der verantwortlichen Person]
          <br />
          [Straße und Hausnummer]
          <br />
          [Postleitzahl und Ort]
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Kontakt</h2>
        <p className="text-muted-foreground">
          Telefon: [Telefonnummer]
          <br />
          E-Mail: [E-Mail-Adresse]
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
        </h2>
        <p className="text-muted-foreground">[Name, Anschrift wie oben]</p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-foreground">Haftungshinweis</h2>
        <p className="text-muted-foreground">
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
          Haftung für die Inhalte externer Links. Für den Inhalt der
          verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </section>
    </div>
  );
}
