# FamVaya — Technische Entscheidungen

Dokumentiert alle in Phase 0 selbstständig getroffenen technischen
Entscheidungen (Spec §36: „Bei technischen Entscheidungen sollst du
selbstständig sinnvolle Annahmen treffen und diese in der README
dokumentieren" — hier zusätzlich ausführlicher in dieser Datei).

## Umgebung

### Node.js lokal statt via Homebrew installiert

Der Rechner hatte weder Node.js noch npm noch Homebrew installiert. Eine
Homebrew-Installation erfordert sudo/systemweite Änderungen (`/opt/homebrew`,
PATH-weite Eingriffe), die in dieser Entwicklungsumgebung bewusst vermieden
werden. Stattdessen wurde das offizielle Node-LTS-Binary-Tarball
(v24.18.0, darwin-arm64) von nodejs.org geladen, per SHA256-Checksumme
verifiziert und nach `~/.local/` entpackt — ohne sudo, ohne Änderung an
`~/.zshrc` oder Systempfaden. Für jede Shell-Session muss der Pfad manuell
vorangestellt werden (siehe README). Wer eine dauerhafte, systemweite
Node-Installation bevorzugt, kann jederzeit zu Homebrew/nvm wechseln — die
`.nvmrc`-Datei (24.18.0) macht diesen Wechsel einfach.

### SQL-Migrationsdateien statt Supabase-CLI/Docker

`supabase start` benötigt einen lokalen Docker-Postgres-Stack. Docker Desktop
würde eine privilegierte macOS-Systemerweiterung benötigen (ebenfalls eine
systemweite Änderung, die vermieden wird). Stattdessen liegen die Migrationen
als reine `.sql`-Dateien unter `supabase/migrations/` — copy-paste-fähig im
Supabase-Dashboard-SQL-Editor, ohne jede zusätzliche Tooling-Abhängigkeit.
Die Dateien liegen bereits im CLI-Standardpfad, sodass ein späterer Wechsel
zur Supabase-CLI ohne Umstrukturierung möglich ist. Neue Migrationen ab einer
späteren Phase (sobald die CLI adoptiert wird) sollten auf
`supabase migration new` mit Timestamp-Namen umsteigen statt der
`0001_`-Sequenznummerierung aus Phase 0.

Konsequenz: Die Migrationen wurden **nicht** gegen eine echte Datenbank
ausgeführt, sondern nur durch sorgfältige manuelle Prüfung auf referenzielle
Konsistenz verifiziert (FK-Reihenfolge zwischen Dateien, Enum-Werte,
Spaltennamen gegen Spec §20 abgeglichen).

## Datenmodell

### Enum- vs. CHECK-Strategie

Echte Postgres-ENUMs nur für die drei explizit vorgegebenen Fälle:
`user_role`, `content_status`, `content_type`. Alles andere (z. B.
`accommodations.price_type`, `micro_adventures.cost_level`) nutzt
`text` + `CHECK`, da diese Werte spekulativer sind und ohne
`ALTER TYPE`-Reibung erweiterbar bleiben sollen.

### Polymorphe Tabellen: ENUM-Spalte statt FK + separatem CHECK

Vorgabe: `outbound_clicks` und `search_events` bleiben polymorph ohne FK.
`favorites`, `content_media`, `content_tags` ebenfalls polymorph, aber „mit
einem CHECK-Constraint gegen ein content_type-Enum abgesichert".

Umsetzung: `content_id` ist überall `uuid` ohne FK, aber die begleitende
`content_type`-Spalte hat direkt den Typ des `content_type`-ENUMs
(`'accommodation' | 'activity' | 'micro_adventure'`) statt `text` +
zusätzlichem `CHECK (content_type IN (...))`. Ein ENUM-typisierter Spaltentyp
*ist* bereits die Absicherung gegen ungültige Werte — funktional äquivalent
zum geforderten CHECK-Constraint, aber ohne redundante zweite Prüfung.

Diese Strategie wurde konsistent auch auf `content_age_groups` und `reviews`
angewendet, obwohl die Vorgabe sie nicht explizit nennt — beide haben die
identische `content_type` + `content_id`-Form wie die drei genannten
Tabellen, eine Inkonsistenz wäre hier willkürlich gewesen.

### `accommodation_types`-Tabelle (Lückenschluss)

Spec §20 referenziert `accommodations.accommodation_type_id`, definiert aber
nirgends eine `accommodation_types`-Tabelle. Ergänzt als schlanke
Lookup-Tabelle (`id`, `name`, `slug`, `sort_order`), damit der Fremdschlüssel
real ist statt auf ein nicht existierendes Ziel zu zeigen. Werte orientieren
sich an der Unterkunftsarten-Liste in Spec §3.1.

### Zusätzliches `category_content_type`-Enum für `categories.content_type`

Spec §17 zeigt, dass Magazinartikel eigene Kategorien haben (Reiseziele,
Großfamilien-Tipps, Sparen, …) — eine vierte Content-Art neben den drei
Hauptbereichen. Da das schlanke `content_type`-Enum (3 Werte) bewusst nur für
die polymorphen Verknüpfungstabellen reserviert bleibt (Favoriten gibt es
laut Spec §15.2 nur für die drei Hauptbereiche, nicht für Artikel), wurde ein
separates `category_content_type`-Enum mit 4 Werten
(`accommodation | activity | micro_adventure | article`) nur für
`categories.content_type` eingeführt.

In den Phase-0-Seed-Daten wird `content_type='accommodation'` in `categories`
nicht befüllt, da Unterkünfte strukturell über `accommodation_type_id`
kategorisiert werden, nicht über die generische `categories`-Tabelle. Der
Enum-Wert bleibt für spätere, thematische Kategorien (z. B. „Strandhäuser",
„Glamping" quer zu `accommodation_type_id`) nutzbar.

### RLS aktiviert, aber ohne Policies

Der Kickoff-Prompt sagt „RLS-Grundgerüst vorbereiten, aber die Policies noch
offen lassen (kommen in Phase 4)". Zwei Lesarten wären möglich gewesen:
(a) RLS aktivieren, keine Policy anlegen — Postgres blockiert dann jeden
Zugriff für `anon`/`authenticated`, nur `service_role` (mit `BYPASSRLS`) kommt
durch; oder (b) RLS aktivieren plus eine Platzhalter-Policy `USING (true)` für
alle Rollen.

Entschieden für (a): Eine `USING (true)`-Policy würde PII-nahe Tabellen wie
`family_profiles` und `reviews` sofort öffentlich lesbar/schreibbar machen,
sobald ein echter `anon`-Key verbunden wird — noch bevor in Phase 4 echte
Policies existieren. Das wäre ein unnötiges Sicherheitsrisiko für die Zeit
dazwischen. Konsequenz: Bis Phase 4 kann nur der `service_role`-Key (z. B. für
Seed-Skripte oder künftige Admin-Routen) auf die Datenbank zugreifen.

### Deterministische UUIDs im Seed-Skript

`supabase/seed.sql` nutzt hartcodierte, nach Entity-Typ präfigierte UUIDs
(z. B. `a9000000-...` für accommodations) statt `WITH ... RETURNING`-Ketten.
Macht Fremdschlüssel-Referenzen zwischen den Insert-Blöcken auf den ersten
Blick lesbar/nachvollziehbar und erlaubt `ON CONFLICT (id) DO NOTHING` für
ein idempotent wiederholbares Seed-Skript.

### Reduzierter Seed-Umfang (Phase 0 statt Spec §29)

Der Kickoff-Prompt fordert für Phase 0 explizit einen kleineren Datensatz (je
3 Unterkünfte/Aktivitäten/Mikro-Abenteuer) als der volle MVP-Seed-Umfang aus
Spec §29 (12/12/15 + 6 Magazinartikel). Phase 0 folgt der kleineren Vorgabe;
Artikel-Seed-Daten fehlen komplett, da der Magazin-Bereich laut Kickoff-Prompt
explizit außerhalb von Phase 0 liegt. Keine `users`/`family_profiles`/
`favorites`/`reviews`-Seed-Zeilen, da diese echte `auth.users`-Einträge
voraussetzen, die ohne laufenden Auth-Flow nicht sinnvoll erzeugt werden
können.

### Altersgruppen-Bänder (Annahme)

Spec gibt keine festen Altersgruppen-Grenzen vor. Gewählt: 0–1, 2–3, 4–5,
6–9, 10–13, 14–17 Jahre — orientiert an gängigen Entwicklungsstufen
(Kleinkind/Kindergarten/Grundschule/weiterführende Schule). Kann in einer
späteren Phase durch Redaktion angepasst werden, ohne das Schema zu ändern.

### `providers.status` und `reviews.status` als eigenständige CHECKs

Beide könnten oberflächlich zum `content_status`-Enum passen, sind aber
semantisch etwas anderes: Ein Anbieter durchläuft keinen
Redaktions-Workflow (`draft → in_review → published → paused → archived`),
sondern ist schlicht `active | inactive | pending`. Eine Bewertung
durchläuft eine Moderationswarteschlange (`pending | approved | rejected`),
kein Publishing-Workflow. Beide bekommen daher eigene `text` + `CHECK`
Constraints statt das `content_status`-Enum zweckzuentfremden.

## Design-Tokens

### Kontrast von Primary-Buttons (weißer Text auf Teal)

`--primary-foreground` ist Weiß auf `--primary` (Logo-Teal `#2FA4A3`). Der
rechnerische Kontrast liegt bei ca. 3:1 — ausreichend für große/fette
UI-Texte, aber unterhalb der vollen WCAG-AA-Anforderung (4.5:1) für normalen
Fließtext. Da Phase 0 nur eine einzelne Platzhalterseite mit einem Button
enthält und echte Barrierefreiheitsprüfung laut Spec §26 ein fortlaufendes,
nicht phasen-gebundenes Ziel ist, wird dieser Punkt hier dokumentiert statt
sofort gelöst. Sobald echte Button-heavy UI entsteht, sollte der Kontrast mit
einem Tool wie axe oder Lighthouse geprüft und ggf. ein dunklerer
Interaktions-Ton für Primary-Flächen ergänzt werden.

### Warnung/Fehler/Border/Radius/Schatten (Annahme)

Spec §5 gibt nur Primär-, Sekundär-, Hintergrund-, Text- und Akzentfarbe fest
vor. Für Warnung (`#B8862B`, gedeckter Amber), Fehler (`#B4483C`, gedeckter
Ziegelrot-Ton), Border (`#E4DED2`) und dezente Flächen (`#F3EEE4`) wurden
Töne gewählt, die zur warmen, gedeckten Markenpalette passen und explizit
kräftiges Gelb/Korallrot vermeiden (Spec §5: „Kräftige Buntfarben … sind für
großflächige UI-Elemente zu vermeiden"). `--radius: 0.75rem` und die
petrol-getönten Schatten (`--shadow-sm/--shadow/--shadow-lg`, über
CSS-Relative-Color-Syntax `oklch(from ... / alpha)` aus `--brand-petrol-dark`
abgeleitet) sind eigene, dokumentierte Annahmen.

### Dark Mode: Struktur vorhanden, keine Marken-Werte

shadcn generiert standardmäßig einen `.dark { }`-Block mit neutralen Werten.
Dieser wurde unverändert belassen (nicht mit Marken-Tönen befüllt), da Spec
§5 einen vollständigen Dark Mode für Phase 0 explizit nicht verlangt, aber
fordert, dass die Struktur ihn später ermöglicht. Die Variablen-Struktur
(`@custom-variant dark`, `.dark`-Block, semantische statt hartcodierte
Farben in Komponenten) ist bereits vorhanden — eine spätere Phase muss nur
die `.dark`-Werte durch marken-getönte Pendants ersetzen, kein Refactoring
nötig.

## Next.js / Tooling

### Tailwind v4 (CSS-basierte Konfiguration statt `tailwind.config.ts`)

`create-next-app` (aktuell v16.2.10) scaffoldet standardmäßig Tailwind CSS
v4, das Theme-Konfiguration über `@theme inline { }` in `app/globals.css`
statt über eine separate `tailwind.config.ts`-Datei vornimmt. Der
ursprüngliche Plan sah eine `tailwind.config.ts` vor — angepasst an die
tatsächlich installierte Tailwind-Version, funktional äquivalent.

### shadcn-Preset „base-nova" mit `@base-ui/react`

`shadcn init` wurde non-interaktiv mit den Default-Presets ausgeführt
(`--template=next --preset=base-nova`), was `@base-ui/react` statt Radix als
Komponenten-Primitive-Library installiert (aktuelle shadcn-Generation). Die
generierten Basisfarben wurden vollständig durch die FamVaya-Marken-/
Semantik-Tokens überschrieben, sodass die Preset-Wahl selbst kaum ins
Gewicht fällt.

---

# Phase 1 — Kern-Seiten mit echten Daten

## `lib/supabase/admin.ts`: service_role-Client für öffentliche Content-Queries

RLS ist seit Phase 0 auf allen Tabellen aktiv, aber ohne Policies (siehe
oben) — der `anon`-Key liefert für jede Tabelle eine leere Ergebnisliste.
Echte Policies sind laut Kickoff-Prompt explizit für eine spätere Phase
vorgesehen. Damit die Kern-Seiten trotzdem echte Daten zeigen können, gibt es
`lib/supabase/admin.ts`: ein zweiter, mit `import "server-only"` abgesicherter
Client mit dem `service_role`-Key, ausschließlich für lesende Content-Queries
in Server Components verwendet. Der Key verlässt den Server nie. Das ist ein
etabliertes Next.js/Supabase-Muster für rein lesende öffentliche Inhalte;
`lib/supabase/server.ts` (anon-Key + Cookies) bleibt für spätere
nutzer-/sessionbezogene Zugriffe (Auth-Phase) unverändert bestehen. Sobald
echte RLS-Policies existieren, kann für öffentliche Listen-/Detailseiten auf
den `anon`-Client umgestellt werden — der Admin-Client bleibt dann
Admin-/Redaktionsfunktionen vorbehalten.

## Placeholder-Bilder statt kaputter Bild-URLs

Alle Seed-Medien aus Phase 0 verweisen auf fiktive `storage_path`-Werte ohne
echten Upload in Supabase Storage. `lib/media.ts` (`resolveMediaUrl`)
behandelt nur vollqualifizierte `http(s)`-URLs als echtes Bild — alles
andere fällt auf `components/placeholder-image.tsx` zurück (markenfarbiges
Gradient-Feld + Icon + „Kein Foto hinterlegt"). Sobald echte Bilder in
Storage liegen und `storage_path` auf echte URLs zeigt, greift automatisch
der echte Bildpfad, ohne Codeänderung.

## FamVaya-Familiencheck: vereinfachte Phase-1-Fassung

Spec §10.3 beschreibt einen sehr granularen Familiencheck (Schlafsituation,
Küchen-/Waschmöglichkeiten, Kostenbewertung, Mobilität als einzelne
redaktionelle Kriterien). Dafür existieren im aktuellen Schema keine eigenen
Spalten. `components/family-check-section.tsx` reduziert das für Phase 1 auf
zwei aus vorhandenen Spalten ableitbare Bausteine: den `family_rating`-Score
mit Label (Spec-§21-Schwellenwerte, `lib/family-rating.ts`) und — nur für
Unterkünfte, da nur dort `max_children` existiert — eine 3/4/5+-Kinder-
Checkliste (`lib/family-check.ts`). Die granularen Kriterien aus §10.3
bleiben einer späteren Phase vorbehalten, in der das Schema entsprechend
erweitert wird.

## Keine Merken-/Such-/Login-UI in Navigation und Karten

Spec §6 sieht in der Navigation rechts Suche, Merkliste und Anmelden vor;
Spec §9 sieht auf jeder Karte einen Merken-Button vor. Da es in Phase 1 noch
keine Authentifizierung und keine Favoriten-Funktion gibt, wurden diese
UI-Elemente bewusst weggelassen statt sie funktionslos anzuzeigen — das
vermeidet tote Buttons und wird nachgeholt, sobald die zugehörigen Backends
existieren.

## `FamVaya_Bauplan_2.md` wurde nachträglich verbindlich

Während der Umsetzung tauchte `FamVaya_Bauplan_2.md` im Projektordner auf —
ein detaillierterer Phasenplan, der nicht Teil der ursprünglichen
`files/`-Dokumente war. Der Nutzer hat entschieden, dass dieser Plan ab
sofort maßgeblich ist. Das bereits Gebaute (Startseite, alle drei
Übersichts-/Detailseiten ohne Filter) deckt im Wesentlichen dessen „Phase 2"
ab und bleibt bestehen; ergänzt wurden die dort für „Phase 1" explizit
geforderten, noch fehlenden Stücke: Grundfilter auf der
Familienunterkünfte-Übersicht und die `/go/`-Affiliate-Redirect-Route.
Filter für Aktivitäten/Mikro-Abenteuer sind laut diesem Plan erst „Phase 2"
und wurden bewusst nicht in diesem Schritt ergänzt.

## `/go/[contentType]/[contentId]`: service_role-Insert, kein user_id/session_id

Die Redirect-Route (`app/go/[contentType]/[contentId]/route.ts`) nutzt
`createAdminClient()` für den `outbound_clicks`-Insert, da die Tabelle RLS
ohne Policies hat (siehe oben) — ein anon-Client könnte gar nicht schreiben.
`user_id` bleibt `null` (keine Auth in Phase 1), `session_id` ebenfalls
(keine Cookie-/Session-Infrastruktur in Phase 1) — beide Felder sind laut
Spec §20 optional und werden nachgerüstet, sobald Auth existiert.

Fehlt sowohl `affiliate_url` als auch `external_url`, leitet die Route auf
die jeweilige Detailseite zurück statt einen toten Link zu erzeugen; ist
sogar die `contentId` unbekannt, geht es zur Übersichtsseite des Bereichs.
Kein Logging in diesen Fehlerfällen, da kein echter Ziel-Klick stattfand.

## Card-Badges aus Skalarspalten statt aus Ausstattungsmerkmalen

Die „besonderen Merkmale"-Badges auf den Karten (Spec §9.1) werden aus
bereits vorhandenen Skalarspalten abgeleitet (`max_guests`, `bedrooms`,
`featured`) statt zusätzlich `accommodation_amenities` in die
Listen-Query zu laden — hält die Listen-Queries schlank (kein N+1 über viele
Karten hinweg). Die volle Ausstattungsliste wird nur auf der Detailseite
geladen.

## Phase 2 fertigstellen: Filter für Aktivitäten/Mikro-Abenteuer + Schneller Familien-Check

### Grundfilter statt vollständiger Spec-§8.2/§8.3-Filterlisten

Wie schon bei den Unterkünften (Phase 1) wird bewusst nur eine pragmatische
Teilmenge der in der Spec gelisteten Filter umgesetzt (Aktivitäten:
Kategorie, Indoor/Outdoor, Gesamtpreis, Großfamilienrabatt; Mikro-Abenteuer:
Kategorie, Budget, Vorbereitung, Indoor/Outdoor) — an vorhandene Spalten
angelehnt statt an Felder, die eine Erweiterung des Schemas bräuchten (z. B.
"Entfernung" fehlt, da keine Nutzer-Standortermittlung existiert; "bei
Regen" deckt sich mit `weather_suitable`, aber wurde für Phase 2 nicht als
eigener Filter ergänzt, um den Umfang klein zu halten).

### `getCategoriesByContentType` als geteilter Helper

Aktivitäten und Mikro-Abenteuer brauchen beide eine Kategorie-Liste für ihr
Filter-Dropdown. Statt das in `lib/data/activities.ts` und
`lib/data/micro-adventures.ts` zu duplizieren, liegt die Query einmal in
`lib/data/shared.ts` (`getCategoriesByContentType`), parametrisiert über das
schon bestehende `category_content_type`-Enum.

### `FilterField`/`filterInputClass` als geteilte UI-Bausteine

Das Feld-Label+Input-Muster aus dem Unterkünfte-Filter wurde nach
`components/filter-field.tsx` extrahiert, statt es in jedem der drei
Filter-Formulare (und im Schnellen Familien-Check) erneut zu definieren.

### `lib/search-params.ts` als geteilte Parsing-Helfer

`toNumber`/`toStringParam`/`toBoolean` für `searchParams` waren zunächst
lokal in `app/familienunterkuenfte/page.tsx` definiert und wurden für die
beiden neuen Übersichtsseiten in ein gemeinsames Modul verschoben, statt sie
ein drittes Mal zu kopieren.

### Schneller Familien-Check: Client Component, kein Suchbackend

Einzige bewusste Ausnahme vom „möglichst wenig Client-JS"-Prinzip in diesem
Projekt bisher: `components/quick-family-check.tsx` braucht `'use client'`,
weil die Ziel-Route je nach gewähltem Bereich wechselt (`/familienunterkuenfte`
vs. `/familienaktivitaeten` vs. `/mikro-familienabenteuer` vs. Anker auf der
Startseite) — mit einem reinen `<form method="get">` mit fixer `action` nicht
abbildbar. Gegenüber Spec §7.2 vereinfacht: keine dynamische Pro-Kind-
Altersliste, nur Gesamtzahl Erwachsene/Kinder. Bereich „Aktivität"/„Mikro-
Abenteuer" verlinkt ohne vorbefüllte Filter, da dort kein Kapazitäts-Feld
existiert, das sich aus Erwachsenen-/Kinderzahl ableiten ließe.

## Phase 3: Globale Suche + „Lass dich inspirieren"-Finder

### `pg_trgm` erst jetzt aktiviert

In Phase 0 bewusst zurückgestellt ("deferred to the later search phase").
Migration `0011_search.sql` aktiviert die Extension und ergänzt je
`accommodations`/`activities`/`micro_adventures` eine generierte
`search_vector`-Spalte (`to_tsvector('german', ...)`, gewichtet Titel > Ort >
Kurz- > Vollbeschreibung) plus GIN-Volltext- und GIN-Trigram-Index auf
`title`.

### Bugfix in `0012`: `word_similarity`/`<%` statt `similarity`/`%`

Beim ersten Live-Test schlug die Tippfehlertoleranz fehl: `title % search_query`
nutzt `similarity()`, die den **kompletten** (oft mehrteiligen) Titel gegen
das kurze Suchwort vergleicht — der Score lag dadurch fast immer unter dem
Default-Threshold (0.3), selbst bei einem einzelnen Buchstabendreher
("Ferinhaus" statt "Ferienhaus" lieferte 0 Treffer). Fix: `word_similarity()`/
`<%` sucht die beste Teilwort-Übereinstimmung *innerhalb* des Titels statt
den ganzen String zu vergleichen — danach lieferten sowohl "Ferinhaus" als
auch "Tierpak" die erwarteten Treffer. `0011` bleibt unverändert als
Protokoll dessen, was tatsächlich ausgeführt wurde; `0012` ist der separate
Bugfix-Migration-Eintrag (kein nachträgliches Bearbeiten bereits gelaufener
Migrationen).

### `search_all_content()`: eine Postgres-Funktion statt Client-seitigem UNION

`UNION ALL` über die drei Content-Tabellen liegt als SQL-Funktion in der DB
(`language sql stable`, kein `security definer`, kein `grant ... to anon`) —
aufgerufen wird sie ausschließlich über `lib/supabase/admin.ts`, konsistent
zur bisherigen Sicherheitslinie (RLS ohne Policies, alle öffentlichen Reads
laufen über `service_role`). Ein vierter UNION-Arm für `articles`
(Magazin-Suche, Spec §14) wurde **nicht** vorbereitet: `content_type` ist ein
3-wertiges Enum, `'article'` würde eine Enum-Erweiterung erfordern — da
`articles` aktuell ohnehin leer ist (Magazin kommt erst Phase 6), wird das
dann nachgezogen statt jetzt eine ungenutzte Erweiterung anzulegen.

### Suchergebnisse: schlanke Darstellung statt volle Card-Komponenten

`search_all_content()` liefert bewusst nur `title, slug, short_description,
city` (kein Preis/Rating/Bild) — eine volle `AccommodationCard`-Darstellung
pro Treffer hätte einen zusätzlichen Full-Query pro Ergebnis gekostet.
Stattdessen ein schlankes `components/search-result-item.tsx`. Der
Inspirationsfinder (siehe unten) nutzt dagegen die vollen Card-Komponenten,
weil er ohnehin über die bestehenden `getPublished*`-Funktionen läuft, die
alle Felder liefern.

### `getContentIdsByTagSlugs`: zwei Queries statt `!inner`-Join

Tag-Filterung (Interessen-Schritt im Finder, potenziell später auch in den
Übersichts-Filtern) löst Tag-Slugs zunächst zu IDs auf und filtert dann
`content_tags` danach — statt eines PostgREST-`!inner`-Joins mit
Punkt-Notation, um das bereits etablierte, robustere
Zwei-Schritte-Auflösungsmuster (siehe `typeSlug`/`categorySlug`) konsistent
weiterzuführen. OR-Semantik: mindestens ein ausgewähltes Tag muss passen.

### Finder-Vereinfachungen gegenüber Spec §13 (siehe auch Plan-Datei)

- Schritt „Zeit" ist ein einfacher Spontan/Flexibel-Umschalter statt der
  sechs Zeit-Optionen aus der Spec — mappt auf `preparation_level`, nur bei
  Mikro-Abenteuern wirksam (einzige Tabelle mit diesem Feld).
- Schritt „Interessen" nutzt die tatsächlich in der DB vorhandenen Tags
  (`Familienfreundlich`, `Großfamilie`, `Schlechtwetter-geeignet`, `Outdoor`,
  `Budgetfreundlich`) statt der festen Spec-Liste (Strand, Wasser, Tiere, …),
  die im aktuellen Seed nicht abgebildet ist.
- Begründungstexte (`lib/finder-reasons.ts`, reine Funktion mit Tests) werden
  aus den aktiv gewählten Kriterien hergeleitet, nicht pro Treffer einzeln
  gegen die DB zurückverifiziert — z. B. "Passt zu eurem Budget" gilt für
  alle Treffer der Budget-Suche gleichermaßen.
- Kein Speichern/Teilen-Button am Ende (Favoriten/Sharing brauchen Auth,
  Phase 4).
- `findMatches` (Server Action) ist bewusst als reine
  `FinderInput -> FinderResults`-Funktion geschnitten, damit sie sich später
  durch einen KI-gestützten Berater ersetzen lässt, ohne dass Wizard-UI oder
  Ergebnis-Rendering sich ändern müssen (Bauplan_2.md-Vorgabe).

### Navigation: „Lass dich inspirieren" und Suche jetzt sichtbar

Beide waren in Phase 1/2 bewusst aus Header/Nav ausgeklammert, weil die
Zielseiten noch nicht existierten (Prinzip: keine toten Links). Jetzt
ergänzt: Such-Icon im Header (verlinkt `/suche`) und „Lass dich inspirieren"
in `NAV_ITEMS` (Spec §6 sieht beides in der Hauptnavigation vor). Merkliste/
Anmelden bleiben weiterhin draußen (Auth existiert erst ab Phase 4).

### Bugfix beim Live-Test: `preparationLevel` als Array statt Einzelwert

Der erste End-to-End-Test von Nutzerfluss 3 (Bereich „Mikro-Abenteuer",
spontan, unter 50 €, Interesse „Outdoor") lieferte 0 Treffer. Ursache: das
einzige Outdoor-getaggte Mikro-Abenteuer im Seed ("Nachtwanderung") hat
`preparation_level='light'`, aber „spontan" filterte hart auf `'none'` —
kombiniert mit dem Tag-Filter (UND-Verknüpfung) blieb nichts übrig.
`MicroAdventureFilters.preparationLevel` wurde deshalb von einem
Einzelwert auf ein Array umgestellt (`.eq()` → `.in()`); der Finder erlaubt
bei "spontan" jetzt `['none', 'light']` (nur `'moderate'` gilt als nicht
spontan machbar). Die Übersichtsseite (`app/mikro-familienabenteuer/page.tsx`)
übergibt bei ihrem Einzel-Select weiterhin nur ein Array mit einem Element.

## Phase 4: Auth, Familienprofil, Favoriten, Newsletter

### Kein Google-OAuth

Fehlende externe Voraussetzung: Google OAuth bräuchte ein eigenes
Google-Cloud-Projekt mit Client-ID/Secret, das nicht per Code oder SQL
angelegt werden kann. Spec nennt Google ohnehin nur als optional. E-Mail/
Passwort + Magic Link decken die Kernanforderung ab; Google-Login ist ein
sauberer Nachrüst-Punkt (Supabase unterstützt es direkt), sobald echte
OAuth-Credentials existieren.

### Newsletter: vereinfachtes Single-Opt-in statt Double-Opt-in

Spec/Bauplan wollen Double-Opt-in (Bestätigungsmail). Ohne hinterlegten
`RESEND_API_KEY` (siehe `.env.example`, seit Phase 0 als "Phase 2+, noch
ungenutzt" markiert) kann keine echte Bestätigungsmail verschickt werden —
ein gebauter Token-Bestätigungs-Flow ohne funktionierenden Mailversand wäre
für Nutzer:innen nur eine "E-Mail bestätigen"-Meldung, die nie im Postfach
ankommt. Stattdessen: `newsletter_subscribers.confirmed` wird beim Insert
sofort auf `true` gesetzt. Sobald ein echter Resend-Key existiert, ist das
ein reiner Additiv-Umbau (Token-Spalte ergänzen, Bestätigungs-Route bauen,
`confirmed` erst nach Klick setzen) — keine bestehende Struktur muss dafür
rückgebaut werden.

### Merkliste: eine Standard-Sammlung statt voller Mehrfach-Sammlungsverwaltung

Das Schema (`favorite_collections`) unterstützt beliebig viele benannte
Sammlungen pro Nutzer (Spec §15.2 nennt "eigene Listen erstellen" als
Beispiel). Phase 4 nutzt bewusst nur eine automatisch angelegte Standard-
Sammlung ("Meine Favoriten") pro Nutzer (`getOrCreateDefaultCollection`) —
deckt die Bauplan-DoD ("Favorit merken/entfernen, Liste teilen") vollständig
ab, ohne UI für Anlegen/Umbenennen/Löschen mehrerer Listen zu brauchen.
Mehrfach-Sammlungen sind ein sauberer, additiver Folge-Schritt (Schema ist
bereits darauf vorbereitet).

### Freigabe-Link läuft über service_role + Token-Match, nicht über RLS

Bewusst **keine** RLS-Policy `using (is_public = true)` auf
`favorite_collections` für anonyme Leser. Eine solche Policy würde mit dem
`anon`-Key eine Auflistung/Enumeration aller öffentlichen Sammlungen aller
Nutzer:innen ermöglichen (RLS filtert Zeilen, verhindert aber kein
"SELECT * WHERE is_public"-Durchsuchen). Stattdessen liest
`app/merkliste/geteilt/[token]/page.tsx` gezielt per exaktem
`share_token`-Match über `lib/supabase/admin.ts` — der unerratbare UUID-Token
selbst ist das Zugriffsmerkmal ("security through possession of the link",
Standardmuster für Freigabe-Links), nicht die Nutzerrolle.

### `handle_new_user()`-Trigger: `security definer` erforderlich

Der Insert in `auth.users` beim Signup läuft unter der internen
`supabase_auth_admin`-Rolle, die kein Schreibrecht auf `public.users` hat.
Der Trigger muss deshalb `security definer` sein (läuft mit den Rechten des
Funktions-Eigentümers), plus `set search_path = public` als Schutz gegen
search-path-Hijacking-Angriffe auf security-definer-Funktionen (Standard-
Postgres-Best-Practice).

### `middleware.ts` → `proxy.ts` (Next.js 16)

Next.js 16 benennt "Middleware" in "Proxy" um (identische Funktionalität,
siehe `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`).
Die Datei heißt entsprechend `proxy.ts`, die exportierte Funktion `proxy`
statt `middleware` — sonst identisch zum Standard-Supabase-SSR-Session-Muster.

### Merken-Button nur auf Detailseiten, nicht auf Card-Listen

Siehe Plan-Datei: der korrekte "schon gemerkt"-Anfangszustand pro Card
müsste sonst auf sechs verschiedenen Seiten (3 Übersichten, Startseite,
Suche, Finder) serverseitig vorberechnet werden. Auf die drei Detailseiten
begrenzt (Spec §10.1 nennt den Button dort ohnehin explizit im
Hero-Bereich) hält den Scope überschaubar, ohne einen falschen
Anfangszustand (→ falsche Toggle-Richtung beim ersten Klick) zu riskieren.
Card-Merken-Buttons sind ein sauberer Folge-Schritt.

### Content-Tabellen bleiben beim service_role-Muster

Bauplan_2.md fordert "RLS-Policies jetzt scharf schalten" — umgesetzt für
alle *neuen*, nutzerbezogenen Tabellen (`users`, `family_profiles`,
`favorites`, `favorite_collections`, `newsletter_subscribers`). Die
öffentlichen Content-Tabellen (`accommodations`, `activities`,
`micro_adventures`, Referenztabellen) bleiben bei der Phase-0-Entscheidung
"RLS aktiv, keine Policy, nur `service_role`" — das war bereits sicher und
funktioniert, eine nachträgliche `anon`-Read-Policy dafür ist nicht Teil der
Phase-4-DoD und würde nur unnötige Fläche für Policy-Fehler öffnen.

## Phase 5: Admin-Bereich & CMS

### Admin-Schreibzugriff weiterhin über service_role, nicht über RLS

Konsistent mit der oben dokumentierten Phase-0/4-Entscheidung: Content-
Tabellen bekommen weiterhin keine eigenen RLS-Policies. Jede Admin-Server-
Action ruft zuerst `requireAdminOrEditor()` (`lib/auth.ts`) auf, bevor sie
`lib/supabase/admin.ts` anfasst — das ist die **einzige** Durchsetzung.
Bewusster Trade-off: einfacher als "echte" RLS-Verteidigung in der Tiefe,
aber die Anwendungsebene ist bereits die einzige Instanz, die Content
überhaupt schreibt (kein Client-seitiger Direktzugriff auf `service_role`
möglich). Ein Fehler in einer einzelnen Server Action wäre der einzige
Weg, diesen Schutz zu umgehen.

### Bootstrap-Problem beim ersten Admin-Account

Niemand kann sich selbst zum Admin befördern, solange keiner existiert. Der
erste Account (`b.richtsteigerrstg@gmail.com`) wurde einmalig per
Supabase-Admin-API-Skript angelegt (vorbestätigt, Einmal-Passwort), danach
wurde `role` direkt per `service_role`-Update auf `'admin'` gesetzt (der
`handle_new_user()`-Trigger legt neue Nutzer:innen standardmäßig mit
`role='user'` an). Alle weiteren Rollenvergaben laufen über die
Nutzerverwaltung im Admin-Bereich (`/admin/nutzer`).

### `requireAdmin()` zusätzlich zu `requireAdminOrEditor()`

Für die reine Content-Pflege reicht `requireAdminOrEditor()`. Eine
Ausnahme: Nutzerrollen ändern (`/admin/nutzer`) ist strenger auf `admin`
beschränkt (`requireAdmin()`) — sonst könnte sich ein Editor selbst zum
Admin befördern, ein klassischer Privilege-Escalation-Pfad.

### Kein dediziertes CRUD für Referenzdaten

Kategorien, Regionen, Tags, Ausstattungsmerkmale, Altersgruppen bleiben
seed-/SQL-gepflegt wie seit Phase 0. Content-Formulare wählen nur aus
bestehenden Werten aus (Dropdowns/Checkbox-Gruppen). Die Bauplan-DoD
(Nutzerfluss 4, Spec §33) verlangt das nicht explizit — eine eigene Pflege-
UI für fünf weitere Tabellen hätte den ohnehin großen Phase-5-Scope
gesprengt, ohne einen DoD-Punkt abzudecken.

### Regionen-Dropdown flach statt kaskadierend (Land → Region)

Ein Land-Dropdown, das per Client-JS ein Regionen-Dropdown nachlädt, hätte
den ersten Client Component im Admin-Bereich erzwungen (bisher alle
Formulare reine Server-Components mit nativen HTML-Forms). Stattdessen: ein
einziges "Region"-Dropdown mit Label "Land – Region"; `country_id` wird
serverseitig aus der gewählten `region_id` abgeleitet
(`getAllRegions()`/`RegionWithCountry`). Bei der aktuellen Seed-Datenmenge
(2 Länder, 4 Regionen) verliert das nichts an Bedienbarkeit.

### Anbieter: leichtes CRUD, Nutzerverwaltung: nur Rollenänderung

Anbieter bekommen ein einfaches CRUD (Liste, Anlegen, Bearbeiten, kein
Löschen — Unterkünfte/Aktivitäten referenzieren sie per FK), nötig um
Content sinnvoll mit echten Anbietern zu verknüpfen. Nutzer:innen entstehen
ausschließlich über Signup; der Admin-Bereich erlaubt nur eine
Rollenänderung, kein volles Nutzer-CRUD (Anlegen/Löschen wäre Auth-Umgehung
bzw. Datenverlust-Risiko ohne klaren Bauplan-Bedarf).

### Bewertungsmoderation: außerhalb Scope

Es gibt noch keine öffentliche Bewertungs-Einreichungs-UI (Spec §16 erlaubt
das explizit "zunächst optional deaktiviert") — ohne Einreichungen gibt es
nichts zu moderieren. Ein Moderations-Screen ist ein sauberer Folge-Schritt,
sobald Einreichungen existieren.

### Medien: ein Titelbild pro Content-Item, kein Multi-Galerie-Management

Die öffentlichen Templates rendern aktuell ohnehin nur ein Titelbild pro
Unterkunft/Aktivität/Mikro-Abenteuer/Artikel. Ein Galerie-Uploader mit
Sortierung/Mehrfachbildern wäre Aufwand ohne sichtbaren Nutzen, solange die
Frontend-Seiten das nicht darstellen. `content_media` unterstützt technisch
bereits mehrere Bilder (`sort_order`, `is_cover`) — additiv nachrüstbar.

### Magazin-Inhalt: Textarea statt Rich-Text-Editor

Ein WYSIWYG-Editor (z. B. TipTap) hätte eine neue Abhängigkeit plus
Serialisierungsformat (HTML vs. Markdown vs. JSON) eingeführt. Da Magazin-
Artikel selbst erst in Phase 6 öffentlich lesbar werden, reicht eine
einfache Textarea mit Fließtext (`whitespace-pre-line` beim Rendern) für den
jetzigen Admin-Workflow.

### Medien-Upload als plain Helper statt eigener Server Action

`lib/data/media.ts#uploadMediaFile()` ist bewusst **keine** eigene
`"use server"`-Action (ursprünglich im Plan als `lib/actions/media.ts`
skizziert), sondern eine plain async Funktion. Grund: Datei-Upload und
Content-Speicherung sollen in einem einzigen Formular-Submit passieren
(ein `<form>` pro Content-Typ, `multipart/form-data`). Eine separate
Upload-Action hätte einen zweistufigen Upload-dann-Verknüpfen-Flow mit
eigenem Zwischenzustand erzwungen. Stattdessen ruft jede Content-Server-
Action (`createAccommodation`, `updateActivity`, …) `uploadMediaFile()`
intern auf, wenn ein `cover_image`-Datei-Feld gesetzt ist.

### Duplizieren kopiert kein Titelbild

`duplicate*Row()`-Funktionen kopieren Ausstattung/Tags/Altersgruppen, aber
bewusst **kein** `content_media`/`cover_media_id`. Reihenfolge-Grund:
verhindert, dass zwei Content-Items dasselbe physische Bild als "ihr"
Titelbild referenzieren und ein Redakteur beim Bearbeiten der Kopie versehentlich
das Original-Bild ersetzt (Storage-Datei ist pro `media`-Zeile, nicht pro
Content-Item). Ein neues Titelbild muss beim Duplikat bewusst neu gesetzt
werden.

### Vorschau: `?preview=1` auf öffentlichen URLs, kein separates Template

Die drei bestehenden Detailseiten (`/familienunterkuenfte/[slug]` etc.)
akzeptieren einen `?preview=1`-Query-Parameter; `getAccommodationBySlug()`
& Pendants bekommen dafür einen optionalen `{ includeUnpublished }`-Parameter.
Die Sichtbarkeitsprüfung (`canPreview()`) ist rein lesend (kein Redirect wie
bei `requireUser()`), da ein 404/Redirect für einen eingeloggten Editor beim
Testen einer Entwurfsseite verwirrender wäre als eine sichtbare
"Vorschau"-Markierung (`PreviewBanner`). Für Magazin-Artikel existiert noch
keine öffentliche Seite zum Wiederverwenden (Magazin ist erst Phase 6) —
dort gibt es stattdessen eine reine Vorschau-Seite unter
`/admin/magazin/[id]/vorschau`, geschützt durch das ohnehin per
`requireAdminOrEditor()` gesicherte `/admin`-Layout.

### Automatisches Ablaufdatum: Listen filtern, Detailseite bleibt erreichbar

`expires_at` gibt es laut Schema nur für Unterkünfte/Aktivitäten (Spec §20),
nicht für Mikro-Abenteuer. Abgelaufene, aber weiterhin `status='published'`
Einträge werden aus allen Listen-Queries (Startseite, Übersichten, globale
Suche via `search_all_content()`) gefiltert, tauchen aber unter ihrer
bestehenden URL weiter auf (SEO-Grund: keine toten Links, keine
301-Kaskaden) — die Detailseite zeigt anstelle des `/go/`-Buttons einen
schlichten "Dieses Angebot ist abgelaufen"-Hinweis.

## Phase 6: Magazin, SEO, Analytics, Recht, Härtung

### Magazin: öffentliche Seiten ersetzen die Admin-Vorschau-Route

`app/admin/magazin/[id]/vorschau/page.tsx` (Phase 5) ist entfallen. Sobald
`/magazin/[slug]` existiert, folgt die Magazin-Vorschau exakt demselben
`?preview=1`-Muster wie die drei anderen Content-Typen (`canPreview()` +
`PreviewBanner`) — der "Vorschau ansehen"-Link im Admin zeigt jetzt auf die
echte öffentliche Seite. Das war im Phase-5-Code-Kommentar bereits so
angekündigt.

### Verwandte Inhalte im Magazin: Heuristik statt Redakteurspflege

Artikel-Detailseiten zeigen automatisch (a) verwandte Artikel über
gleiche `category_id` und (b) eine generische "Das könnte euch auch
interessieren"-Kachel aus den bestehenden `getFeaturedAccommodations()`/
`getFeaturedActivities()`-Funktionen — unabhängig vom konkreten Artikel.
Eine echte inhaltliche Verknüpfung (Artikel → passende Unterkünfte über
gemeinsame Tags) hätte eine Erweiterung des `content_type`-Enums um
`'article'` gebraucht, was wiederum die polymorphen Verknüpfungstabellen
(`content_tags`, `content_age_groups`, `content_media`, `outbound_clicks`,
`search_events`) betroffen hätte — Artikel bekommen bewusst keine
Tag-Verknüpfung, um dieses Enum unverändert zu lassen (siehe nächster
Punkt).

### Globale Suche: `search_all_content()`-Rückgabetyp von Enum auf `text`

Migration `0016_articles_search.sql` nimmt Magazinartikel in die Suche auf.
Da `content_type` (Postgres-Enum) nur `accommodation`/`activity`/
`micro_adventure` kennt und eine Erweiterung um `'article'` unerwünschte
Nebenwirkungen auf die polymorphen Tabellen hätte (siehe oben), gibt die
Funktion die Spalte jetzt als `text` zurück statt als Enum-Typ. Eine
Rückgabetyp-Änderung erlaubt kein `create or replace` — die Migration macht
stattdessen `drop function` + `create function`. `lib/types.ts`:
`SearchResultRow.content_type` ist entsprechend `ContentType | "article"`.

### Pagination ohne Änderung an der Datenschicht

`getPublishedAccommodations()`/`-Activities()`/`-MicroAdventures()` liefern
weiterhin das volle gefilterte Ergebnis; `components/pagination.tsx`
schneidet rein auf Seiten-Ebene per Array-Slice (`paginate()`). Diese drei
Funktionen werden auch von `lib/data/favorites.ts` (Merkliste) und dem
Finder genutzt — eine Signaturänderung (z. B. `{ items, total }` statt
`Array`) hätte mehrere funktionierende Call-Sites angefasst, ohne
messbaren Nutzen bei der aktuellen Datenmenge (12–15 Einträge je Typ).
`?page=`-Links sind reine `<Link>`s (kein Client-JS), damit sie crawlbar
bleiben (Spec §25).

### SEO: keine CSP, keine Rel-Prev/Next-Tags, kein FAQPage-Schema

- **Content-Security-Policy**: nicht scharf geschaltet. Eine korrekte CSP
  müsste Supabase-Storage- und Vercel-Analytics-Domains exakt allowlisten;
  das ließe sich ohne laufendes Deployment nicht verlässlich verifizieren
  und hätte im schlimmsten Fall blind Bilder/Analytics blockiert. Nur
  einfache Header (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`) in `next.config.ts`.
- **`rel="prev"/"next"`**: bewusst weggelassen — Google hat dieses Signal
  2019 offiziell für die eigene Indexierung eingestellt; sauber
  crawlbare `<Link>`-Pagination plus Canonical pro Seite ist der aktuelle
  Best-Practice-Ersatz.
- **`FAQPage`-Schema.org**: entfällt, da es keine FAQ-Inhalte im Produkt
  gibt, an die es sich anheften ließe.
- **Rechtsseiten nicht in der Sitemap**: `/impressum` und `/datenschutz`
  tragen `robots: { index: false }`, solange sie nur strukturierte
  Platzhalter sind (siehe unten) — eine Sitemap-Aufnahme wäre
  widersprüchlich zu "nicht indexieren".

### Analytics: `@vercel/analytics` hinter abstrahierter `trackEvent()`

Spec §27 verlangt eine "abstrahierte Event-Funktion, sodass der Anbieter
später austauschbar bleibt" — konkret umgesetzt mit `@vercel/analytics`
(kostenlos, kein API-Key, cookie-frei), da es ohne Zusatzkosten sofort
funktioniert und zur Zielplattform Vercel (Spec §4) passt. Zwei dünne
Wrapper mit identischer Signatur `trackEvent(name, props?)`:
`lib/analytics/client.ts` (Client Components) und
`lib/analytics/server.ts` (Server Actions/Route Handler) — beide importieren
aus dem gemeinsamen `lib/analytics/events.ts`-Vokabular. Ein Wechsel des
Anbieters würde nur diese zwei Dateien betreffen, keine Call-Sites.
Bewusst nicht jedes Spec-§27-Beispielereignis verdrahtet: `content_opened`
und `filter_applied` wurden ausgelassen, weil `<Analytics/>` Pageviews
ohnehin automatisch trackt und beides sonst redundant zu jedem Seitenaufruf
wäre.

### Cookie-Consent gilt auch für ein cookie-freies Analytics-Tool

`@vercel/analytics` selbst setzt keine Cookies. Die Bauplan-Vorgabe "nur
notwendige Cookies vor Einwilligung" wird trotzdem konservativ ausgelegt:
`<Analytics/>` wird im Root-Layout erst gerendert, wenn das
`famvaya-consent`-Cookie (`lib/consent.ts`) auf `"accepted"` steht. Das
Banner (`components/cookie-consent.tsx`) setzt dieses eine technisch
notwendige Cookie über eine Server Action; "Cookie-Einstellungen" im
Footer löscht es wieder und zeigt das Banner erneut.

### Rechtsseiten als ausdrücklich gekennzeichnete Platzhalter

`/impressum` und `/datenschutz` sind laut Spec bewusst **keine**
anwaltlich geprüften Endfassungen, sondern strukturierte Platzhalter mit
Lückentext (`[Firmenname]` etc.) — jede Seite trägt einen sichtbaren
Hinweisbanner, der das explizit sagt, plus `robots: { index: false }`.

### Tests: Vitest statt Playwright für Redirect/Berechtigungen/Formulare

Spec §34 verlangt Tests für "externe Weiterleitung", "Berechtigungsprüfung"
und "Formularvalidierung". Statt neuer E2E-Tooling (Playwright +
Browser-Installation) wurde die jeweilige Entscheidungslogik in reine,
mockfreie Funktionen extrahiert und mit Vitest getestet — gleiche
Konvention wie die vier bestehenden `lib/*.test.ts`:
- `lib/redirect.ts` (`resolveRedirectTarget()`) — aus der `/go/`-Route
  herausgezogen, die Route ruft die Funktion jetzt nur noch auf.
- `lib/roles.ts` (`canAccessAdmin()`, `isAdmin()`) — aus
  `requireAdminOrEditor()`/`requireAdmin()`/`canPreview()` herausgezogen,
  `lib/auth.ts` nutzt sie jetzt statt dreifach duplizierter
  Rollen-Vergleiche.
- `lib/form-utils.test.ts` — deckt die in Phase 5 gebauten, bis dahin
  ungetesteten Formular-Parsing-Helfer ab.
Ein echtes Playwright-Setup bleibt ein sauberer Folge-Schritt, ist aber
kein neuer Pflichtbestandteil des Projekts (Grundsatz seit Phase 0:
minimale Tooling-Fläche, siehe Node-ohne-Homebrew- und
Docker-freie-Supabase-Entscheidungen oben).

### Seed-Daten auf Spec-§29-Mindestmengen aufgefüllt

`supabase/seed.sql` enthielt bis Phase 6 nur den reduzierten Phase-0-Umfang
(3/3/3/0). Ergänzt auf 12 Unterkünfte, 12 Aktivitäten, 15 Mikro-Abenteuer
und 6 Magazinartikel (Titel wörtlich aus Spec §17 übernommen) — nötig,
damit die in dieser Phase gebaute Pagination überhaupt sichtbar wird. Neue
Inhalte nutzen bewusst dieselben Länder/Regionen/Typen/Kategorien wie
Phase 0 statt neuer Geografie — Ziel war Content-**Menge**, nicht neue
Referenzdaten-Vielfalt. `author_id` bleibt bei allen sechs Artikeln `NULL`
(kein fester Seed-Nutzer verfügbar, da echte Nutzer nur per Auth-Flow
entstehen) — die Magazin-Detailseite blendet die Autorenzeile aus, wenn
kein Autor gesetzt ist.

### Kein echtes Deployment

"Deployment auf Vercel dokumentiert" (Bauplan-DoD) wurde als
README-Anleitung umgesetzt (Env-Vars, Migrationsreihenfolge,
Analytics-Dashboard-Hinweis), nicht als tatsächlich ausgeführter
`vercel deploy` — das wäre ein Produktions-Push auf eine geteilte
Plattform ohne expliziten separaten Auftrag.

### Lighthouse/WCAG: Code-Härtung statt automatisierter Prüfung

Umgesetzt: Skip-Link, `sizes`-Prop auf allen Grid-/Hero-Bildern (verhindert
überdimensionierte Downloads), einfache Sicherheits-Header, vorhandene
`aria-label` auf Icon-only-Buttons verifiziert. Keine automatisierte
Lighthouse-/axe-Prüfung — bräuchte entweder neue Tooling-Abhängigkeit oder
eine laufende Deployment-URL, beides außerhalb des bisherigen
Projekt-Rahmens.

## Phase 7: Family Matcher, Fit Score, Bilder, Reality Check, Zero-Result-Insights

Basiert auf einem externen "Phase 2 – Vision schärfen"-Dokument (eigene
Roadmap-Nummerierung, unabhängig von diesem Bauplan) — hier als **Phase 7**
dieses Repos dokumentiert, um Kollision mit der bereits vergebenen
"Phase 2"/"Phase 3" oben zu vermeiden.

### Kapazitätsfilterung nur für Unterkünfte

Nur `accommodations` hat Kapazitätsspalten (`max_guests`, `max_children`,
`bedrooms`); `activities`/`micro_adventures` haben keine. Diese künstlich
nachzubilden (neue Spalten, die niemand befüllt) wäre eine weitere
"Demo-Hülle" — genau das, was das Vision-Dokument vermeiden will. Der
Schnell-Check auf der Startseite leitet für Aktivitäten/Mikro-Abenteuer
weiterhin ohne Kapazitätsfilter weiter (unverändert). Alle drei Bereiche
sowie die globale Suche protokollieren jetzt aber konsistent Suchen ohne
Ergebnis (`search_events`, siehe unten).

### Family Fit Score bleibt manuell editierbar, wurde aber sichtbar gemacht

Das Vision-Dokument erlaubt ausdrücklich eine "einfache gewichtete Formel"
als Startlösung, macht sie aber nicht zur Pflicht ("kann ... berechnet
werden"). Eine Formel aus nur drei Feldern (Personen/Zimmer/Preis) wäre
einer manuellen, recherchierten Einschätzung unterlegen — die passt exakt
zum "echte kuratierte Angebote"-Prinzip aus Aufgabe 6 (Content-Rollout).
Stattdessen: `family_rating` existiert jetzt auch auf `micro_adventures`
(bisher nur `accommodations`/`activities`), und eine neue
`FamilyFitBadge`-Komponente zeigt den Score auf allen drei Kartentypen
zusätzlich zur bisherigen Detailseiten-Anzeige — dort jetzt als "FamVaya
Family Fit" gebrandet plus erklärendem Text zu den Kriterien.

### Nicht ausreichend Platz wird weiterhin ausgeblendet, nicht separat markiert

Die Spec erlaubt beide Varianten ("werden ausgeblendet oder klar
markiert"). Ein Umbau auf "anzeigen + markieren" hätte die bestehende,
funktionierende Pagination-/Sortierlogik der drei Übersichtsseiten
angefasst — unverhältnismäßiger Aufwand für den Nutzen in dieser Phase.

### Reality Check als text[]-Spalten, gleiches Muster wie `materials`

`pros`/`cons` (`text[] not null default '{}'`) auf allen drei
Content-Typen, manuell im Admin gepflegt (kommagetrennte Textareas,
gleicher `commaSeparatedList()`-Helper wie bei `materials`/`seasonal_tags`
seit Phase 0/5). Keine Automatisierung — passt zum Prinzip "klein und
kuratiert starten" aus Aufgabe 6.

### 22 Stockfotos werden pro Kategorie mehrfach wiederverwendet

45 Einträge (12 Unterkünfte + 12 Aktivitäten + 15 Mikro-Abenteuer + 6
Artikel), aber nur 22 lizenzfreie Stockfotos lokal vorhanden. Fotos wurden
per Dateinamen-Keyword einer Kategorie zugeordnet und dann per Round-Robin
innerhalb der Kategorie mehrfach verwendet, statt teure Einzelbeschaffung
vorwegzunehmen. Explizit eine Übergangslösung, bis echte Anbieterfotos
über den Admin-Bereich eingepflegt werden (Aufgabe 6) — entsprechender
Hinweis steht im README.

### Nur noch ein Supabase-Projekt aktiv (Prod)

Seit Phase 6 gab es Dev- und Prod-Projekt getrennt. Das Dev-Projekt
(`tigprtokhjzhrtenglgs.supabase.co`) ist inzwischen pausiert, weil der
kostenlose Supabase-Projektplatz für ein anderes Projekt (Matchletics)
gebraucht wurde — `npm run dev` funktioniert lokal daher aktuell nicht
gegen eine echte Datenbank, bis ein neues Dev-Projekt aufgesetzt wird.
Migration `0017` sowie das Foto-Upload-Skript liefen daher ausschließlich
gegen Prod.

### Foto-Upload direkt gegen Produktionsdatenbank ausgeführt

Das Umbiegen der `media.storage_path`-Fake-Pfade auf echte Storage-URLs
erforderte echte Storage-API-Aufrufe (kein SQL-Editor-Weg), wurde also per
Node-Skript mit dem Prod-`service_role`-Key direkt ausgeführt — nach
expliziter Nutzer-Bestätigung, da es sich um einen direkten Schreibzugriff
auf die Produktionsdatenbank außerhalb der Anwendung handelt. Das Skript
selbst ist bewusst kein Repo-Bestandteil (liegt nur im privaten
Scratchpad), analog zum bereits etablierten Admin-Bootstrap-Skript-Muster
aus der Deployment-Phase.

## Phase 8: Vergleichsfunktion + i18n-Grundgerüst

Basiert auf einem externen "Phase 3 – Erweiterung"-Dokument (eigene
Roadmap-Nummerierung, wie schon das "Phase 2"-Dokument aus Phase 7) — hier
als **Phase 8** dieses Repos dokumentiert.

### Nur Aufgabe 1 (Vergleich) und Aufgabe 5 (i18n-Grundgerüst) umgesetzt

Das Dokument selbst setzt als Voraussetzung "mindestens 20–30 echte
kuratierte Angebote im System" — eine Prüfung zeigte 0 echte Einträge
(alle 80 Content-Zeilen tragen noch das `[Demo]`-Präfix). Aufgabe 2
(Inspirationsmodus) und 3 (Trip Builder) benennt das Dokument selbst als
"lohnt sich erst richtig ab ca. 100+ kuratierten Angeboten"; Aufgabe 4
(Sponsored Listings) soll laut Dokument "auf Eis gelegt werden, bis erste
Partner-Anfragen real eintreffen" — beides aktuell nicht gegeben. Nur
Aufgabe 1 ("unabhängig, schneller Nutzwert") und Aufgabe 5 ("technische
Vorbereitung, kein Zeitdruck") sind nicht an diese Voraussetzungen
geknüpft und wurden umgesetzt.

### Vergleichsfunktion: neuer globaler Client-Context statt Server-State

Erster React-Context-Provider im Projekt (`components/compare/compare-context.tsx`,
`CompareProvider`/`useCompare()`) — bisher ausschließlich Server Components
+ einzelne "use client"-Inseln. Der Vergleichs-"Warenkorb" (bis zu 4
Einträge, `accommodation`/`activity`) ist bewusst rein client-seitig
(`localStorage`, Key `famvaya-compare`), kein Login, kein neues
DB-Schema — passt zur Anforderung "technisch am einfachsten". Teilbarkeit
läuft über einen Query-Parameter (`/vergleichen?items=accommodation:id,activity:id`),
nicht über eine zusätzliche "Link kopieren"-Funktion, da die URL selbst
schon der teilbare Link ist. Die reinen Parse-/Serialisierungsfunktionen
(`lib/compare.ts`) liegen bewusst in einer eigenen Datei ohne
`"use client"`, damit sie sowohl aus dem Server Component
`app/vergleichen/page.tsx` als auch aus den Client-Komponenten importiert
werden können.

### "Entfernung" nicht in der Vergleichstabelle

`latitude`/`longitude` existieren auf `accommodations`/`activities`, sind
aber nirgends im App-Layer verdrahtet, und es gibt keine
Standort-Eingabe des Nutzers (kein Geolocation-Feature, keine
PLZ-Umkreissuche). Eine echte Entfernungsanzeige würde eine neue, hier
nicht angeforderte Standort-Funktion voraussetzen. Die Tabelle zeigt
stattdessen Stadt/Land als Kontext-Zeile ("Ort").

### "Kostenlose Leistungen/Rabatte" aus vorhandenen Feldern abgeleitet

Bei Aktivitäten aus `family_ticket`/`large_family_discount` (bereits
vorhanden). Unterkünfte haben kein strukturiertes Rabatt-Feld — die Zeile
zeigt dort "–" statt einer erfundenen Angabe, statt ein neues Schema-Feld
nur für diese eine Tabellenzeile einzuführen.

### Compare-Toggle als dritter Badge-Slot, kein Karten-Umbau

`AccommodationCard`/`ActivityCard` sind komplett in `<Link>` gewrappt
(kein Präzedenzfall für verschachtelte interaktive Elemente — `FavoriteButton`
lief bisher nur standalone auf Detailseiten). Der neue `CompareToggle`
sitzt als dritter `absolute`-positionierter Button (unten rechts über dem
Bild, neben dem bestehenden Badge oben links und der `FamilyFitBadge`
oben rechts aus Phase 7) mit `preventDefault()`/`stopPropagation()` im
Klick-Handler, statt die Karten auf einen komplizierteren
Teil-Link-Aufbau umzubauen.

### i18n-Grundgerüst: Prüfung + Dokumentation statt Schein-Implementierung

Das Datenmodell (`countries`/`regions`, `country_id`/`region_id`-FKs auf
allen Content-Tabellen) ist bereits sauber pro Markt trennbar — keine
Änderung nötig. Der einzige echte Markt-Kopplungspunkt sind die
Rechts-Platzhalterseiten `/impressum` und `/datenschutz`, die explizit
deutsches Recht zitieren (§ 5 TMG, § 55 RStV) — vor einem echten
Österreich-Launch bräuchten diese eine Länder-Variante (z. B.
`/impressum?land=at` oder eine eigene Route), das Dokument verlangt aber
ausdrücklich "keine neuen Länder live schalten", daher wird das hier nur
dokumentiert, nicht gebaut. Bewusst **keine** Dictionary-/
Übersetzungs-Infrastruktur eingebaut (z. B. `next-intl` + `app/[locale]/`-
Segmente), die nur für ein einziges aktives Sprachpaar (Deutsch)
verdrahtet und ungenutzt bliebe — das wäre eine Halb-Implementierung ohne
echten Nutzen. Empfohlener Weg für später, sobald eine zweite Sprache
tatsächlich ansteht: `next-intl` mit `app/[locale]/`-Segment-Struktur,
Dictionaries unter `messages/de.json`/`messages/en.json` o. Ä.;
`lib/format.ts` `formatPrice()` müsste dann die aktuell fest codierte
Locale `"de-DE"` durch die aktive Locale ersetzen (heute unkritisch, da
nur Deutsch aktiv ist und Österreich ebenfalls EUR nutzt).

## Phase 9: Politur & Vertrauen

Basiert auf einem externen "Phase 2.5 – Politur & Vertrauen"-Dokument —
einem Review der Live-Seite durch ein anderes Claude-Modell ohne Kenntnis
der bisherigen Entscheidungen dieses Repos. Vor der Umsetzung wurde jeder
der 6 gemeldeten Punkte live auf famvaya.com und im Code nachgeprüft statt
blind übernommen — Ergebnis:

- **Bilder auf Karten**: nicht reproduzierbar (Startseite, Kategorie- und
  Filterseiten zeigten beim Nachprüfen überall echte Fotos, inkl.
  Netzwerk-Request-Kontrolle) — vermutlich ein veralteter Befund von vor
  dem Foto-Fix in Phase 7. Keine Änderung vorgenommen.
- **Reality Check**: Code existierte bereits seit Phase 7
  (`components/reality-check.tsx`), nur alle Demo-Einträge hatten leere
  `pros`/`cons`-Arrays. Über ein Datenskript befüllt, kein neuer Code.
- **Matcher-Filterung, CTA-Button, Preis-Aufschlüsselung, Bild-Mismatch**:
  echte Probleme, siehe unten.

### "Geeignet für"-Label auf echte Kapazität umgestellt statt Filter "repariert"

Der gemeldete Filter-Bug existierte nicht — `minGuests`/`minChildren`
wurden korrekt gesetzt, gelesen, gefiltert und im Formular vorausgefüllt
(nachgewiesen mit `?minGuests=7&minChildren=5` gegen die echte
Produktionsdatenbank). Das tatsächliche Problem: Die Karten-Zeile
"Geeignet für X Erwachsene + Y Kinder" nutzte `example_family_size` (ein
Freitext-Feld ausschließlich für die Preisbeispiel-Zeile gedacht), nicht
`max_adults`/`max_children` (die tatsächliche, gefilterte Kapazität) —
bei "[Demo] Familienhotel Nordseestrand" z. B. Label "3 Kinder" bei
tatsächlich `max_children = 5`. Ergebnis wirkte dadurch "falsch gefiltert",
obwohl der Filter korrekt arbeitete. Fix: Kartenlabel berechnet sich jetzt
aus `max_adults`/`max_children`, `example_family_size` bleibt nur in der
Preiszeile ("Beispielpreis für ...").

### CTA-Button: immer sichtbar, deaktiviert mit Tooltip statt interne Demo-Weiterleitung

Der Button-Code (inkl. `/go/`-Tracking) existierte bereits auf allen drei
Detailseiten-Typen, wurde aber nur gerendert, wenn `affiliate_url`/
`external_url` gesetzt war — das traf auf keinen der 12 Demo-Einträge zu,
der Button war auf der kompletten Live-Seite unsichtbar. Das Dokument
erlaubt zwei Lösungen (interne Demo-Hinweis-Seite oder deaktivierter
Button mit Tooltip). Gewählt: immer sichtbar, bei fehlendem Link
`disabled` + `title="Demo-Eintrag, noch kein Anbieter verlinkt"` — eine
interne Weiterleitung mit vorgetäuschtem Tracking-Klick hätte echte und
Demo-Klicks in `outbound_clicks` vermischt. Die Tracking-Infrastruktur ist
fertig und läuft automatisch an, sobald echte Links im Admin eingetragen
werden — kein zusätzlicher Code nötig.

### Preis-Aufschlüsselung mit minimalem Schema-Zuwachs

Neue Spalten `example_nights` (für Preis/Nacht) und `value_tier`
(manuelles Freitext-Tier, gleiches Muster wie `micro_adventures.cost_level`).
Preis/Person nutzt bewusst das bereits vorhandene `max_guests`
(Vollauslastung) statt eines weiteren neuen Personenzahl-Felds nur für
diese eine Beispielrechnung — das Frontend beschriftet diesen Wert explizit
als "bei Vollauslastung (N Personen)", um nicht denselben
Anzeige-vs-tatsächliche-Bedeutung-Fehler wie beim "Geeignet für"-Label zu
wiederholen.

### Bild-Mismatch: Fotozuordnung für Unterkünfte auf tatsächlich passende Gebäudefotos reduziert

Direkte Bildprüfung (nicht nur Dateiname) ergab: Von den vier in Phase 7
der Kategorie "Unterkunft" zugeordneten Fotos zeigen nur `cottages-7598056`
(Berg-Chalets) und `barn-2594975` (Hütte am Abend) tatsächlich Gebäude.
`north-4756774` (Polarlicht-Nachthimmel) und `south-tyrol-3010031`
(Wandergruppe in den Bergen) sind Landschafts-/Personenfotos ohne jedes
Gebäude und wurden fälschlich als Unterkunfts-Titelbilder verwendet (z. B.
bei "Familienhotel Nordseestrand"). Fix: Unterkünfte nutzen jetzt
ausschließlich die zwei echten Gebäudefotos (nach `accommodation_type`
gewählt), die beiden freiwerdenden Landschaftsfotos wandern in den
Aktivitäten-Pool, wo Wander-/Nachthimmel-Motive inhaltlich passen. Mit nur
zwei Gebäudefotos für 12 Unterkünfte bleibt Mehrfachverwendung nötig
(unverändert gegenüber der Phase-7-Übergangslösung), aber kein Eintrag
zeigt mehr ein komplett unpassendes Motiv.

### Reality-Check-Inhalte und Preisfelder direkt gegen Prod geschrieben

Reine Daten-Updates auf bereits bestehende Spalten (kein Schema-Wechsel),
analog zum Foto-Upload-Skript aus Phase 7 — nach expliziter
Nutzer-Bestätigung direkt ausgeführt, nicht über den SQL Editor.

## Phase 10: Preisdarstellung als Richtwert

Basiert auf einem externen "Phase 2.5 Fortsetzung + Admin & Reporting"-
Dokument mit drei Teilen (A: offene Fixes, B: Preisdarstellung, C:
Admin-Reporting).

### Teil A bereits vollständig gelöst — mit Live-Beleg

Alle drei gemeldeten Punkte wurden vor jeder Codeänderung live auf
`famvaya.com` nachgeprüft: Der Matcher-Filter funktioniert korrekt
(`?minGuests=2&minChildren=5` schließt zu kleine Unterkünfte nachweislich
aus — der noch nicht gepushte Phase-9-Commit behebt zusätzlich die
zugrunde liegende Label-Verwirrung), Bilder laden auf allen geprüften
Listenseiten, Reality Check zeigt echten Inhalt. Keine weitere
Codeänderung für Teil A in dieser Phase.

### Teil C (Admin-Reporting) bewusst auf eine spätere, eigene Phase verschoben

Das Dokument selbst kennzeichnet Teil C als "am umfangreichsten, kann in
eigenen Etappen laufen". Echtes Besucher-/Verweildauer-Tracking (C1)
bräuchte eine neue Datenquelle — Vercel Analytics ist von der App aus
nicht abfragbar, das wäre eine eigene Architekturentscheidung. Wird nicht
in dieser Phase mitgeplant, um sie nicht künstlich aufzublähen.

### Gerundeter Bereich statt Einzelwert oder Fixpreis

FamVaya ist ein Empfehlungs-, kein Buchungsportal — ein centgenauer Preis
suggeriert Verbindlichkeit, die es nicht gibt. Neue Funktion
`formatPriceEstimate()` (`lib/format.ts`) rundet auf eine Schrittweite
(gestuft nach Betragsgröße) und zeigt einen Bereich (z. B. 1.487 € → "ca.
1.450–1.550 €") statt eines einzelnen Fixpreises — kommuniziert die
Unverbindlichkeit deutlicher als nur ein gerundeter Einzelwert. Rein eine
Anzeige-Funktion: Der gespeicherte Wert bleibt exakt, u. a. weil
`estimated_total_cost` bei Mikro-Abenteuern auch vom Finder-Filter
verwendet wird — nur die Darstellung rundet, nicht die Datenbasis.

### Nur illustrative Beispielpreise betroffen, nicht `price_from`/`adult_price`/`child_price`

`price_from` ("ab 199 €") und die Erwachsenen-/Kinderpreise bei
Aktivitäten sind bereits als Anbieter-Einzelpreise gekennzeichnet, nicht
das vom Dokument kritisierte "centgenau wirkende" Element (der
Gesamt-Beispielpreis). Bleiben unverändert bei `formatPrice()`.

### `price_checked_at` als neue, dedizierte Spalte statt `updated_at`

`updated_at` ändert sich bei jeder Bearbeitung (auch z. B. am
Reality-Check-Text) — das würde ein falsches "Stand:"-Datum für den Preis
suggerieren. Neue Spalte auf allen drei Content-Typen, manuell im Admin
gepflegt (gleiches Date-Input-Muster wie `expires_at`).

### CTA-Text-Änderung nur bei Unterkünften und Aktivitäten

Mikro-Abenteuer sind größtenteils kostenlose DIY-Ideen ohne echtes
Buchungs-/Preiskonzept — "Preis & Verfügbarkeit beim Anbieter prüfen"
passt inhaltlich nicht zu z. B. "Sterne beobachten im Garten". Der
bestehende Text "Mehr erfahren" bleibt dort unverändert.

### Mikro-Abenteuer bekommen keine neue Preis-Sektion

Dort gibt es aktuell nur ein Inline-Badge (`estimated_total_cost`/
`cost_level`), keine dedizierte Preis-Sektion wie bei den anderen beiden
Typen — nur der Zahlenwert im Badge wird gerundet (`formatPriceEstimate()`),
der Rest bleibt strukturell unverändert.

## Phase 11: Instagram-Post-Generator

Neuer Admin-Wunsch: aus Inseraten automatisch fertige Instagram-Posts
erzeugen und direkt veröffentlichen können. Zerfällt in einen sofort
baubaren Teil (Bild+Text-Generator) und einen Teil mit harter externer
Abhängigkeit (Direkt-Posting über die Meta/Instagram-Graph-API, die ein
selbst eingerichtetes Instagram-Business-Konto voraussetzt). Der Nutzer
hat noch kein Instagram-Business-Konto — auf Nutzerwunsch wird die
Publish-Anbindung trotzdem jetzt schon gebaut, aber inaktiv gehalten
(gleiches Muster wie die bestehende Resend-Anbindung).

### Bildgenerierung über `next/og` statt externem Dienst

`ImageResponse` ist seit Next.js 13 fest im Framework enthalten (kein
neues npm-Paket). Rendert ein JSX-Template serverseitig zu einem
1080×1080-PNG (Instagram-Quadratformat) — Titelbild als Hintergrund,
Verlaufs-Overlay unten für Lesbarkeit, Titel/Ort/Richtwert/Family-Fit als
Text, FamVaya-Wortmarke oben links. Markenfarben aus `app/globals.css`
sind als feste Hex-Werte dupliziert, da Satori (der Renderer hinter
`ImageResponse`) weder Tailwind-Klassen noch CSS-Variablen verarbeitet.

### Generierte Bilder nicht über `content_media` verknüpft

`instagram_posts.media_id` zeigt auf eine eigene `media`-Zeile, die
bewusst **nicht** über `content_media` mit dem Inserat verknüpft wird —
es ist eine abgeleitete Werbegrafik (Titelbild + Textüberlagerung), kein
Content-Foto. Sie soll nicht in der Foto-Galerie oder der
Titelbild-Auswahl des Inserats auftauchen.

### Ein gemeinsames Bild-/Caption-Template für alle vier Content-Typen

`lib/instagram/content-mapping.ts` bildet Unterkunft/Aktivität/
Mikro-Abenteuer/Magazinartikel auf dieselbe normalisierte Zwischenform ab
(`PostImageInput`/`PostCaptionInput`), statt vier eigenständige Templates
zu pflegen. Unterkünfte/Aktivitäten zeigen Richtwert + Ort + Family Fit;
Mikro-Abenteuer zeigen Kostenniveau statt Preis (meist kostenlose
DIY-Ideen); Magazinartikel zeigen Kategorie statt Preis/Fit.

### Instagram-Graph-API vorbereitet, aber inaktiv (wie Resend)

`lib/instagram/graph-api.ts` implementiert den echten Zwei-Schritt
Content-Publishing-Flow (Media-Container anlegen, dann veröffentlichen),
liest `INSTAGRAM_ACCESS_TOKEN`/`INSTAGRAM_BUSINESS_ACCOUNT_ID` aus der
Umgebung. Ohne diese Werte bleibt der "Jetzt bei Instagram posten"-Button
im Admin deaktiviert mit Tooltip — exakt das gleiche UX-Muster wie der
Anbieter-CTA-Button bei Demo-Einträgen ohne Affiliate-Link (Phase 9).
Metas Graph-API-Version/Anforderungen ändern sich gelegentlich — bei der
tatsächlichen Einrichtung sollte der Nutzer die aktuelle Meta-Dokumentation
gegenprüfen, die hier implementierte Version ist ein bester aktueller
Stand, keine Garantie.

### Kein echtes Scheduling in dieser Phase

"Direkt schaltbar" wurde als sofortiger Ein-Klick-Publish-Vorgang
umgesetzt, nicht als Warteschlange mit Zukunftsdatum. Eine echte
zeitversetzte Veröffentlichung bräuchte eigene Cron-Infrastruktur (z. B.
Vercel Cron) — ein eigenes, größeres Feature für eine spätere Phase, kein
Teil des ursprünglichen Wunsches ("direkt ... schaltbar").

### Eigener Admin-Bereich statt Einbettung in die vier CRUD-Formulare

`/admin/instagram` (Übersicht) + `/admin/instagram/neu` (Generieren) +
`/admin/instagram/[id]` (Vorschau/Bearbeiten/Veröffentlichen) als
eigenständiger Workflow, erreichbar über einen neuen "Instagram-Post"-Link
in den vier bestehenden Content-Listen (`ContentTable`). Die bestehenden
CRUD-Formulare bleiben unangetastet.

## Phase 12: Besucher- & Nutzungs-Reporting im Admin-Bereich

Wunsch: sehen, wie viele Personen auf die Seite kommen, woher sie kommen,
wie lange sie bleiben und was sie sich ansehen — direkt im eigenen
Admin-Bereich statt nur auf vercel.com. Entspricht Teil C1 des früheren,
bewusst zurückgestellten "Admin & Reporting"-Dokuments.

### First-party Erfassung ergänzt Vercel Analytics, ersetzt es nicht

Vercel Web Analytics läuft seit Phase 6 bereits und liefert Besucher/
Seitenaufrufe/Referrer kostenlos im Vercel-Dashboard — aber nicht
abfragbar innerhalb von `famvaya.com/admin`, und ohne Sitzungsdauer. Die
Überschneidung wird bewusst in Kauf genommen; der Mehrwert der neuen
`page_views`-Tabelle ist Abfragbarkeit im eigenen Admin-Bereich
(vereinheitlicht mit Zero-Result-Insights, Matcher-Nutzung, Newsletter)
plus eine Sitzungsdauer-Näherung, die Vercel nicht liefert.

### Sitzungs-ID über `sessionStorage`, nicht über ein Cookie

Der Cookie-Consent-Banner verspricht wörtlich "Anonyme, **cookie-freie**
Nutzungsstatistiken" (`components/cookie-consent.tsx`). Ein neues
Tracking-Cookie hätte diese Aussage falsch gemacht. `sessionStorage` wird
nie an den Server übertragen und setzt sich pro Tab/Sitzung ohnehin
zurück — hält die bestehende Zusage wörtlich ein und reicht für eine
Sitzungsdauer-Näherung.

### Sitzungsdauer ist eine Näherung, keine exakte Messung

Berechnet aus der Differenz zwischen erstem und letztem Seitenaufruf pro
Sitzung (`lib/data/analytics.ts#getVisitorStats`). Eine exakte "Time on
Page"-Messung bräuchte unzuverlässige `beforeunload`-Events oder
Heartbeat-Pings — unverhältnismäßiger Aufwand. Admin-UI beschriftet den
Wert entsprechend als "Ø Sitzungsdauer (Näherung)".

### Tracking nur nach Cookie-Zustimmung

`components/visitor-tracker.tsx` wird in `app/layout.tsx` im selben
`consent === "accepted"`-Block gerendert wie `<Analytics/>` — keine neue
Einwilligungs-UI nötig, nur derselbe bestehende Schalter für eine zweite
Komponente.

### Matcher-Nutzungsstatistik als eigene, kleine Tabelle

`matcher_submissions` statt Wiederverwendung von `search_events`: Der
Schnelle Familien-Check (`components/quick-family-check.tsx`) wurde bisher
gar nicht geloggt (nur Zero-Result-Fälle auf der Zielseite, nicht die
Eingabe selbst), und `search_events` hat eine andere, bewusst enger
gefasste Semantik ("Suchen ohne Treffer") — die soll nicht vermischt
werden. Kein Consent-Gate nötig, da nur Zahlen + Kategorie gespeichert
werden, keine Kennung.

### Aggregation clientseitig in JS statt per SQL GROUP BY

`lib/data/analytics.ts` holt Rohdaten für den gewählten Zeitraum und
aggregiert in JavaScript, statt eine Postgres-Funktion zu schreiben —
beim aktuellen Traffic-Volumen unproblematisch und einfacher zu warten.
Bei deutlich mehr Zeilen wäre eine SQL-Aggregation der nächste
Optimierungsschritt.

### Zero-Result-Insights nicht dupliziert

Die neue Nutzungs-Seite (`/admin/nutzung`) verlinkt auf die bestehende
`/admin/such-insights`-Seite (seit Phase 7), statt deren Inhalt zu
duplizieren.

### Teil C2–C4 weiterhin zurückgestellt

Monetarisierungs-Reporting, Content-Moderationsbereich und technisches
Monitoring aus dem ursprünglichen Dokument sind nicht Teil dieses
Wunsches (der sich explizit auf Besucher/Quelle/Dauer/Inhalte bezog) und
bleiben für eine mögliche spätere Phase offen.
