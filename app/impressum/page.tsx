import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold text-foreground">Impressum</h1>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Angaben gemäß § 5 DDG</h2>
        <p className="text-muted-foreground">
          Benjamin Richtsteiger
          <br />
          Osterwiese 51
          <br />
          38162 Cremlingen
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Kontakt</h2>
        <p className="text-muted-foreground">
          E-Mail:{" "}
          <a href="mailto:b.richtsteigerrstg@gmail.com" className="text-primary hover:underline">
            b.richtsteigerrstg@gmail.com
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p className="text-muted-foreground">
          Benjamin Richtsteiger, Anschrift wie oben
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Hinweis zu Affiliate-Links</h2>
        <p className="text-muted-foreground">
          Einige Links auf FamVaya sind Affiliate-Links. Wenn ihr über einen
          solchen Link bucht oder kauft, erhalten wir möglicherweise eine
          Provision. Für euch entstehen dadurch keine zusätzlichen Kosten.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Verbraucherstreitbeilegung</h2>
        <p className="text-muted-foreground">
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
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
