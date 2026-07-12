# FamVaya

Inspirations- und Empfehlungsplattform für Familienreisen mit dem Fokus
„Large Families First" — Familien mit drei oder mehr Kindern. Die vollständige
Produktspezifikation liegt unter [`files/spec.md`](files/spec.md).

**Aktueller Stand: Phase 0–4 von [`FamVaya_Bauplan_2.md`](FamVaya_Bauplan_2.md) abgeschlossen.**
Alle drei Hauptbereiche sind durchsuchbar, filterbar und verlinkbar; dazu
gibt es echte Supabase-Auth (E-Mail/Passwort + Magic Link), ein
Familienprofil, eine Merkliste mit Freigabe-Link und eine Newsletter-
Anmeldung. Noch **nicht** enthalten: Admin-Bereich, Magazin — siehe
`FamVaya_Bauplan_2.md` für die vollständige Phasenübersicht. Getroffene
technische Entscheidungen sind fortlaufend in [`DECISIONS.md`](DECISIONS.md)
dokumentiert.

## Stack

Next.js 16 (App Router) · TypeScript · React 19 · Tailwind CSS v4 · shadcn/ui
(Base UI) · Supabase (Postgres, Auth, Storage, `pg_trgm` Volltextsuche) ·
Vitest · Lucide Icons.

## Funktionsumfang (Phase 0–4)

- **Startseite** (`/`): Hero, Schneller Familien-Check, drei Welt-Karten,
  „Empfohlene Inhalte", FamVaya-Versprechen, Newsletter-Anmeldung.
- **Familienunterkünfte / -aktivitäten / Mikro-Familienabenteuer**: Übersicht
  mit bereichsspezifischen Filtern, Detailseite mit FamVaya-Familiencheck
  (bei Unterkünften/Aktivitäten) und Merken-Button.
- **Globale Suche** (`/suche`): Postgres-Volltextsuche + Trigram-
  Tippfehlertoleranz über alle drei Bereiche.
- **„Lass dich inspirieren"-Finder** (`/lass-dich-inspirieren`): mehrstufiger,
  regelbasierter Wizard mit begründeten Vorschlägen.
- **Affiliate-Redirect** (`/go/[contentType]/[contentId]`): Klick-Logging +
  Weiterleitung zum Anbieter.
- **Auth** (`/anmelden`, `/registrieren`, `/auth/callback`): E-Mail/Passwort
  und Magic Link über Supabase Auth. Kein Google-OAuth (fehlende externe
  Credentials, siehe `DECISIONS.md`).
- **Mein Konto** (`/konto`, geschützt): Familienprofil (Erwachsene/Kinder,
  Altersgruppen, Wohnort, Budget, Interessen, Haustier, Barrierefreiheit —
  bewusst ohne vollständige Geburtsdaten der Kinder, Spec §15.1), Abmelden.
- **Merkliste** (`/merkliste`, geschützt): Merken/Entfernen auf allen drei
  Detailseiten, eine automatische Standardliste pro Nutzer:in, Freigabe-Link
  (`/merkliste/geteilt/[token]`, öffentlich, ohne Login einsehbar).
- **Newsletter**: vereinfachtes Single-Opt-in (kein Resend-Key hinterlegt,
  siehe `DECISIONS.md`).
- Responsive Navigation mit Such-, Merkliste- und Konto-Link, mobilem Menü,
  sticky Header, minimaler Footer.

Bewusst noch nicht gebaut (siehe `DECISIONS.md` für die jeweilige Begründung):
Merken-Buttons auf Card-Listen (nur auf Detailseiten), mehrere benannte
Merklisten pro Nutzer:in, Double-Opt-in-Newsletter, Google-OAuth, granularer
Familiencheck aus Spec §10.3, Magazin-Suche (vorbereitet, aber ohne Inhalte).

## Voraussetzungen

- **Node.js 24.x** (getestet mit v24.18.0, siehe `.nvmrc`). Falls kein
  Node.js/npm installiert ist und keine global installierte Node-Version
  genutzt werden soll: siehe unten „Node.js ohne Homebrew/sudo installieren".
- Ein Supabase-Projekt (kostenlose Stufe reicht für die lokale Entwicklung).
  Es wird **keine** lokale Supabase-CLI/Docker-Installation benötigt — die
  Migrationen sind reine `.sql`-Dateien, die im Supabase-Dashboard ausgeführt
  werden (siehe unten „Supabase einrichten").

### Node.js ohne Homebrew/sudo installieren

Falls auf dem Rechner kein Node.js zur Verfügung steht und keine
systemweite Installation (Homebrew, offizieller Installer) gewünscht ist,
kann Node.js rein lokal installiert werden:

```bash
# Architektur prüfen (arm64 oder x64)
uname -m

# Aktuelles LTS-Tarball laden (Beispiel für arm64/v24.18.0, Version ggf. anpassen)
curl -fSL -o node.tar.gz https://nodejs.org/dist/v24.18.0/node-v24.18.0-darwin-arm64.tar.gz
curl -fSL -o SHASUMS256.txt https://nodejs.org/dist/v24.18.0/SHASUMS256.txt
grep "node-v24.18.0-darwin-arm64.tar.gz" SHASUMS256.txt | shasum -a 256 -c -

mkdir -p ~/.local
tar -xzf node.tar.gz -C ~/.local/

# Für die aktuelle Shell-Session verfügbar machen
export PATH="$HOME/.local/node-v24.18.0-darwin-arm64/bin:$PATH"
node -v && npm -v
```

Das ändert **keine** systemweiten Einstellungen oder Shell-Profile. Für jede
neue Terminal-Session muss der `export PATH=...`-Befehl wiederholt werden
(oder dauerhaft in `~/.zshrc` ergänzt werden, falls gewünscht — das ist eine
bewusste Entscheidung, siehe [`DECISIONS.md`](DECISIONS.md)).

## Installation

```bash
npm install
```

## Umgebungsvariablen

```bash
cp .env.example .env.local
```

Siehe [`.env.example`](.env.example) für alle Variablen. Benötigt für
`npm run dev`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`.

## Supabase einrichten

1. Ein neues Projekt auf [supabase.com](https://supabase.com) anlegen.
2. Unter **Project Settings → API** die Werte für `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` in
   `.env.local` eintragen.
3. Im **SQL Editor** des Supabase-Dashboards nacheinander alle Dateien aus
   `supabase/migrations/` ausführen — **in numerischer Reihenfolge**
   (`0001_...` bis `0013_...`), da spätere Migrationen auf Tabellen/Funktionen
   aus früheren verweisen.
4. Danach `supabase/seed.sql` ausführen, um die Demo-Inhalte einzuspielen.
5. Unter **Authentication → URL Configuration**: Site URL auf
   `http://localhost:3000` setzen, `http://localhost:3000/auth/callback` zu
   den Redirect URLs hinzufügen — sonst laufen Magic-Link- und
   Bestätigungs-Links ins Leere.

> ✅ Migrationen und Seed wurden gegen ein echtes Supabase-Projekt ausgeführt
> und liefen fehlerfrei durch. End-to-end verifiziert: RLS-Policies (Auth,
> Familienprofil, Merkliste), `/go/`-Klick-Logging, `search_all_content()`
> inkl. Tippfehlertoleranz.

### Warum keine Supabase-CLI / kein Docker?

`supabase start` benötigt einen lokalen Docker-Postgres-Stack. Docker Desktop
zu installieren würde eine privilegierte macOS-Systemerweiterung erfordern —
das fällt unter systemweite Änderungen, die in dieser Entwicklungsumgebung
bewusst vermieden werden. Die `.sql`-Dateien funktionieren ohne zusätzliche
Tools und lassen sich jederzeit später in die Supabase-CLI-Struktur
übernehmen (sie liegen bereits im CLI-Standardpfad `supabase/migrations/`).

## Row Level Security

Zwei unterschiedliche Zugriffswege, je nach Tabelle:

- **Content-Tabellen** (`accommodations`, `activities`, `micro_adventures`,
  Referenztabellen, `outbound_clicks`, `search_events` …): RLS aktiviert,
  weiterhin **keine Policies** (Phase-0-Entscheidung). Zugriff ausschließlich
  serverseitig über `lib/supabase/admin.ts` (`service_role`-Key, verlässt den
  Server nie — abgesichert mit `import "server-only"`).
- **Nutzerbezogene Tabellen** (`users`, `family_profiles`, `favorites`,
  `favorite_collections`, `newsletter_subscribers`): seit Phase 4 echte
  RLS-Policies, scoped auf `auth.uid()`. Diese laufen über
  `lib/supabase/server.ts` (anon-Key + Cookies, session-gebunden) — der
  Nutzer greift als er/sie selbst zu, nicht als `service_role`.
  Freigegebene Merklisten sind die eine bewusste Ausnahme: die öffentliche
  Freigabe-Seite liest gezielt per Token über `service_role`, statt einer
  RLS-Policy, die Enumeration aller öffentlichen Listen ermöglichen würde
  (Details in `DECISIONS.md`).

## Lokale Entwicklung

```bash
npm run dev
```

Öffnet auf [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Tests

```bash
npm run test
```

Vitest mit Unit-Tests für die zentrale Business-Logik aus Spec §34:
Preisformatierung, Großfamilien-Eignung, Kinder-Eignungscheck,
Finder-Begründungstexte (`lib/*.test.ts`). Keine Component-/E2E-Tests bisher
— kommt mit Spec §34 in einer späteren Phase.

## Deployment

Noch nicht eingerichtet. Zielplattform laut Spec §4 ist Vercel.

## Admin-Bereich, Medien-Storage, E-Mail-Dienst (Resend), Kartenanbieter

Noch nicht Teil von Phase 0–4. Die zugehörigen Umgebungsvariablen sind in
`.env.example` bereits vorbereitet — `RESEND_API_KEY` würde zusätzlich das
Newsletter-Double-Opt-in ermöglichen (siehe `DECISIONS.md`).

## Projektstruktur

```
app/
  page.tsx                          Startseite (inkl. Newsletter-Formular)
  familienunterkuenfte/             Übersicht (mit Filtern) + [slug]-Detailseite
  familienaktivitaeten/             Übersicht (mit Filtern) + [slug]-Detailseite
  mikro-familienabenteuer/          Übersicht (mit Filtern) + [slug]-Detailseite
  suche/                            Globale Suche (Volltext + Trigram)
  lass-dich-inspirieren/            Finder-Wizard + Server Action (actions.ts)
  go/[contentType]/[contentId]/     Affiliate-Redirect-Route (Klick-Logging)
  anmelden/, registrieren/          Auth-Seiten
  auth/callback/                    Magic-Link-/Bestätigungs-Callback
  auth/actions.ts                   Auth-Server-Actions (Sign-in/up/out)
  konto/                            Familienprofil (geschützt) + Server Action
  merkliste/                        Merkliste (geschützt) + Freigabe-Seite (öffentlich)
  not-found.tsx                     404-Seite
components/
  layout/                           SiteHeader (Suche/Merkliste/Konto-Links), SiteFooter, MobileNav
  cards/                            AccommodationCard, ActivityCard, MicroAdventureCard
  ui/                                shadcn/ui-Komponenten
  *-filter-form.tsx                 Such-/Filterformulare je Bereich (plain <form method="get">)
  quick-family-check.tsx            Schneller Familien-Check (Client Component)
  inspiration-finder.tsx            „Lass dich inspirieren"-Wizard (Client Component)
  favorite-button.tsx               Merken-Button (Client Component)
  family-check-section.tsx          FamVaya-Familiencheck auf Detailseiten
  search-result-item.tsx            Schlanke Suchergebnis-Darstellung
  placeholder-image.tsx             Fallback für fehlende Bilder
lib/
  supabase/                         admin.ts (service_role, Content/Suche) + client.ts/server.ts (Auth, session-gebunden)
  data/                             Datenzugriffs-Schicht je Content-Typ + search.ts + favorites.ts + shared.ts
  actions/                          Geteilte Server Actions (favorites.ts, newsletter.ts)
  format.ts, family-rating.ts,
  family-check.ts, finder-reasons.ts Getestete Business-Logik (siehe lib/*.test.ts)
  auth.ts                           requireUser()/getOptionalUser()-Helper
  content-type.ts                   Geteilte Content-Type-Konstanten (Tabellen-/Pfad-Mapping)
  search-params.ts                  Geteilte searchParams-Parsing-Helfer
  types.ts                          Handgeschriebene DB-Typen
proxy.ts                            Session-Refresh (Next.js 16 "Proxy", vormals Middleware)
public/brand/                       FamVaya-Logo (SVG, Originalfarben)
supabase/migrations/                SQL-Migrationen (0001-0013, in Reihenfolge ausführen)
supabase/seed.sql                   Demo-Seed-Daten
files/                              Produktspezifikation (spec.md) und Phase-0-Kickoff-Prompt
FamVaya_Bauplan_2.md                Verbindliche Phasen-Roadmap (Phase 0-6)
DECISIONS.md                        Dokumentierte technische Entscheidungen
```
