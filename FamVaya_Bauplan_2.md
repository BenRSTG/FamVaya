# FamVaya – Phasen-Bauplan für Claude Code

Ein Fahrplan, der die Spec in 7 abgeschlossene Bau-Etappen schneidet. Leitprinzip: **erst ein vollständiger vertikaler Slice (eine Inhaltsart end-to-end), dann replizieren.** Jede Phase endet mit einem lauffähigen, testbaren Zustand. Nach jeder Phase committen und die App starten, bevor die nächste beginnt.

---

## Vorab: zwei Entscheidungen, die Claude Code nicht für dich treffen soll

**1. Polymorph vs. getrennte Tabellen.**
Die Spec nutzt durchgängig `content_type` + `content_id`. Empfehlung für die schlanke Erstversion:
- **Logging-Tabellen** (`outbound_clicks`, `search_events`): polymorph lassen. Kein FK nötig, hohes Volumen, Integrität unkritisch.
- **Favoriten, Media, Tags:** hier tut fehlende referenzielle Integrität später weh. Für den MVP trotzdem polymorph bauen (weniger Tabellen, schneller), **aber** mit einem `CHECK`-Constraint auf ein `content_type`-Enum absichern und die Entscheidung im `DECISIONS.md` dokumentieren. Falls es Bugs macht, in Phase 5 auf getrennte Join-Tabellen umstellen.

Das ist die pragmatische Wahl für Validierung-zuerst. Wichtig ist nur, dass es *bewusst* entschieden ist.

**2. Content-Beschaffung ist nicht Teil dieses Plans.**
Der Code ist der einfache Teil. Parallel zum Bau brauchst du echte Unterkünfte/Aktivitäten mit funktionierenden Affiliate-Links. Halte dafür ein separates Dokument. Der Plan hier liefert die Maschine, nicht den Treibstoff.

---

## Phase 0 – Fundament & Datenmodell
**Ziel:** DB läuft, Seed lädt, Design-Tokens stehen, App startet lokal.

- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui aufsetzen
- Supabase-Projekt, `.env.example`, Migrations-Setup
- Vollständiges Schema aus Spec-Abschnitt 20 als Migration (alle Tabellen, FKs, Indizes, Enums, RLS-Grundgerüst noch offen)
- Design-Tokens als CSS-Variablen aus Abschnitt 5 (Korallrot/Terrakotta, Gelb, Creme, Petrol) + Radius/Schatten
- Minimale, aber *echte* Seed-Daten: 3 Unterkünfte, 3 Aktivitäten, 3 Mikro-Abenteuer, Kategorien, Regionen, Ausstattung, Altersgruppen — klar als Demo gekennzeichnet
- README mit Start-, Migrations- und Seed-Befehlen; `DECISIONS.md` anlegen

**Definition of Done:** `npm run dev` startet, Migration läuft durch, Seed befüllt die DB, Tokens sind im Theme sichtbar.
**Nicht in dieser Phase:** UI-Seiten, Auth, Admin.

---

## Phase 1 – Vertikaler Slice: Familienunterkünfte end-to-end
**Ziel:** Eine Inhaltsart komplett durchspielen und damit den ganzen Stack derisken, bevor du ihn dreimal baust.

- Übersichtsseite Familienunterkünfte: Liste + Grundfilter (Personen, Kinder, Schlafzimmer, Preis, Typ)
- Wiederverwendbare `AccommodationCard` (Bild, Kapazität, „geeignet für 2 Erw. + 4 Kinder", Badge, Merken-Button)
- Detailseite mit sprechender URL inkl. **FamVaya-Familiencheck** und **Großfamilien-Score** (Logik aus Abschnitt 21, redaktionell eingegeben, Score 0–100 mit Labels)
- Affiliate-Redirect-Route `/go/[contentType]/[contentId]`: Klick loggen → Link laden → weiterleiten, mit sichtbarer Affiliate-Kennzeichnung
- Preislogik aus Abschnitt 22 (Gesamtpreis-Beispiele, Fallback „Preis beim Anbieter prüfen")

**Definition of Done:** Unterkünfte durchsuchen, filtern, Detail öffnen, Familiencheck sehen, extern klicken — Klick landet in `outbound_clicks`.
**Nicht in dieser Phase:** Aktivitäten, Mikro-Abenteuer, Startseite, Login.

---

## Phase 2 – Replizieren + Startseite
**Ziel:** Vollständiges öffentliches Browse-Erlebnis über alle drei Welten.

- Slice aus Phase 1 auf **Aktivitäten** und **Mikro-Abenteuer** übertragen (Muster ist erprobt → geht schnell, aber jeweils eigene Filter/Karten/Detailfelder aus Abschnitten 9–12)
- Startseite: Hero, „Schneller Familien-Check", drei Welten-Karten, kuratierte Bereiche (per Tags/DB-Query befüllt), FamVaya-Versprechen
- Globale Navigation + mobiles Hamburger-Menü + optional Sticky Nav

**Definition of Done:** Alle drei Bereiche browsebar; Startseite lädt kuratierte Inhalte aus der DB; Mobilnavigation funktioniert.
**Nicht in dieser Phase:** Suche, Finder, Konten.

---

## Phase 3 – Globale Suche + Inspirationsfinder
**Ziel:** Entdeck-Flows funktionieren.

- Globale Suche über alle drei Welten + Magazin, gruppierte Ergebnisse, Postgres Full-Text-/Trigram-Suche für Tippfehlertoleranz
- „Lass dich inspirieren"-Finder, mehrstufig (Familiengröße → Suchart → Startpunkt → Zeit → Budget → Interessen), **regelbasiert**; Architektur so, dass später ein KI-Berater andockbar ist
- Ergebnisansicht mit Begründung „warum passt das zur Familie" pro Vorschlag

**Definition of Done:** Nutzerfluss 2 und 3 aus Abschnitt 33 laufen ohne Konto durch.
**Nicht in dieser Phase:** echte KI, Auth.

---

## Phase 4 – Auth, Familienprofil, Favoriten, Newsletter
**Ziel:** Kontofunktionen.

- Supabase Auth (E-Mail + Magic Link; Google optional)
- Familienprofil (Abschnitt 15.1) — **keine vollständigen Geburtsdaten der Kinder**, nur Altersgruppen
- Merkliste + eigene Sammlungen, Inhalte aus allen drei Welten, teilbar
- Newsletter-Anmeldung mit Double-Opt-in
- **RLS-Policies** jetzt scharf schalten und serverseitig testen

**Definition of Done:** Registrieren, Profil speichern, Favorit merken/entfernen, Liste teilen; RLS verhindert Fremdzugriff.
**Nicht in dieser Phase:** Admin.

---

## Phase 5 – Admin-Bereich & CMS
**Ziel:** Redaktion pflegt Inhalte ohne Code.

- Geschützte `/admin`-Route mit serverseitiger Rollenprüfung (`admin`, `editor`)
- Dashboard (Zählungen, Klicks, letzte Änderungen)
- CRUD für alle drei Inhaltsarten + Magazin, mit Statusworkflow (Entwurf → Prüfung → veröffentlicht → pausiert → archiviert)
- Medien-Upload (Supabase Storage), Alt-Texte, Vorschau vor Veröffentlichung, Duplizieren, Ablaufdatum
- Falls die polymorphen Relationen Probleme machen: hier auf getrennte Join-Tabellen umstellen

**Definition of Done:** Nutzerfluss 4 aus Abschnitt 33 läuft komplett; neuer Eintrag erscheint automatisch im Frontend.
**Nicht in dieser Phase:** Anbieter-Self-Service (nur Rollen/Tabellen vorbereiten).

---

## Phase 6 – Magazin, SEO, Analytics, Recht, Härtung
**Ziel:** Produktionsreif.

- Magazinbereich (Artikel, Kategorien, verwandte Inhalte)
- SEO: sprechende URLs, Meta/OG/Twitter, Canonical, Sitemap, robots.txt, Breadcrumbs, Schema.org (LodgingBusiness, TouristAttraction, Article) — **keine erfundenen Sterne/Bewertungen** in strukturierten Daten
- Analytics über abstrahierte Event-Funktion (austauschbarer Anbieter)
- DSGVO: Cookie-Consent, nur notwendige Cookies vor Einwilligung, Rechtsseiten als **klar gekennzeichnete Platzhalter** (nicht als geprüfte Endfassung)
- Tests aus Abschnitt 34: Familiengrößenfilter, Großfamilien-Score, Preisformatierung, Redirect, Berechtigungen, Formularvalidierung
- Performance: Bildoptimierung, Lazy Loading, Caching, Core Web Vitals; Barrierefreiheit WCAG 2.1 AA

**Definition of Done:** Lighthouse grün, Kern-Tests laufen, Deployment auf Vercel dokumentiert.

---

## So arbeitest du mit Claude Code durch den Plan

- **Eine Phase = eine Session = ein Commit.** Nicht zwei Phasen in einem Prompt bündeln.
- Übergib pro Phase nur den **relevanten Spec-Ausschnitt** + die Phasenbeschreibung hier, nicht die ganze 36-Punkte-Spec. Sonst verzettelt sich der Fokus.
- Beginne jede Session mit: *„Lies zuerst `DECISIONS.md` und die bestehende Ordnerstruktur, bevor du Code schreibst."*
- Ende jeder Session: *„Fasse getroffene Entscheidungen in `DECISIONS.md` zusammen."*
- Nach jeder Phase selbst die **Definition of Done** durchklicken, bevor es weitergeht. Erst wenn der Slice wirklich läuft, replizieren lassen.

---

## Realistische Reihenfolge-Logik in einem Satz

Phase 0–1 baut und beweist den Stack an **einer** Inhaltsart. Phase 2–3 macht das Produkt öffentlich benutzbar. Phase 4–5 macht es pflegbar und persönlich. Phase 6 macht es launch-fähig. Wenn du zwischendurch validieren willst, ist **nach Phase 3** der früheste sinnvolle Punkt für echte Nutzer — mit Seed- oder erstem echtem Content, ohne Konten.
