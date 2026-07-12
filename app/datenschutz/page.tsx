import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold text-foreground">Datenschutzerklärung</h1>
      <p className="mb-8 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
        Diese Seite ist ein strukturierter Platzhalter und wurde nicht
        anwaltlich geprüft. Vor einem echten Launch muss sie durch eine
        vollständige, rechtsverbindliche Datenschutzerklärung ersetzt werden.
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">1. Verantwortliche Stelle</h2>
        <p className="text-muted-foreground">
          [Firmenname / Name der verantwortlichen Person, Anschrift, Kontakt —
          siehe Impressum.]
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">2. Konto und Anmeldung</h2>
        <p className="text-muted-foreground">
          Bei der Registrierung verarbeiten wir eure E-Mail-Adresse und ein
          verschlüsseltes Passwort über unseren Hosting- und
          Datenbankanbieter Supabase. Optionale Angaben im Familienprofil
          (Anzahl Erwachsener/Kinder, grobe Altersgruppen, Wohnort, Budget)
          werden nur mit eurer Einwilligung gespeichert und dienen
          ausschließlich der besseren Trefferauswahl.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">3. Newsletter</h2>
        <p className="text-muted-foreground">
          Für die Newsletter-Anmeldung verarbeiten wir eure E-Mail-Adresse
          sowie optionale Angaben (Wohnort, Kinderanzahl). Eine Abmeldung ist
          jederzeit möglich.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">4. Cookies und Analyse</h2>
        <p className="text-muted-foreground">
          Wir setzen ein technisch notwendiges Cookie, um eure
          Cookie-Einwilligung zu speichern. Nach eurer Zustimmung nutzen wir
          Vercel Analytics zur anonymen, cookie-freien Reichweitenmessung —
          es werden keine personenbezogenen Profile gebildet. Eure
          Einwilligung könnt ihr jederzeit über „Cookie-Einstellungen" im
          Footer widerrufen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">5. Externe Links</h2>
        <p className="text-muted-foreground">
          Klickt ihr auf einen Anbieter-/Affiliate-Link, verlasst ihr
          FamVaya. Für die Datenverarbeitung auf den verlinkten Seiten gelten
          die Datenschutzbestimmungen der jeweiligen Anbieter.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-foreground">6. Eure Rechte</h2>
        <p className="text-muted-foreground">
          Ihr habt das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung eurer Daten. Wendet euch dazu an die
          im Impressum genannte Kontaktadresse.
        </p>
      </section>
    </div>
  );
}
