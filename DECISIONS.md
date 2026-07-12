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
