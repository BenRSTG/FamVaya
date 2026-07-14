# FamVaya

Inspirations- und Empfehlungsplattform für Familienreisen mit dem Fokus
„Large Families First" — Familien mit drei oder mehr Kindern. Die vollständige
Produktspezifikation liegt unter [`files/spec.md`](files/spec.md).

**Aktueller Stand: Phase 0–6 von [`FamVaya_Bauplan_2.md`](FamVaya_Bauplan_2.md) abgeschlossen, plus Phase 7 (eigene Vision-Roadmap, siehe unten).**
Alle vier Hauptbereiche (Unterkünfte, Aktivitäten, Mikro-Abenteuer, Magazin)
sind durchsuchbar, filterbar, paginiert und verlinkt; dazu gibt es echte
Supabase-Auth (E-Mail/Passwort + Magic Link), ein Familienprofil, eine
Merkliste mit Freigabe-Link, eine Newsletter-Anmeldung, einen geschützten
Admin-Bereich mit CMS für alle Content-Typen (inkl. echtem Bild-Upload nach
Supabase Storage), SEO-Grundlagen (Sitemap, robots.txt, Schema.org,
Breadcrumbs), eine abstrahierte Analytics-Anbindung und DSGVO-Grundlagen
(Cookie-Consent, Rechts-Platzhalterseiten). **Phase 7** ergänzt einen
sichtbaren "FamVaya Family Fit"-Score auf Karten und Detailseiten, einen
Reality-Check-Block ("Das spricht dafür" / "Das solltet ihr wissen"),
echte Fotos statt Platzhaltern, sowie ein Zero-Result-Search-Logging mit
Admin-Auswertung (`/admin/such-insights`). Details zur Phasenroadmap in
`FamVaya_Bauplan_2.md`. Getroffene technische Entscheidungen sind
fortlaufend in [`DECISIONS.md`](DECISIONS.md) dokumentiert.
**Live: [https://famvaya.com](https://famvaya.com)** (Vercel + Supabase
Prod, siehe „Deployment" unten).

## Stack

Next.js 16 (App Router) · TypeScript · React 19 · Tailwind CSS v4 · shadcn/ui
(Base UI) · Supabase (Postgres, Auth, Storage, `pg_trgm` Volltextsuche) ·
Vitest · Lucide Icons · Vercel Analytics.

## Funktionsumfang (Phase 0–7)

- **Startseite** (`/`): Hero, Schneller Familien-Check, drei Welt-Karten,
  „Empfohlene Inhalte", FamVaya-Versprechen, Newsletter-Anmeldung.
- **Familienunterkünfte / -aktivitäten / Mikro-Familienabenteuer**: Übersicht
  mit bereichsspezifischen Filtern, Detailseite mit FamVaya-Familiencheck
  (auf allen drei Bereichen) und Merken-Button.
- **FamVaya Family Fit** (Phase 7): Score-Badge (0–100) auf jeder
  Angebotskarte aller drei Content-Typen sowie auf der Detailseite mit
  Erklärtext zu den Bewertungskriterien — weiterhin redaktionell/manuell
  gepflegt (`family_rating`), keine automatisierte Formel (siehe
  `DECISIONS.md`).
- **Reality Check** (Phase 7): zweispaltiger "Das spricht dafür" / "Das
  solltet ihr wissen"-Block auf allen drei Detailseiten-Typen, manuell im
  Admin gepflegt (`pros`/`cons`).
- **Zero-Result-Insights** (Phase 7): Suchen und Filter ohne Treffer werden
  in `search_events` protokolliert und unter `/admin/such-insights`
  ausgewertet (7-/30-Tage-Zähler + Liste der letzten ergebnislosen
  Suchen) — Grundlage dafür, welche Angebote als Nächstes beschafft werden
  sollten.
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
- **Admin-Bereich** (`/admin`, geschützt für Rollen `admin`/`editor`):
  Dashboard mit Status-/Nutzungs-Kennzahlen, vollständiges CRUD für
  Familienunterkünfte, -aktivitäten, Mikro-Familienabenteuer, Magazin-
  Artikel und Anbieter, echter Bild-Upload nach Supabase Storage
  (`content-media`-Bucket), Duplizieren, Vorschau unveröffentlichter Inhalte
  (`?preview=1` auf den öffentlichen Detailseiten), Nutzerverwaltung
  (Rollenänderung, nur `admin`), automatisches Ausblenden abgelaufener
  Angebote (`expires_at`) aus Listen und globaler Suche.
- **Magazin** (`/magazin`, `/magazin/[slug]`): Kategorie-Filter, Pagination,
  verwandte Artikel (gleiche Kategorie), "Das könnte euch auch
  interessieren"-Kachel, Teil der globalen Suche.
- **Pagination**: auf allen vier Übersichtsseiten (Unterkünfte, Aktivitäten,
  Mikro-Abenteuer, Magazin), rein serverseitig über `<Link>`s (kein
  Client-JS, crawlbar).
- **SEO**: `metadataBase`/Open-Graph/Twitter-Card auf allen Detailseiten,
  `/sitemap.xml`, `/robots.txt`, sichtbare Breadcrumbs + `BreadcrumbList`-
  JSON-LD, `LodgingBusiness`/`TouristAttraction`/`Article`/`Organization`/
  `WebSite`+`SearchAction`-Schema.org-Daten (keine erfundenen
  Bewertungen/Sterne).
- **Analytics** (`lib/analytics/`): abstrahierte `trackEvent()`-Funktion
  (Client- und Server-Wrapper), aktuell hinterlegt mit `@vercel/analytics`
  — Events für Suche, Merken, Weiterleitung, Newsletter, Finder-Abschluss,
  Kontoerstellung, Merkliste-Freigabe.
- **DSGVO**: Cookie-Consent-Banner (`famvaya-consent`-Cookie, gilt auch für
  das cookie-freie Analytics-Tool), `/impressum` und `/datenschutz` als
  ausdrücklich gekennzeichnete, nicht indexierte Platzhalterseiten.

Bewusst noch nicht gebaut (siehe `DECISIONS.md` für die jeweilige Begründung):
Merken-Buttons auf Card-Listen (nur auf Detailseiten), mehrere benannte
Merklisten pro Nutzer:in, Double-Opt-in-Newsletter, Google-OAuth, granularer
Familiencheck aus Spec §10.3, CRUD-UI für Referenzdaten (Kategorien/Regionen/
Tags/Ausstattung/Altersgruppen — bleiben seed-gepflegt), Bewertungsmoderation
(keine öffentliche Einreichung existiert), Multi-Bild-Galerien pro
Content-Item, inhaltliche Verknüpfung Artikel↔Unterkünfte/Aktivitäten (nur
generische Kachel), Content-Security-Policy, Playwright-E2E-Tests,
tatsächliches Vercel-Deployment (nur dokumentiert).

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
   (`0001_...` bis `0017_...`), da spätere Migrationen auf Tabellen/Funktionen
   aus früheren verweisen.
4. Danach `supabase/seed.sql` ausführen, um die Demo-Inhalte einzuspielen
   (12 Unterkünfte, 12 Aktivitäten, 15 Mikro-Abenteuer, 6 Magazinartikel —
   Spec-§29-Mindestmengen).
5. Unter **Authentication → URL Configuration**: Site URL auf
   `http://localhost:3000` setzen, `http://localhost:3000/auth/callback` zu
   den Redirect URLs hinzufügen — sonst laufen Magic-Link- und
   Bestätigungs-Links ins Leere.

> ✅ Alle 17 Migrationen und `seed.sql` wurden gegen ein echtes
> Supabase-Projekt (Produktion) ausgeführt und liefen fehlerfrei durch.
> End-to-end verifiziert: RLS-Policies (Auth, Familienprofil, Merkliste),
> `/go/`-Klick-Logging, `search_all_content()` inkl. Tippfehlertoleranz und
> Magazinartikeln (Phase 6).

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
  `articles`, `providers`, Referenztabellen, `outbound_clicks`,
  `search_events` …): RLS aktiviert, weiterhin **keine Policies**
  (Phase-0-Entscheidung, in Phase 5 für Admin-Schreibzugriffe bestätigt).
  Zugriff ausschließlich serverseitig über `lib/supabase/admin.ts`
  (`service_role`-Key, verlässt den Server nie — abgesichert mit
  `import "server-only"`). Admin-Server-Actions (`app/admin/**/actions.ts`)
  rufen vor jedem Schreibzugriff `requireAdminOrEditor()` bzw. für
  Nutzerrollen das strengere `requireAdmin()` auf (`lib/auth.ts`) — das ist
  die einzige Zugriffskontrolle, siehe `DECISIONS.md`.
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
Finder-Begründungstexte, Formularvalidierung (`lib/form-utils.ts`),
externe Weiterleitung (`lib/redirect.ts`), Berechtigungsprüfung
(`lib/roles.ts`) — alle als reine, mockfreie Funktionen (`lib/*.test.ts`).
Kein Playwright/E2E-Setup (bewusste Scope-Entscheidung, siehe
`DECISIONS.md`).

## Deployment

Zielplattform laut Spec §4 ist Vercel. **Die Seite ist live deployed:**
GitHub-Repo → Vercel-Projekt (Production-Domain `famvaya.com`, DNS bei
Hostinger, MX-Records/E-Mail unverändert) → separates Produktions-
Supabase-Projekt. So wurde/wird das eingerichtet:

1. Repository zu GitHub pushen, dort in [vercel.com](https://vercel.com) als
   neues Projekt importieren (Framework-Preset "Next.js" wird automatisch
   erkannt).
2. Unter **Project Settings → Environment Variables** alle Variablen aus
   `.env.local` eintragen (siehe „Umgebungsvariablen" oben) —
   `NEXT_PUBLIC_SITE_URL` auf die endgültige Produktions-Domain setzen.
3. Migrationen (`supabase/migrations/0001_...` bis `0017_...`) und
   `supabase/seed.sql` gegen das **Produktions-Supabase-Projekt** ausführen
   (siehe „Supabase einrichten" oben) — separates Projekt empfohlen, nicht
   dasselbe wie für die lokale Entwicklung.
4. In Supabase unter **Authentication → URL Configuration** die
   Produktions-Domain als Site URL sowie `<domain>/auth/callback` als
   Redirect-URL eintragen.
5. Unter **Project Settings → Analytics** in Vercel "Web Analytics"
   aktivieren, damit die `<Analytics/>`-Komponente (`app/layout.tsx`)
   tatsächlich Daten sammelt — ohne aktivierte Analytics in den
   Projekteinstellungen bleibt sie ein no-op.
6. Custom Domain unter **Project Settings → Domains** hinzufügen, die von
   Vercel angezeigten DNS-Records (A-Record für die nackte Domain,
   CNAME für `www`) beim DNS-Provider eintragen, ohne bestehende
   MX-Records (E-Mail) anzufassen.

> ⚠️ Aktuell existiert nur noch das Produktions-Supabase-Projekt — das
> separate Dev-Projekt wurde pausiert, um den kostenlosen Projektplatz für
> ein anderes Vorhaben freizugeben (siehe `DECISIONS.md`, Phase 7).
> `npm run dev` funktioniert daher lokal erst wieder mit einem neuen
> Dev-Projekt (neues Projekt anlegen, Migrationen 0001–0017 + `seed.sql`
> ausführen, `.env.local` aktualisieren).

### Platzhalterfotos hochladen

`supabase/seed.sql` referenziert Demo-Bilder unter Fake-Pfaden
(`demo/accommodations/....jpg` etc.), die nie automatisch hochgeladen
werden — frische Seed-Datenbanken zeigen dafür "Kein Foto hinterlegt". Ein
lokales, nicht ins Repo eingechecktes Node-Skript lädt stattdessen
lizenzfreie Stockfotos in den `content-media`-Bucket hoch und biegt die
`media.storage_path`-Werte auf die echten Storage-URLs um (Fotos werden
nach Dateinamen-Keyword grob kategorisiert und pro Kategorie
mehrfach wiederverwendet, siehe `DECISIONS.md`). Das ist eine
Übergangslösung bis echte Anbieterfotos über den Admin-Bereich
eingepflegt werden — perspektivisch sollte jedes Angebot ein eigenes,
lizenziertes Foto bekommen.
6. Build-Command (`next build`) und Start-Command (`next start`) sind
   Vercel-Standard, keine Anpassung nötig.

## Admin-Bereich

`/admin` (geschützt für Rollen `admin`/`editor`, `/admin/nutzer` nur
`admin`). Erster Admin-Account wird einmalig per Supabase-Admin-API-Skript
angelegt (Bootstrap-Problem, siehe `DECISIONS.md`), danach über
`/admin/nutzer` verwaltet. Medien-Uploads landen im öffentlichen
Supabase-Storage-Bucket `content-media` (`supabase/migrations/0014_admin_storage.sql`).

## E-Mail-Dienst (Resend), Kartenanbieter

Noch nicht angebunden. Die zugehörigen Umgebungsvariablen sind in
`.env.example` bereits vorbereitet — `RESEND_API_KEY` würde zusätzlich das
Newsletter-Double-Opt-in ermöglichen (siehe `DECISIONS.md`).

## Analytics

`lib/analytics/` stellt eine abstrahierte `trackEvent(name, props?)`-Funktion
bereit (Client-Wrapper `client.ts`, Server-Wrapper `server.ts`), aktuell
hinterlegt mit `@vercel/analytics` (kostenlos, kein API-Key, cookie-frei).
`<Analytics/>` im Root-Layout wird erst nach Cookie-Einwilligung gerendert
(`lib/consent.ts`, siehe „DSGVO-Grundlagen" unten). Ein Anbieterwechsel
betrifft nur die beiden Wrapper-Dateien, keine Call-Sites.

## DSGVO-Grundlagen

`/impressum` und `/datenschutz` sind ausdrücklich gekennzeichnete,
nicht-indexierte Platzhalterseiten (keine anwaltlich geprüfte Endfassung,
siehe `DECISIONS.md`). Das Cookie-Consent-Banner
(`components/cookie-consent.tsx`) setzt ein einziges technisch notwendiges
Cookie (`famvaya-consent`) und schaltet erst danach `<Analytics/>` frei;
"Cookie-Einstellungen" im Footer setzt die Einwilligung zurück.

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
  magazin/                          Magazin-Übersicht (Kategoriefilter, Pagination) + [slug]-Detailseite
  impressum/, datenschutz/          Rechts-Platzhalterseiten (nicht indexiert)
  sitemap.ts, robots.ts             SEO: XML-Sitemap + robots.txt (Next.js-Konventionen)
  admin/                            Admin-Bereich (geschützt, siehe unten)
  not-found.tsx                     404-Seite
  admin/layout.tsx                  requireAdminOrEditor() + Sidebar-Navigation
  admin/page.tsx                    Dashboard (Kennzahlen, zuletzt bearbeitet)
  admin/unterkuenfte/, aktivitaeten/,
  admin/mikro-abenteuer/, magazin/,
  admin/anbieter/                   CRUD je Content-Typ: page.tsx (Liste), neu/, [id]/,
                                     *-form.tsx (Formular), actions.ts (Server Actions)
  admin/nutzer/                     Nutzerliste + Rollenänderung (nur requireAdmin())
  admin/such-insights/               Zero-Result-Search-Auswertung (Phase 7)
components/
  layout/                           SiteHeader (Suche/Merkliste/Konto-Links), SiteFooter, MobileNav
  cards/                            AccommodationCard, ActivityCard, MicroAdventureCard, ArticleCard
  ui/                                shadcn/ui-Komponenten
  admin/                            Geteilte Admin-UI: content-table.tsx, status-badge.tsx,
                                     status-select.tsx, checkbox-group.tsx, media-picker.tsx,
                                     form-field.tsx, preview-banner.tsx
  breadcrumbs.tsx                   Sichtbare Breadcrumbs + BreadcrumbList-JSON-LD
  pagination.tsx                    Seiten-Navigation (Array-Slice) für die 4 Übersichtsseiten
  cookie-consent.tsx                DSGVO-Consent-Banner (Client Component)
  cookie-settings-link.tsx          Footer-Link, setzt Consent zurück
  *-filter-form.tsx                 Such-/Filterformulare je Bereich (plain <form method="get">)
  quick-family-check.tsx            Schneller Familien-Check (Client Component)
  inspiration-finder.tsx            „Lass dich inspirieren"-Wizard (Client Component)
  favorite-button.tsx               Merken-Button (Client Component)
  family-check-section.tsx          FamVaya-Familiencheck auf Detailseiten
  family-fit-badge.tsx              Kompaktes Family-Fit-Score-Badge (Karten, Phase 7)
  reality-check.tsx                 "Das spricht dafür" / "Das solltet ihr wissen" (Phase 7)
  search-result-item.tsx            Schlanke Suchergebnis-Darstellung
  placeholder-image.tsx             Fallback für fehlende Bilder
lib/
  supabase/                         admin.ts (service_role, Content/Suche) + client.ts/server.ts (Auth, session-gebunden)
  data/                             Datenzugriffs-Schicht je Content-Typ (inkl. articles.ts, öffentlich
                                     + Admin) + search.ts + favorites.ts + shared.ts + admin.ts
                                     (Dashboard) + media.ts (Upload) + users.ts + providers.ts +
                                     search-events.ts (Zero-Result-Logging + Auswertung, Phase 7)
  actions/                          Geteilte Server Actions (favorites.ts, newsletter.ts, consent.ts)
  analytics/                        events.ts (Vokabular) + client.ts + server.ts — trackEvent()-Abstraktion
  format.ts, family-rating.ts,
  family-check.ts, finder-reasons.ts Getestete Business-Logik (siehe lib/*.test.ts)
  auth.ts                           requireUser()/getOptionalUser()/requireAdminOrEditor()/
                                     requireAdmin()/canPreview()-Helper (nutzt lib/roles.ts)
  roles.ts                          Reine Rollen-Prädikate (canAccessAdmin, isAdmin), getestet
  redirect.ts                       Reine Entscheidungslogik der /go/-Route, getestet
  consent.ts                        Cookie-Consent lesen (Server Component)
  site-url.ts                       Geteilter Fallback für NEXT_PUBLIC_SITE_URL
  content-type.ts                   Geteilte Content-Type-Konstanten (Tabellen-/Pfad-Mapping)
  form-utils.ts                     Geteilte FormData-Parsing-Helfer für Admin-Server-Actions, getestet
  search-params.ts                  Geteilte searchParams-Parsing-Helfer
  types.ts                          Handgeschriebene DB-Typen
proxy.ts                            Session-Refresh (Next.js 16 "Proxy", vormals Middleware)
public/brand/                       FamVaya-Logo (SVG, Originalfarben)
supabase/migrations/                SQL-Migrationen (0001-0017, in Reihenfolge ausführen)
supabase/seed.sql                   Demo-Seed-Daten (Spec-§29-Mindestmengen)
files/                              Produktspezifikation (spec.md) und Phase-0-Kickoff-Prompt
FamVaya_Bauplan_2.md                Verbindliche Phasen-Roadmap (Phase 0-6)
DECISIONS.md                        Dokumentierte technische Entscheidungen
```
