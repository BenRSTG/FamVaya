# Kickoff-Prompt – FamVaya Phase 0

> Vor dem Start: Lege die vollständige FamVaya-Produktspezifikation als Datei ins Projekt (z. B. `/docs/spec.md`), damit sich der Prompt darauf beziehen kann. Dann alles unter der Linie in Claude Code einfügen.

---

Du hilfst mir, eine Webplattform namens **FamVaya** zu bauen — eine Inspirations- und Empfehlungsplattform für Familienreisen mit dem Schwerpunkt „Familien mit drei oder mehr Kindern" (Large Families First). Die vollständige Produktspezifikation liegt unter `/docs/spec.md`.

Wir bauen in klar abgegrenzten Phasen. **Du arbeitest jetzt ausschließlich an Phase 0 (Fundament & Datenmodell).** Keine UI-Seiten, keine Auth, kein Admin — das kommt in späteren Phasen.

## Bevor du Code schreibst
1. Lies `/docs/spec.md`, insbesondere Abschnitte 4 (Stack), 5 (Design), 20 (Datenmodell), 29 (Seed-Daten).
2. Schlage mir eine Ordnerstruktur und einen konkreten Umsetzungsplan für Phase 0 vor.
3. Warte auf mein OK, bevor du mit dem Bauen beginnst.

## Stack (exakt so)
Next.js (App Router) · TypeScript · React · Tailwind CSS · shadcn/ui · Supabase (Postgres, Auth, Storage) · Zod · React Hook Form · Lucide Icons. Deployment-Ziel ist Vercel, aber in dieser Phase geht es nur um lokalen Betrieb.

## Aufgaben in Phase 0
1. **Projekt-Scaffold:** Next.js + TypeScript + Tailwind + shadcn/ui, lauffähig mit `npm run dev`.
2. **Supabase-Setup:** `.env.example` mit allen benötigten Variablen, Migrations-Ordner, klar dokumentierte Befehle.
3. **Datenmodell als Migration:** Alle Tabellen aus Abschnitt 20 der Spec, mit Fremdschlüsseln, sinnvollen Indizes und Enums (z. B. für `status`, `role`, `content_type`). Das RLS-Grundgerüst vorbereiten, aber die Policies noch offen lassen (kommen in Phase 4).
4. **Design-Tokens** als CSS-Variablen im Theme, abgeleitet aus dem bestehenden FamVaya-Logo (liegt unter `/assets/brand/FamVaya.svg`, weitere Formate im selben Ordner):
   - Primär (Petrol-Teal, aus dem Logo-Schriftzug): `#2FA4A3`
   - Sekundär (neutrales Grau, aus dem Logo-Tagline): `#7A7A7A`
   - Hintergrund (warmes Creme/Off-White): `#FBF8F3`
   - Text/Navigation (abgedunkeltes Petrol, nah am Logo-Teal): `#173B3A`
   - Ergänzend: gedeckter Sandton als Akzent für Badges (`#E4D2B4`), verwandtes Grün für Erfolgs-/Eignungszustände (`#3E8F73`)
   - Plus Tokens für Warnung/Fehler, Border, Radius, Schatten. Kein Korallrot/Gelb — das Logo ist bewusst zweifarbig, die Palette baut darauf auf statt darüber hinweg. Struktur muss einen späteren Dark Mode ermöglichen (aber nicht enthalten).
5. **Logo einbinden:** SVG aus `/assets/brand/` in die Codebasis übernehmen (z. B. `/public/brand/famvaya-logo.svg`), in Originalfarben, ohne Recolor.
6. **Seed-Daten** (klar als Demo gekennzeichnet, keine Behauptung realer Verfügbarkeit): je 3 Familienunterkünfte, 3 Familienaktivitäten, 3 Mikro-Abenteuer, dazu Kategorien, mindestens 2 Länder + Regionen, Ausstattungsmerkmale, Altersgruppen, ein Beispielanbieter.
7. **README** mit: Projektbeschreibung, Voraussetzungen, Installation, Umgebungsvariablen, Supabase-Setup, Migrationen, Seed, lokale Entwicklung.
8. **`DECISIONS.md`** anlegen und darin die getroffenen technischen Entscheidungen festhalten.

## Wichtige Entscheidung, die du übernehmen sollst
Für die querschnittlichen Relationen mit `content_type` + `content_id`:
- `outbound_clicks` und `search_events` bleiben **polymorph** ohne FK.
- `favorites`, `content_media`, `content_tags` **ebenfalls polymorph** im MVP, aber mit einem `CHECK`-Constraint gegen ein `content_type`-Enum abgesichert.
- Dokumentiere diesen Trade-off (Geschwindigkeit statt referenzieller Integrität) in `DECISIONS.md`.

## Qualität
Vollständig typisiert, keine Secrets im Frontend, saubere Trennung Server-/Client-Logik. Möglichst wenig fest codierte Inhalte — Kategorien, Regionen, Ausstattung kommen aus der DB.

## Definition of Done (Phase 0)
- `npm run dev` startet fehlerfrei.
- Migration läuft sauber durch, alle Tabellen aus Abschnitt 20 existieren.
- Seed-Skript befüllt die DB mit den Demo-Inhalten.
- Design-Tokens sind im Theme aktiv und sichtbar (z. B. auf einer minimalen Platzhalter-Startseite).
- Logo ist in der Platzhalter-Seite eingebunden und in Originalfarben sichtbar.
- README beschreibt jeden Schritt reproduzierbar; `DECISIONS.md` existiert.

## Ausdrücklich NICHT in dieser Phase
Übersichts-/Detailseiten, Karten-Komponenten, Filter, Suche, Inspirationsfinder, Authentifizierung, Familienprofil, Favoriten-Funktion, Admin-Bereich, Magazin, Affiliate-Redirects. Nur wenn es die Definition of Done erfordert, eine einzelne minimale Platzhalter-Seite, um die Tokens zu zeigen.

Fang mit dem Plan an.
