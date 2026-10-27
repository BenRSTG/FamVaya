# FamVaya – SEO- und Reichweiten-Plan

Stand: 27.10.2026. Ziel: gefunden werden, auch ohne dass jemand "FamVaya" eintippt,
und belastbare Zahlen für Gespräche mit Hotels und Anbietern aufbauen.

Ehrlichkeit vorab: Alle Suchbegriffe unten sind **Hypothesen**. Echte Suchvolumen
und Positionen liefert erst die Google Search Console (2–4 Wochen nach Einrichtung).
Bei einer neuen Domain dauert es erfahrungsgemäß 3–6 Monate, bis Inhalte für
allgemeine Begriffe gut ranken.

## 1. Technik (umgesetzt)

- Titel/Beschreibung der Startseite und der vier Übersichtsseiten mit Suchbegriffen
- Einleitungstexte auf Magazin und Mikro-Abenteuer-Übersicht
- Vorschaubild (og:image) für alle Seiten ohne eigenes Bild
- "Mehr Mikro-Abenteuer" + "Passende Tipps aus dem Magazin" auf jedem Abenteuer,
  "Passende Mikro-Abenteuer" in jedem Artikel (interne Verlinkung)
- Optionale Einbindung der Search-Console-/Bing-Bestätigung per Umgebungsvariable
  (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`)

## 2. Search Console einrichten (Aufgabe für dich, ca. 15 Minuten)

1. https://search.google.com/search-console → "Property hinzufügen" → Typ **Domain**
   `famvaya.com` (Bestätigung per DNS-TXT-Eintrag bei deinem Domain-Anbieter) **oder**
   Typ **URL-Präfix** `https://www.famvaya.com` mit Meta-Tag-Methode: den Code in
   Vercel als `GOOGLE_SITE_VERIFICATION` eintragen, neu deployen, "Bestätigen".
2. Unter "Sitemaps" `sitemap.xml` einreichen.
3. Unter "URL-Prüfung" die Startseite, `/magazin`, `/mikro-familienabenteuer` und die
   besten 3–5 Artikel prüfen → "Indexierung beantragen".
4. Dasselbe bei https://www.bing.com/webmasters (Import aus Search Console möglich).
5. Nach 2–4 Wochen: Bericht "Leistung" → welche Suchanfragen bringen Impressionen?
   Genau dort mehr Inhalt nachlegen.

## 3. Themen mit Suchabsicht (Hypothesen, Nische: 3+ Kinder)

Prinzip: je ein ausführlicher Hauptartikel (1.500+ Wörter) pro Thema, der auf passende
Abenteuer und andere Artikel verlinkt, statt vieler dünner Texte.

| Priorität | Hauptartikel (Arbeitstitel) | Suchabsicht | Verlinkt auf |
|---|---|---|---|
| 1 | Urlaub mit 4 Kindern: Planung, Kosten, Unterkunft | informativ/planend | unterkunft-grossfamilie-finden, urlaub-grossfamilie-sparen, packliste-grossfamilie |
| 1 | Was kostet ein Familienurlaub mit 3 Kindern? (ehrliche Rechenbeispiele) | informativ | urlaub-grossfamilie-sparen, nebensaison-mit-kindern |
| 1 | Ferienhaus oder Ferienwohnung für 7 Personen: worauf achten | vergleichend | ferienwohnung-oder-hotel-grossfamilie |
| 2 | Familienrabatt, Familienticket und Geschwisterermäßigung: Übersicht | informativ | familienticket-grossfamilienrabatt-nachfragen |
| 2 | Ausflüge bei Regen mit 3+ Kindern (50 Ideen) | informativ | regenwetter-ideen-familie, Mikro-Abenteuer (Indoor) |
| 2 | Kostenlose Ausflüge und Ideen mit Kindern | informativ | Mikro-Abenteuer (Kostenlos) |
| 3 | Reisen mit Baby und Schulkindern gleichzeitig | informativ | lange-autofahrt-mit-kindern |
| 3 | Camping mit 3+ Kindern: Ausrüstung und Platzwahl | informativ | camping-mit-grossfamilie |
| 3 | Kindergeburtstag mit vielen Kindern draußen | informativ | kindergeburtstag-draussen-mikro-abenteuer |

Regeln: Titel = Frage/Begriff, den echte Eltern eintippen; im ersten Absatz die
Antwort geben; H2/H3 als Fragen formulieren; keine erfundenen Zahlen oder Preise.

## 4. Reichweite außerhalb der Seite

- **Pinterest** (passt am besten zu Mikro-Abenteuern): pro Abenteuer 1–2 Pins im
  Hochformat (1000×1500 px), Titel mit Suchbegriff ("Lesenacht mit Kindern –
  Ablauf & Ideen"), Link auf die Detailseite. Pinterest-Pins bringen über Monate
  Besucher. Aus den eigenen Fotos ableitbar.
- **Instagram**: bereits im Admin vorbereitet (Bereich "Instagram"); Reels/Karussells
  zu einzelnen Abenteuern, Link in Bio auf die Übersicht.
- **Familien-Blogs und Eltern-Communities** (Facebook-Gruppen für Großfamilien,
  Vereine kinderreicher Familien, Elternforen): hilfreiche Beiträge statt Werbung,
  Link nur, wo er die Frage wirklich beantwortet.
- **Verlinkungen von außen** sind der stärkste Ranking-Faktor: Gastbeitrag oder
  Erwähnung bei Familienblogs, regionale Familienportale, Verzeichnisse.
- **Newsletter** als eigener, unabhängiger Kanal; Anmeldezahlen sind für Anbieter
  ein harter Nachweis von Reichweite.

## 5. Zahlen für Hotels und Anbieter

Nur echte, gemessene Werte nennen. Quellen: Search Console (Impressionen, Klicks,
ohne Cookie-Zustimmung gemessen), Admin → Reporting (Besucher, Klicks auf Anbieter-
Links; nur mit Cookie-Zustimmung, daher eher Untergrenze), Newsletter-Anmeldungen.
Solange die Zahlen klein sind, überzeugt eher die klare Zielgruppe (Familien mit 3+
Kindern), das Konzept und ein sauberer Auftritt ohne Demo-Inhalte.
