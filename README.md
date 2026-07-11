# FamVaya

Inspirations- und Empfehlungsplattform für Familienreisen mit dem Fokus
„Large Families First" — Familien mit drei oder mehr Kindern. Die vollständige
Produktspezifikation liegt unter [`files/spec.md`](files/spec.md).

**Aktueller Stand: Phase 0–2 von [`FamVaya_Bauplan_2.md`](FamVaya_Bauplan_2.md) abgeschlossen.**
Alle drei Hauptbereiche (Familienunterkünfte, Familienaktivitäten,
Mikro-Familienabenteuer) sind mit echten Supabase-Daten durchsuchbar,
filterbar und verlinkbar; die Startseite lädt kuratierte Inhalte und bietet
einen Schnellen Familien-Check. Noch **nicht** enthalten: Auth, Nutzerkonten,
globale Suche, Inspirationsfinder, Admin-Bereich, Magazin — siehe
`FamVaya_Bauplan_2.md` für die vollständige Phasenübersicht. Getroffene
technische Entscheidungen sind fortlaufend in [`DECISIONS.md`](DECISIONS.md)
dokumentiert.

## Stack

Next.js 16 (App Router) · TypeScript · React 19 · Tailwind CSS v4 · shadcn/ui
(Base UI) · Supabase (Postgres, Auth, Storage) · Vitest · Lucide Icons.

## Funktionsumfang (Phase 0–2)

- **Startseite** (`/`): Hero, Schneller Familien-Check (verlinkt mit
  vorbefüllten Filtern auf die passende Übersichtsseite), drei Welt-Karten,
  „Empfohlene Inhalte" (echte Supabase-Queries, `featured`-Flag), FamVaya-Versprechen.
- **Familienunterkünfte** (`/familienunterkuenfte`): Übersicht mit Filtern
  (Personen, Kinder, Schlafzimmer, Preis, Typ), Detailseite mit
  FamVaya-Familiencheck (Großfamilien-Score + Kinder-Eignungscheckliste).
- **Familienaktivitäten** (`/familienaktivitaeten`): Übersicht mit Filtern
  (Kategorie, Indoor/Outdoor, Gesamtpreis, Großfamilienrabatt), Detailseite
  mit Familiencheck.
- **Mikro-Familienabenteuer** (`/mikro-familienabenteuer`): Übersicht mit
  Filtern (Kategorie, Budget, Vorbereitung, Indoor/Outdoor), Detailseite mit
  Materialliste und Ablauf.
- **Affiliate-Redirect** (`/go/[contentType]/[contentId]`): protokolliert
  jeden Klick in `outbound_clicks` und leitet dann zum Anbieter weiter
  (Fallback auf Detail-/Übersichtsseite, falls kein Link hinterlegt ist).
- Responsive Navigation mit mobilem Menü, sticky Header, minimaler Footer.

Bewusst noch nicht gebaut (siehe `DECISIONS.md` für die jeweilige Begründung):
Merken-/Login-/Such-Icons in der Navigation, Karten-Badges aus vollen
Ausstattungslisten, globale Suche, granularer Familiencheck aus Spec §10.3.

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
`SUPABASE_SERVICE_ROLE_KEY` (Letzterer wird von `lib/supabase/admin.ts` für
alle öffentlichen Content-Queries genutzt, siehe „Row Level Security" unten).

## Supabase einrichten

1. Ein neues Projekt auf [supabase.com](https://supabase.com) anlegen.
2. Unter **Project Settings → API** die Werte für `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` und `SUPABASE_SERVICE_ROLE_KEY` in
   `.env.local` eintragen.
3. Im **SQL Editor** des Supabase-Dashboards nacheinander alle Dateien aus
   `supabase/migrations/` ausführen — **in numerischer Reihenfolge**
   (`0001_...` bis `0010_...`), da spätere Migrationen auf Tabellen aus
   früheren verweisen.
4. Danach `supabase/seed.sql` ausführen, um die Demo-Inhalte einzuspielen.

> ✅ Migrationen und Seed wurden gegen ein echtes Supabase-Projekt ausgeführt
> und liefen fehlerfrei durch. End-to-end verifiziert: `anon`-Key liefert
> (RLS ohne Policies) leere Ergebnislisten, `service_role`-Key liest alle
> Demo-Inhalte korrekt; `/go/`-Route wurde live getestet (Redirect **und**
> korrekt geloggte Zeile in `outbound_clicks`).

### Warum keine Supabase-CLI / kein Docker?

`supabase start` benötigt einen lokalen Docker-Postgres-Stack. Docker Desktop
zu installieren würde eine privilegierte macOS-Systemerweiterung erfordern —
das fällt unter systemweite Änderungen, die in dieser Entwicklungsumgebung
bewusst vermieden werden. Die `.sql`-Dateien funktionieren ohne zusätzliche
Tools und lassen sich jederzeit später in die Supabase-CLI-Struktur
übernehmen (sie liegen bereits im CLI-Standardpfad `supabase/migrations/`).

## Row Level Security

Alle Tabellen haben RLS **aktiviert**, aber weiterhin **keine Policies**
(kommt laut `FamVaya_Bauplan_2.md` erst in Phase 4 zusammen mit Auth). Der
`anon`-Key liefert deshalb für jede Tabelle eine leere Ergebnisliste. Alle
öffentlichen Lesezugriffe (Startseite, Übersichts-/Detailseiten, Filter,
`/go/`-Klick-Logging) laufen serverseitig über `lib/supabase/admin.ts`
(`service_role`-Key, verlässt den Server nie — abgesichert mit
`import "server-only"`). `lib/supabase/server.ts` (anon-Key + Cookies) bleibt
für die künftige Auth-Phase vorbereitet, wird aktuell aber nirgends
importiert. Details in [`DECISIONS.md`](DECISIONS.md).

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
Preisformatierung (`lib/format.test.ts`), Großfamilien-Eignung
(`lib/family-rating.test.ts`), Kinder-Eignungscheck
(`lib/family-check.test.ts`). Keine Component-/E2E-Tests bisher — kommt mit
Spec §34 ("einige End-to-End-Tests für Kernflüsse") in einer späteren Phase.

## Deployment

Noch nicht eingerichtet. Zielplattform laut Spec §4 ist Vercel.

## Admin-Nutzer, Medien-Storage, E-Mail-Dienst, Kartenanbieter

Noch nicht Teil von Phase 0–2 — es gibt weder Admin-Bereich noch Auth-Flow.
Die zugehörigen Umgebungsvariablen sind in `.env.example` bereits als
„Phase 2+" (inzwischen genauer: Phase 4/5) vorbereitet.

## Projektstruktur

```
app/
  page.tsx                          Startseite
  familienunterkuenfte/             Übersicht (mit Filtern) + [slug]-Detailseite
  familienaktivitaeten/             Übersicht (mit Filtern) + [slug]-Detailseite
  mikro-familienabenteuer/          Übersicht (mit Filtern) + [slug]-Detailseite
  go/[contentType]/[contentId]/     Affiliate-Redirect-Route (Klick-Logging)
  not-found.tsx                     404-Seite
components/
  layout/                           SiteHeader, SiteFooter, MobileNav (shadcn sheet)
  cards/                            AccommodationCard, ActivityCard, MicroAdventureCard
  ui/                                shadcn/ui-Komponenten
  *-filter-form.tsx                 Such-/Filterformulare je Bereich (plain <form method="get">)
  quick-family-check.tsx            Schneller Familien-Check (Client Component)
  family-check-section.tsx          FamVaya-Familiencheck auf Detailseiten
  placeholder-image.tsx             Fallback für fehlende Bilder
lib/
  supabase/                         admin.ts (service_role, Content-Queries) + client.ts/server.ts (Auth-Fundament)
  data/                             Datenzugriffs-Schicht je Content-Typ + shared.ts (geteilte Helper)
  format.ts, family-rating.ts,
  family-check.ts                   Getestete Business-Logik (siehe lib/*.test.ts)
  search-params.ts                  Geteilte searchParams-Parsing-Helfer
  types.ts                          Handgeschriebene DB-Typen
public/brand/                       FamVaya-Logo (SVG, Originalfarben)
supabase/migrations/                SQL-Migrationen (0001-0010, in Reihenfolge ausführen)
supabase/seed.sql                   Demo-Seed-Daten
files/                              Produktspezifikation (spec.md) und Phase-0-Kickoff-Prompt
FamVaya_Bauplan_2.md                Verbindliche Phasen-Roadmap (Phase 0-6)
DECISIONS.md                        Dokumentierte technische Entscheidungen
```
