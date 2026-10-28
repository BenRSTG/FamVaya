import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold text-foreground">Datenschutzerklärung</h1>
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">1. Verantwortliche Stelle</h2>
        <p className="text-muted-foreground">
          Benjamin Richtsteiger, Osterwiese 51, 38162 Cremlingen, E-Mail:{" "}
          <a href="mailto:b.richtsteigerrstg@gmail.com" className="text-primary hover:underline">
            b.richtsteigerrstg@gmail.com
          </a>
          . Weitere Angaben findet ihr im Impressum.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">2. Hosting, Server-Logdateien und Datenbank</h2>
        <p className="text-muted-foreground">
          FamVaya wird bei Vercel Inc. (USA) gehostet. Beim Aufruf der Seite
          verarbeitet der Server technisch notwendige Verbindungsdaten (u. a.
          IP-Adresse, Datum und Uhrzeit, aufgerufene Seite), um die Seite
          auszuliefern und sicher zu betreiben (Art. 6 Abs. 1 lit. f DSGVO).
          Inhalte und Nutzerkonten liegen in einer Datenbank von Supabase Inc.
          Soweit Daten in die USA übermittelt werden, geschieht das auf
          Grundlage geeigneter Garantien (EU-Standardvertragsklauseln bzw.
          EU-US Data Privacy Framework).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">3. Konto und Anmeldung</h2>
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
        <h2 className="mb-2 text-lg font-semibold text-foreground">4. Newsletter</h2>
        <p className="text-muted-foreground">
          Für die Newsletter-Anmeldung verarbeiten wir eure E-Mail-Adresse
          sowie optionale Angaben (Wohnort, Kinderanzahl) auf Grundlage eurer
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Wir nutzen das
          Double-Opt-in-Verfahren: Nach der Anmeldung erhaltet ihr eine
          E-Mail mit einem Bestätigungslink; erst nach dem Klick darauf
          bekommt ihr den Newsletter. Zum Nachweis speichern wir den
          Zeitpunkt der Anmeldung, des Mailversands und der Bestätigung.
          Der Versand erfolgt über den Dienst Resend (Resend, Inc., USA).
          Jede Newsletter-E-Mail enthält einen Abmelde-Link; eine Abmeldung
          ist jederzeit möglich.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">5. Cookies und Analyse</h2>
        <p className="text-muted-foreground">
          Wir setzen ein technisch notwendiges Cookie, um eure
          Cookie-Einwilligung zu speichern. Nach eurer Zustimmung nutzen wir
          Vercel Analytics zur anonymen, cookie-freien Reichweitenmessung —
          es werden keine personenbezogenen Profile gebildet. Eure
          Einwilligung könnt ihr jederzeit über „Cookie-Einstellungen“ im
          Footer widerrufen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          6. Eigene Nutzungsstatistiken (First-Party-Events)
        </h2>
        <p className="text-muted-foreground">
          Nach eurer Zustimmung zeichnen wir zusätzlich zu Vercel Analytics
          eigene, FamVaya-spezifische Nutzungsereignisse auf (z. B. Aufruf
          einer Angebotsseite, Nutzung des Family Matchers, Klick auf einen
          Anbieter-Button, Suchen ohne Treffer). Dabei wird eine zufällig
          erzeugte, pseudonyme Sitzungs-ID verwendet, die nur im
          Browser-Sitzungsspeicher (sessionStorage) liegt, nicht in einem
          Cookie, und sich nicht auf eine Person zurückführen lässt.
          Vollständige IP-Adressen und Browser-Kennungen speichern wir nicht
          dauerhaft; lediglich eine grobe Geräteart (mobil/Tablet/Desktop)
          und ein grobes Herkunftsland werden erfasst. Diese Rohdaten
          bewahren wir bis zu 24 Monate auf und nutzen sie ausschließlich,
          um zu verstehen, welche Inhalte gefragt sind und wo Angebote
          fehlen. Eure Einwilligung könnt ihr jederzeit über
          „Cookie-Einstellungen“ im Footer widerrufen — danach werden keine
          weiteren Ereignisse mehr erfasst.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          7. Englische Fassung (Google Übersetzer)
        </h2>
        <p className="text-muted-foreground">
          Die englische Fassung der Seite wird maschinell mit dem Website-Übersetzer
          von Google (Google LLC, USA) erstellt. Das Google-Skript wird
          <strong> erst geladen, wenn ihr auf die englische Flagge klickt</strong>
          ; dabei wird eure IP-Adresse an Google übertragen. Ohne Klick findet
          keine Verbindung zu Google statt. Rechtsgrundlage ist eure Einwilligung
          durch den Klick (Art. 6 Abs. 1 lit. a DSGVO).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          8. Externe Links und Affiliate-Links
        </h2>
        <p className="text-muted-foreground">
          Klickt ihr auf einen Anbieter-/Affiliate-Link, verlasst ihr
          FamVaya. Der Klick läuft über eine FamVaya-Weiterleitung, die
          lediglich zählt, dass und auf welches Angebot geklickt wurde (ohne
          IP-Adresse und ohne Personenbezug). Für die Datenverarbeitung auf den
          verlinkten Seiten gelten die Datenschutzbestimmungen der jeweiligen
          Anbieter. Bei Affiliate-Links erhalten wir möglicherweise eine
          Provision, für euch entstehen keine zusätzlichen Kosten.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-foreground">9. Eure Rechte</h2>
        <p className="text-muted-foreground">
          Ihr habt das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
          sowie das Recht, erteilte Einwilligungen jederzeit mit Wirkung für
          die Zukunft zu widerrufen. Wendet euch dazu an die oben genannte
          E-Mail-Adresse. Außerdem könnt ihr euch bei einer
          Datenschutzaufsichtsbehörde beschweren, in Niedersachsen bei der
          Landesbeauftragten für den Datenschutz Niedersachsen.
        </p>
      </section>
    </div>
  );
}
