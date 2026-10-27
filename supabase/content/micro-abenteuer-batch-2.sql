-- FamVaya: Mikro-Abenteuer, Batch 2.
-- 1) Erweitert die 30 Einträge aus Batch 1 (ausführlicher Text mit Zwischenüberschriften,
--    SEO-Titel, Meta-Beschreibung). Bestehende Einträge werden nur in diesen drei
--    Feldern überschrieben: full_description, seo_title, meta_description.
--    Status, Titelbild, Kategorie, Family-Fit usw. bleiben unangetastet.
-- 2) Legt 20 neue Mikro-Abenteuer als ENTWURF an.
--
-- VORAUSSETZUNG: Migration 0028_micro_adventures_seo.sql wurde bereits ausgeführt
-- (fügt die Spalten seo_title und meta_description hinzu).
-- Zwischenüberschriften im Text: "### Überschrift" in eigener Zeile (H3).

insert into micro_adventures (
  title, slug, short_description, full_description, category_id,
  duration_min, duration_max, cost_level, estimated_total_cost, preparation_level, difficulty_level,
  indoor, outdoor, seasonal_tags, weather_tags, materials,
  instructions, safety_notes, pros, cons,
  seo_title, meta_description,
  location_optional, status, featured
) values
  ('Spurensuche im Wald', 'spurensuche-im-wald', 'Wie Detektive nach Tierspuren, Fraßresten und Federn suchen – und rätseln, wer sie hinterlassen hat.', 'Im Wald hinterlassen Tiere überall kleine Hinweise: abgenagte Tannenzapfen, Federn, Trittsiegel im weichen Boden, angeknabberte Haselnüsse. Gemeinsam sucht ihr diese Spuren, fotografiert sie und überlegt, welches Tier dahinterstecken könnte. Das schult den Blick für Details und funktioniert mit Kindern jeden Alters, weil schon das Finden Spaß macht.

### Für wen ist das Abenteuer geeignet?
Das Abenteuer passt für Kinder ab etwa vier Jahren, jüngere Kinder sind mit Begleitung dabei. Je älter die Kinder, desto genauer können sie Spuren deuten und Tiere vermuten.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind eine eigene Aufgabe, zum Beispiel eines sucht nur Federn, eines nur Fraßspuren und eines nur Trittsiegel. So muss niemand um Funde streiten, und am Ende ergibt sich ein gemeinsames Bild. Teams aus großen und kleinen Kindern funktionieren besonders gut.

### Varianten und Ideen zum Weitermachen
- Ein Spurenmemory aus Fotos der Funde basteln
- Mit Gips oder Knete Trittsiegel abdrucken (nur auf eigenem Grundstück oder mit Erlaubnis)
- Eine Spurenkarte zeichnen, wo ihr was gefunden habt

### Welche Tierspuren findet man im Wald?
Häufig sind abgenagte Zapfen, Federn, Trittsiegel im weichen Boden und angeknabberte Nüsse. Was genau ihr entdeckt, hängt von Jahreszeit, Wald und Wetter ab.

### Darf man Fundstücke mitnehmen?
Besser nicht. Fotografieren statt sammeln schont die Natur, und bei Federn oder Knochen ist Abstand ohnehin hygienischer.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 45, 90, 'free', 0.00, 'none', 'easy', false, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['trocken']::text[], array['Smartphone oder Kamera', 'kleines Notizbuch', 'festes Schuhwerk']::text[], '1. Vor dem Start gemeinsam festlegen: Wir sammeln nur Fotos und Beobachtungen, nichts wird mitgenommen.
2. Auf weichem Boden, an Wegrändern und am Bachufer nach Trittsiegeln suchen.
3. Auf abgenagte Zapfen, angeknabberte Nüsse und Federn achten und jeden Fund fotografieren.
4. Zuhause oder auf einer Bank rätseln: Wer war das? Mit einem Bestimmungsbuch oder einer Tier-App vergleichen.', 'Fundstücke wie Federn oder Knochen nicht mit bloßen Händen aufheben und danach Hände waschen. Nach dem Waldbesuch auf Zecken absuchen.', array['Funktioniert ohne Vorbereitung und ohne Kosten', 'Trainiert genaues Hinsehen bei allen Altersgruppen', 'Gut mit mehreren Kindern: Jedes sucht für sich und zeigt dann seine Funde']::text[], array['Ob und welche Spuren ihr findet, hängt von Jahreszeit und Wald ab', 'Bei nassem Wetter sind Trittsiegel besser sichtbar, aber der Boden rutschig']::text[], 'Spurensuche im Wald mit Kindern: Tierspuren finden', 'Spurensuche im Wald mit Kindern: Tierspuren, Fraßreste und Federn entdecken. Ideen, Tipps und Ablauf für Familien, ohne Kosten und ohne Vorbereitung.', true, 'draft', false),
  ('Blätter-Bestimmungsrallye', 'blaetter-bestimmungsrallye', 'Wer findet die meisten verschiedenen Blätter und kann sie dem richtigen Baum zuordnen?', 'Jedes Kind bekommt eine kleine Liste mit Blattformen: gelappt, gezackt, nadelförmig, herzförmig. Gemeinsam geht ihr durch Park oder Wald, sammelt je ein heruntergefallenes Blatt pro Form und versucht, den Baum dazu zu benennen. Am Ende wird verglichen und gemeinsam bestimmt, zum Beispiel mit einer Bestimmungs-App oder einem Naturführer.

### Für wen ist das Abenteuer geeignet?
Schon Kindergartenkinder erkennen Blattformen, Grundschulkinder können Baumarten mit einer App oder einem Buch bestimmen. Das Abenteuer wächst mit den Kindern mit.

### Tipps für Familien mit mehreren Kindern
Teilt die Gruppe in Teams und gebt jedem Team eine eigene Liste. Wer zuerst alle Formen gefunden hat, ruft laut. Mit mehreren Kindern lohnt sich eine kleine Rangliste, bei der auch das schönste und das seltenste Blatt Punkte bringen.

### Varianten und Ideen zum Weitermachen
- Blätter pressen und ein Herbarium anlegen
- Blattabdrücke mit Wachsmalstiften auf Papier rubbeln
- Im Herbst nach Farben sortieren und eine Farbverlaufsleiste legen

### Wann ist die beste Zeit für eine Blätterrallye?
Von Frühling bis Herbst. Im Herbst gibt es die größte Vielfalt am Boden, im Frühjahr sind die Blätter noch klein, aber sehr frisch.

### Wie bestimmt man Bäume mit Kindern?
Mit einer Bestimmungs-App oder einem einfachen Naturführer. Achtet auf Form, Rand, Anordnung der Blätter und Rinde.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 45, 75, 'free', 0.00, 'light', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'bewoelkt']::text[], array['Papier und Stifte für die Liste', 'Tüte oder Korb', 'Bestimmungsbuch oder App (optional)']::text[], '1. Eine einfache Liste mit Blattformen zeichnen oder ausdrucken.
2. Nur heruntergefallene Blätter sammeln, keine vom Baum abreißen.
3. Funde nebeneinander auslegen und die Baumart zu bestimmen versuchen.
4. Die schönsten Blätter zwischen Buchseiten pressen und später ein Blätterbild kleben.', 'Keine Blätter oder Früchte in den Mund nehmen. Einige Gehölze sind giftig. Nach dem Sammeln Hände waschen.', array['Verbindet Bewegung mit Lernen', 'Das Ergebnis lässt sich als Bastelprojekt weiterverwenden', 'Teams oder Einzelwertung lassen sich leicht an die Gruppengröße anpassen']::text[], array['Im Winter und Frühjahr gibt es kaum Laub zum Sammeln', 'Für jüngere Kinder braucht es Hilfe beim Bestimmen']::text[], 'Blätter-Rallye für Kinder: Bäume bestimmen', 'Blätter-Bestimmungsrallye für Familien: Blattformen sammeln, Bäume erkennen und ein Blätterbild basteln. Ablauf, Tipps und Varianten für Kinder.', true, 'draft', false),
  ('Tipi aus Totholz bauen', 'tipi-aus-totholz-bauen', 'Aus herumliegenden Ästen ein Tipi errichten und darin eine Pause machen.', 'Aus Totholz, das ohnehin am Boden liegt, baut ihr gemeinsam ein kleines Tipi. Ein stabiler Ast als Mitte, dazu Äste im Kreis angelehnt, Zweige und Laub als Wand. Das Projekt fordert Teamarbeit, Planung und Geschick, und die Kinder dürfen selbst entscheiden, wie groß und stabil es werden soll.

### Für wen ist das Abenteuer geeignet?
Ab etwa fünf Jahren können Kinder mithelfen, kleinere Kinder tragen Zweige und sammeln Laub. Für die Konstruktion braucht es einen Erwachsenen oder ein älteres Kind.

### Tipps für Familien mit mehreren Kindern
Verteilt Rollen: Holzsammler, Baumeister, Dekorateur, Wachposten. Gerade bei drei oder mehr Kindern verhindert das Gedränge, und jedes Kind trägt sichtbar zum Ergebnis bei. Plant Zeit für den Rückbau ein, er gehört zum Abenteuer.

### Varianten und Ideen zum Weitermachen
- Mit Decken ein Dach ergänzen und eine Lese-Pause im Tipi machen
- Ein Fähnchen oder Namensschild gestalten
- Ein kleineres Tipi für Stofftiere bauen

### Darf man im Wald ein Tipi bauen?
Das hängt vom Bundesland und vom Wald ab. In Schutzgebieten und auf Privatgrund ist es meist nicht erlaubt. Fragt im Zweifel beim Forstamt nach und baut nur temporär.

### Welche Äste eignen sich?
Nur Totholz vom Boden, das trocken und stabil ist. Lebende Äste dürfen nicht abgebrochen werden.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 60, 120, 'free', 0.00, 'none', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken']::text[], array['Totholz vom Boden', 'Arbeitshandschuhe', 'Schnur (optional)']::text[], '1. Einen ebenen, geeigneten Platz suchen, möglichst abseits von Wegen.
2. Drei bis vier lange Äste oben zusammenlehnen und mit Schnur sichern.
3. Weitere Äste im Kreis anlehnen, Lücken mit Zweigen und Laub füllen.
4. Nach dem Spielen das Tipi wieder auseinandernehmen und das Holz verteilen.', 'Nur Totholz vom Boden verwenden, keine lebenden Äste abbrechen. Auf Splitter und lose Äste achten. In Schutzgebieten und auf fremdem Grund nicht bauen, in manchen Bundesländern sind feste Bauwerke im Wald verboten.', array['Fördert Teamarbeit und Planen', 'Kostet nichts und fordert Kreativität', 'Gut für größere Kindergruppen, jeder hat eine Aufgabe']::text[], array['Rückbau gehört dazu und sollte fest eingeplant werden', 'Je nach Bundesland und Wald sind Bauwerke nicht erlaubt']::text[], 'Tipi aus Ästen bauen: Waldprojekt für Familien', 'Aus Totholz ein Tipi bauen: Anleitung, Sicherheitstipps und Ideen für Familien. Teamprojekt im Wald, das Planen und Handwerk verbindet.', true, 'draft', false),
  ('Barfußpfad selbst bauen', 'barfusspfad-selbst-bauen', 'Aus Kisten oder Schüsseln mit verschiedenen Naturmaterialien einen eigenen Fühlpfad legen.', 'Ihr füllt flache Kisten oder Schüsseln mit unterschiedlichen Materialien wie Sand, Kieseln, Moos, Tannenzapfen, Rindenmulch oder Stoff. Barfuß geht es dann über die Stationen, am besten mit geschlossenen Augen und zur Sicherheit an der Hand eines Erwachsenen oder Geschwisterkindes. Das schärft den Tastsinn und sorgt für viel Gelächter.

### Für wen ist das Abenteuer geeignet?
Der Fühlpfad eignet sich für Kinder jeden Alters, auch Kleinkinder lieben ihn, solange ein Erwachsener in der Nähe bleibt. Größere Kinder wollen ihn selbst gestalten und erraten, was sie spüren.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind eine eigene Station bestücken und die anderen raten. So entstehen schnell mehr Stationen als geplant, und niemand wartet lange. Für Gruppen funktioniert ein Rundkurs, bei dem alle gleichzeitig starten.

### Varianten und Ideen zum Weitermachen
- Heiße und kalte Stationen mit Wasser- und Eisschalen kombinieren
- Eine Blindrunde mit Augenbinde einführen
- Den Pfad im Herbst mit Laub, im Winter mit Schnee variieren

### Was kommt auf einen Barfußpfad?
Sand, Kieselsteine, Rindenmulch, Tannenzapfen, Moos, Stoffreste und Wasser sind beliebte Materialien. Wichtig ist, dass nichts Scharfes dabei ist.

### Ist ein Barfußpfad auch drinnen möglich?
Ja, auf einer Plane oder in Kisten funktioniert er im Wohnzimmer genauso, etwa an Regentagen.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 30, 60, 'low', 5.00, 'moderate', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'sonnig']::text[], array['flache Kisten oder Schüsseln', 'Sand, Kieselsteine, Rindenmulch, Zapfen, Stoffreste', 'Augenbinde']::text[], '1. Material sammeln und auf Splitter, Glas und spitze Teile prüfen.
2. Kisten in einer Reihe aufstellen und befüllen.
3. Reihum barfuß durchlaufen, wer möchte mit Augenbinde.
4. Raten lassen, welches Material gerade unter den Füßen ist.', 'Alle Materialien vorher auf scharfe Gegenstände prüfen. Nur im Garten oder auf geeignetem Gelände aufbauen, Augenbinde nur mit Begleitung. Kein Gartenmaterial mit Pestiziden verwenden.', array['Sinnesförderung für alle Altersstufen', 'Material meist schon im Haushalt oder Garten vorhanden', 'Lässt sich über Wochen immer wieder neu bestücken']::text[], array['Etwas Aufbauaufwand', 'Bei Kälte oder Nässe nicht angenehm']::text[], 'Barfußpfad selber bauen für Kinder: Anleitung', 'Barfußpfad selbst bauen: Aus Kisten, Sand, Steinen und Zapfen entsteht ein Fühlpfad für Kinder. Anleitung, Materialtipps und Sicherheit.', true, 'draft', false),
  ('Krabbeltier-Safari', 'krabbeltier-safari', 'Mit Becherlupe und Neugier Insekten, Käfer und Spinnen im eigenen Garten oder Park entdecken.', 'Mit einer Becherlupe oder einem Glas mit Deckel geht ihr auf Safari durch Beet, Wiese und Totholz. Unter Steinen, an Blättern und in der Rinde findet ihr erstaunlich viele Tiere. Ihr schaut sie euch ganz genau an, zählt Beine, bestaunt Muster und lasst sie danach wieder dort frei, wo ihr sie gefunden habt.

### Für wen ist das Abenteuer geeignet?
Neugierige Kinder ab drei Jahren sind begeistert dabei, größere Kinder können Tiere nach Merkmalen bestimmen. Wichtig sind klare Regeln zum behutsamen Umgang.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind eine Becherlupe oder ein Glas und eine Fundstelle, etwa Stein, Totholz oder Blumenbeet. Dann berichtet jeder, was er gefunden hat. So entsteht ohne Streit ein gemeinsames Bild der Tierwelt im Garten.

### Varianten und Ideen zum Weitermachen
- Ein Krabbeltier-Steckbrief mit Zeichnung und Beinen zählen
- Einen Käferpfad aus Holz und Rinde bauen
- Nachts mit Taschenlampe nach Nachttieren suchen (mit Abstand)

### Wie lange darf man Tiere in der Becherlupe halten?
Nur kurz, am besten ein bis zwei Minuten, und danach genau dort wieder freilassen, wo sie gefunden wurden.

### Was ist mit giftigen oder stechenden Tieren?
Wespen, Hornissen, Bienen und Zecken nicht anfassen. Bei Allergien oder Unsicherheit lieber nur beobachten.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 30, 60, 'free', 0.00, 'none', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'sonnig']::text[], array['Becherlupe oder Glas', 'Notizbuch', 'Bestimmungskarte (optional)']::text[], '1. Vorab Regeln festlegen: Tiere behutsam behandeln, nichts zerdrücken.
2. Unter Blättern, Steinen und in Totholz nach Tieren suchen.
3. Funde kurz in der Becherlupe betrachten und beschreiben.
4. Tiere dort freilassen, wo sie gefunden wurden, und Steine wieder zurücklegen.', 'Giftige Tiere wie Wespen, Hornissen und Zecken nicht anfassen. Allergien beachten, Tiere nur kurz festhalten. Danach auf Zecken absuchen.', array['Kinder lernen respektvollen Umgang mit Tieren', 'Funktioniert im Garten oder in der Stadt', 'Keine Vorbereitung nötig']::text[], array['Je nach Wetter und Jahreszeit sind wenige Tiere unterwegs', 'Mit Insektenangst nicht für alle geeignet']::text[], 'Krabbeltier-Safari: Insekten mit Kindern entdecken', 'Insekten, Käfer und Spinnen entdecken: Die Krabbeltier-Safari mit Becherlupe für Familien. Ablauf, Regeln für Tierschutz und Ideen zum Weitermachen.', true, 'draft', false),
  ('Pilze fotografieren statt sammeln', 'pilze-fotografieren', 'Auf Pilzsafari gehen und die Funde ausschließlich mit der Kamera sammeln.', 'Im Herbst zeigen sich im Wald überraschend viele Formen und Farben von Pilzen. Statt sie zu pflücken, fotografiert ihr sie aus verschiedenen Blickwinkeln, vergleicht sie später mit einem Pilzführer oder einer Bestimmungs-App und erstellt ein eigenes Pilz-Album. So bleibt der Wald unberührt und niemand kommt mit giftigen Arten in Kontakt.

### Für wen ist das Abenteuer geeignet?
Das Abenteuer passt für Kinder ab etwa vier Jahren, die Hände bei sich behalten können. Ältere Kinder gestalten später ein Pilz-Album.

### Tipps für Familien mit mehreren Kindern
Teilt die Rollen auf: Ein Kind fotografiert, eines misst mit einem Stift, eines notiert den Fundort. So bleiben alle beschäftigt, und es wird niemand von den Pilzen selbst abgelenkt. Wichtig: Gemeinsame Regel, dass nichts angefasst wird.

### Varianten und Ideen zum Weitermachen
- Ein Pilz-Quiz aus den Fotos basteln
- Pilze nach Farben oder Formen sortieren
- Eine Fotoausstellung für Oma und Opa gestalten

### Warum Pilze nur fotografieren und nicht sammeln?
Viele Pilze sehen ähnlich aus, einige sind giftig. Fotografieren schützt Kinder und Wald, und das Bestimmen bleibt ein spannendes Rätsel.

### Wann findet man die meisten Pilze?
Meist im Spätsommer und Herbst, vor allem nach feuchtem Wetter.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 45, 90, 'free', 0.00, 'none', 'easy', false, true, array['herbst']::text[], array['trocken', 'bewoelkt']::text[], array['Smartphone oder Kamera', 'Pilzführer oder App (optional)']::text[], '1. Im Wald langsam gehen und gezielt auf Baumstümpfen, Moos und Wegrändern suchen.
2. Jeden Pilz von oben, von der Seite und die Unterseite fotografieren, ohne ihn zu berühren.
3. Fund-Ort und Größe notieren, zum Beispiel mit einem Fuß oder Stift als Maßstab.
4. Zuhause ein Album oder eine Collage mit den schönsten Funden gestalten.', 'Pilze niemals essen und nicht in den Mund nehmen. Auch Berührung nur mit Vorsicht, anschließend Hände waschen. Pilze nicht zertreten oder abreißen.', array['Schonend für den Wald', 'Fördert genaues Beobachten und Dokumentieren', 'Eignet sich auch für kleinere Kinder, wenn sie nicht anfassen dürfen']::text[], array['Ergebnis hängt stark von Jahreszeit und Wetter ab', 'Sicheres Bestimmen ist schwierig, die Bestimmung ersetzt keine Pilzberatung']::text[], 'Pilze im Wald fotografieren: Herbstabenteuer', 'Pilze mit Kindern im Wald fotografieren statt sammeln: Tipps für Bilder, Pilz-Album und Sicherheit. Naturabenteuer für den Herbst.', true, 'draft', false),
  ('Geocaching für Anfänger', 'geocaching-fuer-anfaenger', 'Mit dem Smartphone auf Schatzsuche gehen und einen Cache in der Nähe finden.', 'Geocaching ist eine weltweite Schatzsuche: Versteckte Behälter, sogenannte Caches, werden anhand von GPS-Koordinaten gesucht. Für den Einstieg eignen sich einfache, traditionelle Caches mit niedriger Schwierigkeit in der Nähe. Ihr tragt euch ins Logbuch ein, tauscht vielleicht ein kleines Fundstück und versteckt alles wieder exakt so, wie ihr es vorgefunden habt.

### Für wen ist das Abenteuer geeignet?
Ab etwa sechs Jahren können Kinder mitnavigieren, jüngere Kinder genießen vor allem das Finden des Schatzes. Für den Einstieg eignen sich Caches mit niedrigem Schwierigkeitsgrad.

### Tipps für Familien mit mehreren Kindern
Gebt Aufgaben: Ein Kind navigiert, eines liest die Hinweise, eines führt das Logbuch. Für mehrere Kinder lohnen sich mehrere Mini-Caches nacheinander, damit jeder einmal den Fund machen darf.

### Varianten und Ideen zum Weitermachen
- Einen eigenen kleinen Cache mit Logbuch verstecken
- Eine Familien-Statistik führen, wie viele Caches gefunden wurden
- Tauschobjekte vorbereiten, die Kinder selbst gebastelt haben

### Ist Geocaching kostenlos?
Die Grundfunktionen der Apps sind meist kostenlos nutzbar, zusätzliche Funktionen kosten extra. Für den Einstieg reicht die Basisversion.

### Wo darf man Geocaches suchen?
An öffentlich zugänglichen, erlaubten Orten. Nicht auf Privatgrund, Gleisen oder abseits der Wege in Schutzgebieten.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 60, 120, 'free', 0.00, 'light', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken']::text[], array['Smartphone mit Geocaching-App', 'Stift fürs Logbuch', 'kleines Tauschgeschenk (optional)']::text[], '1. App herunterladen und einen Anfänger-Cache in Wohnortnähe auswählen (Schwierigkeit und Gelände niedrig).
2. Gemeinsam zur Position navigieren und aufmerksam in der Umgebung suchen.
3. Cache vorsichtig öffnen, ins Logbuch eintragen und alles wieder sorgfältig verschließen.
4. Den Behälter exakt am gleichen Platz zurücklegen und den Fund in der App loggen.', 'Nur Caches an erlaubten, gut zugänglichen Orten suchen und nicht auf Privatgrund, Gleisen oder in Schutzgebieten abseits der Wege. Kinder nicht an Straßen oder Gewässern unbeaufsichtigt lassen.', array['Bewegung und Rätselspaß kombiniert', 'Fast überall verfügbar', 'Passt gut für gemischte Altersgruppen']::text[], array['Braucht Smartphone mit Datenverbindung und Akku', 'Die App bietet kostenpflichtige Zusatzfunktionen, die Basisfunktionen reichen aber']::text[], 'Geocaching mit Kindern: Einstieg für Familien', 'Geocaching für Anfänger: So startet ihr mit Kindern die GPS-Schatzsuche. Ablauf, Regeln, Tipps für den ersten Cache und Sicherheit.', true, 'draft', false),
  ('Blinde Karawane im Wald', 'blinde-karawane', 'Mit verbundenen Augen von einem Geschwisterkind durch den Wald geführt werden und dabei alle Sinne schärfen.', 'Ein Kind trägt eine Augenbinde, ein anderes führt es sicher an der Hand oder an der Schulter über einen ebenen Waldweg. Ihr wechselt die Rollen. Wer nichts sieht, hört, riecht und fühlt viel intensiver: Vogelstimmen, Laub unter den Füßen, den Duft von Harz. Die Aktivität stärkt Vertrauen und Verantwortung zwischen den Kindern.

### Für wen ist das Abenteuer geeignet?
Das Spiel passt für Kinder ab etwa fünf Jahren, die Anweisungen verstehen und sich aufeinander verlassen können. Kleinere Kinder führt ein Erwachsener.

### Tipps für Familien mit mehreren Kindern
Bildet Paare aus großem und kleinem Kind, sodass die Verantwortung verteilt ist. Bei mehr als zwei Kindern wechselt ihr die Paare nach jeder Runde. Sprecht danach über die Eindrücke, das macht das Erlebnis rund.

### Varianten und Ideen zum Weitermachen
- Die Aufgabe stellen, einen bestimmten Baum blind zu erkennen
- Als Karawane an einem Seil entlang gehen
- Mit leisen Geräuschen auf einem kurzen Parcours führen

### Ist das Spiel sicher?
Ja, wenn ihr einen ebenen Weg ohne Hindernisse wählt, die führende Person ständig in Kontakt bleibt und nicht in der Nähe von Gewässern oder Hängen spielt.

### Was lernen Kinder dabei?
Vertrauen, Rücksicht und genaue Wahrnehmung. Ohne Sehen werden Geräusche und Gerüche viel intensiver.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 30, 60, 'free', 0.00, 'none', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken']::text[], array['Augenbinde oder Schal']::text[], '1. Einen ebenen, übersichtlichen Weg ohne Gefälle auswählen.
2. Eine Person verbindet sich die Augen, die andere führt langsam und kündigt Hindernisse an.
3. Mitten auf dem Weg anhalten und gemeinsam benennen: Was hörst du, was riechst du?
4. Rollen tauschen und anschließend über die Eindrücke sprechen.', 'Nur auf ebenen Wegen, fern von Hängen, Gewässern und Straßen. Führende Person muss immer in Berührung bleiben. Wer sich unwohl fühlt, nimmt die Binde sofort ab.', array['Stärkt Vertrauen und Rücksicht unter Geschwistern', 'Ohne Material und fast ohne Vorbereitung', 'Wirkt auf Kinder jeden Alters']::text[], array['Nicht jedes Kind mag verbundene Augen', 'Braucht aufmerksame Aufsicht']::text[], 'Blinde Karawane: Sinnesspiel im Wald für Familien', 'Blinde Karawane im Wald: Ein Sinnesspiel für Kinder, das Vertrauen stärkt. Ablauf, Sicherheitstipps und Varianten für Familien.', true, 'draft', false),
  ('Stockbrot am Grillplatz', 'stockbrot-am-grillplatz', 'Teig auf einen Stock wickeln und über der Glut backen – nur an dafür vorgesehenen Feuerstellen.', 'Stockbrot gehört für viele Kinder zu den schönsten Outdoor-Erlebnissen. Ihr bereitet den Hefeteig zuhause vor oder nutzt fertigen Teig, wickelt ihn um saubere Stöcke und backt ihn über der Glut an einer offiziellen Grill- oder Feuerstelle. Dabei lernen Kinder, wie man ruhig am Feuer sitzt und geduldig wartet.

### Für wen ist das Abenteuer geeignet?
Ab etwa fünf Jahren können Kinder mit Aufsicht selbst drehen, jüngere Kinder helfen beim Teig. Am Feuer gilt immer: Erwachsene sind in direkter Nähe.

### Tipps für Familien mit mehreren Kindern
Bereitet den Teig vorab zu und portioniert ihn, damit am Feuer niemand wartet. Stellt Stöcke und Grillhandschuhe bereit und legt eine feste Reihenfolge fest, wer wann am Feuer ist. Mit mehreren Kindern bewährt sich ein klarer Abstand zur Glut.

### Varianten und Ideen zum Weitermachen
- Mit Kräutern, Käse oder Zimt und Zucker verfeinern
- Schlangenbrot um dünne Stöcke wickeln
- Als Beilage Gemüse oder Marshmallows rösten

### Welchen Teig nimmt man für Stockbrot?
Ein einfacher Hefeteig aus Mehl, Wasser, Hefe, Salz und etwas Öl funktioniert gut. Er sollte nicht zu weich sein, damit er am Stock hält.

### Wo darf man Stockbrot machen?
Nur an offiziellen Grill- und Feuerstellen und nur, wenn kein Feuerverbot gilt. Haltet Löschwasser bereit.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 60, 120, 'low', 8.00, 'moderate', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'windstill']::text[], array['Hefeteig oder fertiger Brotteig', 'Haselnuss- oder Weidenstöcke', 'Wasser zum Löschen', 'Grillhandschuhe']::text[], '1. Offizielle Grill- oder Feuerstelle suchen und zuvor klären, ob Feuer aktuell erlaubt ist.
2. Stöcke schälen und glatt machen, Teig dünn um das Stockende wickeln.
3. Teig langsam und mit Abstand zur Flamme über der Glut drehen, bis er goldbraun ist.
4. Feuer vollständig ablöschen und die Feuerstelle sauber hinterlassen.', 'Kinder nie allein am Feuer lassen. Nur bei erlaubter Feuerstelle, keine Feuer bei Waldbrandgefahr oder Feuerverbot. Eimer Wasser bereitstellen, Haare zusammenbinden, auf Abstand achten.', array['Echtes Naturerlebnis, das lange in Erinnerung bleibt', 'Teig lässt sich einfach vorbereiten', 'Skaliert gut auf mehrere Kinder']::text[], array['Braucht erlaubte Feuerstelle und passendes Wetter', 'Beim Feuer ist ständige Aufsicht nötig']::text[], 'Stockbrot backen mit Kindern: Rezept und Tipps', 'Stockbrot am Lagerfeuer oder Grillplatz: Teig, Ablauf und Sicherheitstipps für Familien. So gelingt Stockbrot mit mehreren Kindern.', true, 'draft', false),
  ('Nachtspaziergang mit Taschenlampe', 'nachtspaziergang-mit-taschenlampe', 'Den vertrauten Weg im Dunkeln neu entdecken und auf nächtliche Geräusche lauschen.', 'Bei Einbruch der Dunkelheit macht ihr einen kurzen Spaziergang auf einem bekannten Weg. Mit Taschenlampen und Stirnlampen sieht plötzlich alles anders aus: Schatten wachsen, Geräusche werden lauter. Ihr bleibt stehen, schaltet die Lampen aus und lauscht, was ihr hört. Das Erlebnis ist aufregend und gleichzeitig beruhigend.

### Für wen ist das Abenteuer geeignet?
Der Spaziergang passt für Kinder ab etwa vier Jahren, mit guter Begleitung auch früher. Kürzere Strecken helfen den Jüngeren.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind eine eigene Lampe, so fühlen sich alle sicher. Verteilt Aufgaben wie das Lauschen, das Zählen von Sternen oder das Finden von Katzenaugen (Reflektoren). Bleibt zusammen, besonders in Gruppen mit mehreren Kindern.

### Varianten und Ideen zum Weitermachen
- Eine Mini-Lichtershow mit Lampen und Schatten machen
- Sterne und Mond beobachten
- Auf Geräusche lauschen und aufschreiben

### Wann ist der beste Zeitpunkt?
Kurz nach Einbruch der Dunkelheit, wenn die Kinder noch nicht zu müde sind. Im Winter ist es früher dunkel, das passt gut zum Familienalltag.

### Was zieht man an?
Warme Kleidung und reflektierende Elemente, damit ihr gut sichtbar seid.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 30, 60, 'free', 0.00, 'light', 'easy', false, true, array['herbst', 'winter', 'fruehling']::text[], array['trocken', 'klar']::text[], array['Taschenlampen oder Stirnlampen', 'reflektierende Kleidung', 'warme Jacken']::text[], '1. Einen sicheren, bekannten Weg mit wenig Verkehr auswählen.
2. Alle bekommen eine Lampe oder tragen reflektierende Kleidung.
3. An einer ruhigen Stelle alle Lichter ausschalten, zwei Minuten lauschen und danach erzählen, was man gehört hat.
4. Den Rückweg gemeinsam im Licht zurücklegen.', 'Nur auf sicheren Wegen ohne Verkehr, zusammenbleiben. Nicht in der Nähe von Gewässern oder Waldrändern, wo Wild unterwegs sein kann. Für kleinere Kinder die Dauer kurz halten.', array['Intensives Erlebnis ohne Aufwand', 'Gut für Kinder, die tagsüber schon alles kennen', 'Funktioniert auch im Winter und in der Stadt']::text[], array['Für ängstliche Kinder zunächst ungewohnt', 'Nicht bei Regen oder Glätte geeignet']::text[], 'Nachtspaziergang mit Kindern: Abenteuer im Dunkeln', 'Nachtspaziergang mit Taschenlampe: So wird der Abendspaziergang zum Abenteuer für Familien. Tipps zu Sicherheit, Route und Beobachtungen.', true, 'draft', false),
  ('Klangkarte erstellen', 'klangkarte-erstellen', 'Auf einem ruhigen Platz die Augen schließen, alle Geräusche aufschreiben oder zeichnen und daraus eine Karte machen.', 'Ihr setzt euch an einen ruhigen Platz im Park, Garten oder Wald und schließt für zwei bis drei Minuten die Augen. Danach zeichnet ihr einen Kreis in euer Notizbuch, markiert euren Standort in der Mitte und tragt ein, aus welcher Richtung welche Geräusche kommen. Zusammen entsteht eine kleine Klanglandschaft, die ihr später vergleichen könnt.

### Für wen ist das Abenteuer geeignet?
Das Abenteuer eignet sich für Kinder ab etwa fünf Jahren, die zeichnen oder Symbole nutzen können. Jüngere Kinder malen einfach, was sie hören.

### Tipps für Familien mit mehreren Kindern
Jedes Kind erstellt seine eigene Klangkarte, danach vergleicht ihr. Das macht Unterschiede sichtbar und bringt Gesprächsstoff, ohne dass jemand besser oder schlechter ist. Bei mehreren Kindern entsteht eine kleine Klanggalerie.

### Varianten und Ideen zum Weitermachen
- Zwei Karten zu verschiedenen Tageszeiten vergleichen
- Geräusche mit dem Smartphone aufnehmen
- Aus den Geräuschen ein kleines Hörspiel machen

### Wie lange sollte man still sein?
Zwei bis drei Minuten genügen. Bei jüngeren Kindern kürzer, damit es nicht zur Geduldsprobe wird.

### Funktioniert das auch in der Stadt?
Ja, gerade dort gibt es viele unterschiedliche Geräusche. Wählt einen ruhigeren Platz, etwa einen Park oder Hof.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 20, 45, 'free', 0.00, 'none', 'easy', false, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['trocken', 'bewoelkt']::text[], array['Papier und Stifte', 'Klemmbrett oder feste Unterlage']::text[], '1. Einen Platz wählen, an dem ihr ungestört sitzen könnt.
2. Zwei Minuten still sein und die Augen schließen.
3. Auf Papier einen Kreis zeichnen, die Mitte ist euer Platz. Geräusche je nach Richtung als Symbol oder Wort eintragen.
4. Karten untereinander vergleichen und besprechen, wer was gehört hat.', 'Platz mit Abstand zu Straßen und Gewässern wählen, damit die Kinder mit geschlossenen Augen sicher sitzen.', array['Beruhigt und sammelt Aufmerksamkeit', 'Gut für den Alltag und für unterwegs', 'Mit jeder Gruppengröße machbar']::text[], array['Jüngere Kinder halten die Stille nur kurz aus', 'Wenig körperliche Bewegung']::text[], 'Klangkarte erstellen: Hör-Abenteuer für Kinder', 'Klangkarte mit Kindern erstellen: Geräusche lauschen, aufzeichnen und vergleichen. Ruhiges Naturabenteuer für Garten, Park und Wald.', true, 'draft', false),
  ('Steine flitschen – Familienmeisterschaft', 'steine-flitschen', 'Am See oder ruhigen Fluss die flachsten Steine suchen und zählen, wie oft sie hüpfen.', 'Flache, glatte Steine werden mit seitlichem Wurf über ruhiges Wasser geschleudert. Wer zählt die meisten Hüpfer? Zuerst suchen die Kinder passende Steine, üben die Wurftechnik und führen dann eine kleine Meisterschaft durch. Das funktioniert an Seen und ruhigen Flüssen und bringt auch Erwachsene ins Schwitzen.

### Für wen ist das Abenteuer geeignet?
Ab etwa sechs Jahren gelingen erste Hüpfer, jüngere Kinder sammeln Steine und zählen mit. Für alle Altersgruppen gilt: Üben macht den Spaß aus.

### Tipps für Familien mit mehreren Kindern
Teilt die Familie in Teams und zählt gemeinsame Punkte, sodass auch Anfänger zum Teamerfolg beitragen. Mehrere Wurfrunden verhindern Frust, und ein kleiner Wanderpokal aus einem besonderen Stein macht die Meisterschaft offiziell.

### Varianten und Ideen zum Weitermachen
- Rekord-Stein des Tages küren
- Wurfarten testen: flach, schräg, schnell
- Steine bemalen und als Souvenir mitnehmen

### Wie flitscht man einen Stein richtig?
Flachen, runden Stein wählen, seitlich aus dem Handgelenk flach auf das Wasser werfen und dem Stein Drall geben.

### Wo darf man flitschen?
An ruhigen Ufern ohne andere Personen im Wasser und nicht in Schutzgebieten mit Betretungsverbot.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 30, 60, 'free', 0.00, 'none', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'windstill']::text[], array['flache Steine', 'Notizblock für die Punkte']::text[], '1. Ruhige Stelle am Ufer wählen, an der niemand badet oder paddelt.
2. Gemeinsam flache, handtellergroße Steine sammeln.
3. Seitlich aus dem Handgelenk werfen und die Hüpfer laut zählen.
4. Jede Runde drei Würfe, höchste Hüpfzahl gewinnt.', 'Nur werfen, wenn keine Personen im Wasser oder in Wurfrichtung sind. Abstand zu anderen Gästen halten und Kinder am Ufer nicht unbeaufsichtigt lassen.', array['Kostenlos und schnell gestartet', 'Einfaches Regelwerk, auch für größere Gruppen', 'Passt gut als Zwischenstopp bei Ausflügen']::text[], array['Braucht ruhiges Wasser und geeignete Steine', 'Technik muss geübt werden']::text[], 'Steine flitschen: Die Familienmeisterschaft am Wasser', 'Steine flitschen mit Kindern: Technik, Auswahl der Steine und Wettbewerb am See oder Fluss. Tipps für Familien und Sicherheitshinweise.', true, 'draft', false),
  ('Wasserrad aus Naturmaterial', 'wasserrad-aus-naturmaterial', 'Mit Ästen, Blättern und einem Stock ein kleines Wasserrad im flachen Bach bauen.', 'Aus einem geraden Ast als Achse, Rinde oder Blättern als Schaufeln und zwei Astgabeln als Halterung bauen die Kinder ein kleines Wasserrad. Am flachen Bach wird es getestet. Dreht es sich nicht, wird nachgebessert. So lernen Kinder spielerisch, wie Wasserkraft funktioniert.

### Für wen ist das Abenteuer geeignet?
Das Abenteuer passt für Kinder ab etwa sechs Jahren, mit Unterstützung auch früher. Das Basteln schult Geschick, das Testen im Wasser Geduld.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind ein eigenes Rad bauen und veranstaltet ein Rennen, welches Rad sich am schnellsten dreht. So wird aus dem Basteln ein Wettbewerb, bei dem alle etwas ausprobieren und nachbessern dürfen.

### Varianten und Ideen zum Weitermachen
- Mit verschiedenen Schaufelformen experimentieren
- Ein Wasserrad mit Förderband aus Schnur bauen
- Das Rad an einer anderen Stelle testen und vergleichen

### Wie funktioniert ein Wasserrad?
Das fließende Wasser drückt gegen die Schaufeln und dreht die Achse. Je gleichmäßiger die Schaufeln, desto besser dreht sich das Rad.

### Welche Materialien sind geeignet?
Gerade Äste für die Achse, Rinde, Blätter oder dünne Holzstücke für die Schaufeln, dazu Schnur zum Fixieren.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 45, 90, 'free', 0.00, 'light', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'sonnig']::text[], array['gerader Ast', 'zwei Astgabeln', 'Rinde oder große Blätter', 'Schnur oder Gummiband']::text[], '1. Einen flachen, ruhigen Bach mit leichter Strömung suchen.
2. Aus Rinde oder Blättern vier bis sechs Schaufeln schneiden oder falten.
3. Schaufeln an die Achse binden und die Achse in zwei Astgabeln lagern.
4. Im Wasser testen und das Rad verbessern, bis es sich dreht.', 'Nur an flachen Bachstellen spielen, Rutschgefahr auf Steinen. Wasser vor dem Spielen auf Strömung prüfen und bei Regen oder Hochwasser nicht ins Wasser gehen.', array['Verbindet Basteln mit Physik', 'Mit Material aus der Natur', 'Mehrere Kinder können verschiedene Konstruktionen bauen']::text[], array['Braucht einen geeigneten Bach', 'Je nach Material etwas Geduld nötig']::text[], 'Wasserrad aus Naturmaterial bauen: Anleitung für Kinder', 'Wasserrad im Bach bauen: Anleitung aus Ästen, Rinde und Blättern. Naturprojekt für Kinder, das Physik begreifbar macht.', true, 'draft', false),
  ('Mini-Staudamm im flachen Bach', 'mini-staudamm', 'Mit Steinen und Ästen an einer geeigneten Bachstelle einen kleinen Damm bauen und danach wieder abbauen.', 'An einer flachen Stelle eines naturnahen Bachs bauen die Kinder aus Steinen, Ästen und Schlamm einen Mini-Staudamm. Dabei erleben sie, wie Wasser sich staut und seinen Weg sucht. Ganz wichtig: Alles wird nach dem Spiel wieder zurückgebaut, damit der Bach frei fließen kann.

### Für wen ist das Abenteuer geeignet?
Der Spaß passt für Kinder ab etwa vier Jahren, die gerne im Wasser spielen. Wichtig ist eine flache, ungefährliche Stelle und Aufsicht.

### Tipps für Familien mit mehreren Kindern
Teilt die Aufgaben auf: Steine sammeln, bauen, abdichten, beobachten. Bei mehreren Kindern entstehen so ganze Dammsysteme. Besprecht vorher, dass alles am Ende zurückgebaut wird, damit der Bach frei fließen kann.

### Varianten und Ideen zum Weitermachen
- Einen kleinen See stauen und Papierboote darauf fahren lassen
- Mit Staudamm und Umleitung ein Kanalsystem bauen
- Die Wasserhöhe messen und vergleichen

### Darf man im Bach einen Damm bauen?
Nur kurzfristig und wenn es erlaubt ist. In Schutzgebieten oder bei Fischbeständen nicht, und immer alles wieder zurückbauen.

### Was zieht man dafür an?
Wasserschuhe oder Gummistiefel, Wechselkleidung und ein Handtuch.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 45, 90, 'free', 0.00, 'none', 'medium', false, true, array['sommer', 'fruehling']::text[], array['trocken', 'sonnig']::text[], array['Gummistiefel oder Wasserschuhe', 'Handtücher', 'Wechselkleidung']::text[], '1. Einen kleinen, flachen Bach wählen und prüfen, ob Spielen erlaubt ist.
2. Steine und Äste sammeln und als Mauer in den Bach legen.
3. Beobachten, wie sich das Wasser staut und wo es überläuft.
4. Alles wieder zurückbauen, Steine zurücklegen und den Bach wie vorgefunden verlassen.', 'Nur bei niedrigem Wasserstand, nie bei Regen oder nach Hochwasser. Nicht in Schutzgebieten bauen, Tierleben nicht stören. Auf Rutschgefahr achten.', array['Intensive Naturerfahrung', 'Beschäftigt mehrere Kinder lange', 'Fördert Planen und Teamarbeit']::text[], array['Nasse Kleidung ist garantiert', 'Nicht an jedem Bach erlaubt, vorher klären']::text[], 'Mini-Staudamm im Bach bauen: Wasserspiel für Kinder', 'Mini-Staudamm im flachen Bach bauen: Ablauf, Regeln für den Naturschutz und Ideen für Familien. Wasserabenteuer für den Sommer.', true, 'draft', false),
  ('Strandolympiade', 'strandolympiade', 'Ein Tag am See oder Meer wird zur Olympiade mit Sandburg-Weitwurf, Muschelsammeln und Wettrennen.', 'Ihr denkt euch fünf bis sechs Disziplinen aus, die am Strand oder Seeufer funktionieren: Sandburg bauen, Muschelsammeln, Weitwurf mit Sandbällen, Wettlauf im Sand, Flaggenlauf. Alle sammeln Punkte, am Ende gibt es eine Siegerehrung mit selbstgebastelten Medaillen. Das Format eignet sich bestens für Familien mit mehreren Kindern, weil Teams gebildet werden können.

### Für wen ist das Abenteuer geeignet?
Die Olympiade passt für Kinder jeden Alters, die Disziplinen lassen sich einfach anpassen. Kleinere Kinder bekommen kürzere Strecken oder Hilfen.

### Tipps für Familien mit mehreren Kindern
Bildet gemischte Teams aus Erwachsenen und Kindern, damit niemand untergeht. Vergebt Punkte auch für Fairness und Teamgeist, nicht nur für Geschwindigkeit. Eine Siegerehrung mit Muschel-Medaillen rundet den Tag ab.

### Varianten und Ideen zum Weitermachen
- Sandburg-Wettbewerb mit Jury
- Muschel-Staffel mit Eimern
- Wasserlauf mit gefülltem Becher

### Welche Disziplinen passen für den Strand?
Weitwurf mit Sandbällen, Wettlauf, Flaggenlauf, Sandburgbau, Muschelsammeln und Seilziehen sind beliebt.

### Wie schützt man sich vor Sonne?
Mit Sonnencreme, Kopfbedeckung, Pausen im Schatten und ausreichend Wasser. Die Mittagshitze lieber meiden.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 60, 120, 'free', 0.00, 'light', 'easy', false, true, array['sommer']::text[], array['sonnig', 'trocken']::text[], array['Eimer und Schaufeln', 'Stoppuhr oder Smartphone', 'Pappe für Medaillen (optional)']::text[], '1. Gemeinsam fünf bis sechs Disziplinen festlegen und kurz erklären.
2. Teams bilden und die Reihenfolge abstimmen.
3. Punkte auf einem Zettel oder im Sand notieren.
4. Siegerehrung mit Medaillen oder einer kleinen Belohnung am Ende.', 'Sonnenschutz, ausreichend Wasser zum Trinken. Baden nur mit Aufsicht und an bewachten Stellen. Nicht in der Mittagshitze durchführen.', array['Gut für mehrere Kinder und gemischte Altersgruppen', 'Keine besonderen Materialien nötig', 'Verbindet Bewegung, Teamgeist und Kreativität']::text[], array['Nur bei gutem Wetter und am Wasser möglich', 'Braucht ein wenig Organisation vorab']::text[], 'Strandolympiade: Spiele am Strand für Familien', 'Strandolympiade für Familien: Disziplinen, Regeln und Tipps für Spiele am Strand oder See. Ideen für Kinder jeden Alters.', true, 'draft', false),
  ('Schwammbomben-Schlacht', 'schwammbomben-schlacht', 'Eine Wasserschlacht mit Schwämmen statt Ballons – wiederverwendbar und ohne Plastikmüll.', 'Alte Schwämme oder Putztücher werden in Eimern mit Wasser getränkt und als Wurfgeschosse benutzt. Damit lässt sich eine Wasserschlacht veranstalten, die ohne zerplatzte Plastikreste auskommt. Teams stehen sich gegenüber oder jeder gegen jeden. Perfekt für heiße Sommertage und den Garten.

### Für wen ist das Abenteuer geeignet?
Das Spiel passt für Kinder ab etwa drei Jahren, größere Kinder bauen Teams und Regeln. Für alle gilt: Gesicht nicht direkt treffen.

### Tipps für Familien mit mehreren Kindern
Teilt Teams aus und legt Spielfeld und Pausen fest. Mit mehreren Kindern bewährt sich eine Schwamm-Station als Nachschub und ein Schiedsrichter. Danach kommen alle Schwämme zurück in den Eimer.

### Varianten und Ideen zum Weitermachen
- Ziele aufstellen und Punkte sammeln
- Eine Schwamm-Staffel mit Löchern im Eimer
- Mit Becher und Schwamm einen Wasserparcours bauen

### Warum Schwämme statt Wasserbomben?
Schwämme sind wiederverwendbar und hinterlassen keine Plastikreste im Garten.

### Wie viel Wasser braucht man?
Ein bis zwei Eimer reichen. In Trockenzeiten nutzt ihr besser Regenwasser.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 30, 60, 'low', 3.00, 'light', 'easy', false, true, array['sommer']::text[], array['sonnig', 'trocken']::text[], array['Schwämme oder Putztücher', 'Eimer mit Wasser', 'Badekleidung', 'Handtücher']::text[], '1. Eimer mit Wasser füllen und Schwämme bereitlegen.
2. Teams bilden und Spielfeld mit klaren Grenzen markieren.
3. Schwämme eintauchen und mit Schwung auf das andere Team werfen.
4. Nach dem Spiel Schwämme ausspülen und trocknen lassen.', 'Nur auf rutschfestem Untergrund spielen. Gesicht nicht gezielt treffen. Sonnenschutz und Trinkpausen einplanen. Wasser sparsam einsetzen, besonders in Trockenzeiten.', array['Günstig und wiederverwendbar', 'Hoher Spaßfaktor bei mehreren Kindern', 'Kaum Vorbereitung nötig']::text[], array['Nur bei warmem Wetter sinnvoll', 'Wasserverbrauch im Garten bedenken']::text[], 'Schwammbomben-Schlacht: Wasserspiel ohne Müll', 'Schwammbomben statt Wasserbomben: Die Wasserschlacht für heiße Tage ohne Plastikmüll. Spielregeln, Tipps und Varianten für Familien.', true, 'draft', false),
  ('Eisskulpturen im Frost', 'eisskulpturen-im-frost', 'Bei Frost Wasser in Förmchen gefrieren lassen, mit Salz und Farbe zu Eisskulpturen verzaubern.', 'An frostigen Tagen füllt ihr Förmchen, Schüsseln oder Eimer mit Wasser, gebt Naturmaterialien wie Beeren, Zweige oder Blüten hinein und lasst alles über Nacht draußen gefrieren. Am nächsten Tag stürzt ihr die Eisformen, hängt sie auf oder baut Skulpturen. Mit Salz und Lebensmittelfarbe lassen sich spannende Experimente machen.

### Für wen ist das Abenteuer geeignet?
Ab etwa vier Jahren können Kinder mitbasteln, jüngere Kinder helfen beim Befüllen. Das Salz-Experiment ist besonders für Grundschulkinder spannend.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind eine eigene Form gestalten und über Nacht draußen gefrieren. Am nächsten Morgen sorgt das Auspacken für Spannung. Mit mehreren Kindern könnt ihr gemeinsam eine Eisgalerie am Gartenzaun aufbauen.

### Varianten und Ideen zum Weitermachen
- Mit Lebensmittelfarbe bunte Eisformen gestalten
- Eislaternen mit Kerze (nur mit Erwachsenen)
- Eis als Sammelmaterial für ein Wissensexperiment nutzen

### Wie friert man Eisskulpturen am besten?
Draußen bei Dauerfrost, in Förmchen oder Schüsseln. Je kälter, desto schneller und klarer wird das Eis.

### Was passiert mit Salz auf Eis?
Salz senkt den Gefrierpunkt, das Eis schmilzt an der Stelle. So entstehen kleine Rinnen und Höhlen.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 30, 60, 'free', 0.00, 'light', 'easy', false, true, array['winter']::text[], array['frost']::text[], array['Förmchen oder Schüsseln', 'Wasser', 'Naturmaterialien', 'Salz und Lebensmittelfarbe (optional)', 'Schnur zum Aufhängen']::text[], '1. Formen mit Wasser füllen, Naturmaterial hineinlegen und eine Schnurschlaufe einlegen.
2. Über Nacht bei Frost draußen stehen lassen.
3. Eis aus den Formen lösen und im Garten aufhängen oder zu Skulpturen stapeln.
4. Mit Salz experimentieren: Das Eis schmilzt an der Stelle, Farbe sammelt sich in den Rillen.', 'Salz und Farbe nicht in die Augen oder den Mund bringen, Handschuhe tragen. Eis nicht ablecken, Erfrierungen vermeiden und Hände zwischendurch aufwärmen.', array['Verbindet Basteln und Experimentieren', 'Verlängert die Outdoor-Saison bis in den Winter', 'Ergebnis hält mehrere Tage']::text[], array['Braucht anhaltenden Frost', 'In milden Wintern nicht möglich']::text[], 'Eisskulpturen im Frost: Winterabenteuer für Kinder', 'Eisskulpturen mit Kindern selber machen: Anleitung für Frosttage mit Förmchen, Naturmaterial und Salz. Experiment und Bastelspaß für den Winter.', true, 'draft', false),
  ('Schneeburg-Bauwerkstatt', 'schneeburg-bauwerkstatt', 'Mit Eimern und Schaufeln eine kleine Burg oder Mauer aus Schnee bauen.', 'Wenn Schnee liegt, bauen die Kinder mit Eimern, Förmchen und Schaufeln Schneeziegel und errichten daraus eine Burgmauer oder ein kleines Fort. Die Aufgaben lassen sich gut verteilen: Ziegelhersteller, Baumeister, Fahnenbauer. Zum Schluss bekommt die Burg Fenster, Zinnen und eine Fahne.

### Für wen ist das Abenteuer geeignet?
Das Abenteuer passt für Kinder jeden Alters, sofern der Schnee feucht und formbar ist. Die Jüngsten drücken Ziegel, die Älteren bauen Mauern.

### Tipps für Familien mit mehreren Kindern
Verteilt Rollen wie Ziegelmeister, Baumeister und Fahnenbauer. Bei drei oder mehr Kindern entsteht so eine richtige kleine Festung. Plant Aufwärmpausen und trockene Handschuhe ein.

### Varianten und Ideen zum Weitermachen
- Mit Lebensmittelfarbe Wappen auf die Mauer sprühen
- Einen Burggraben und eine Zugbrücke bauen
- Eine Schneeballschlacht als Burgbelagerung spielen

### Welcher Schnee eignet sich?
Feuchter, klebriger Schnee bei Temperaturen um null Grad. Pulverschnee lässt sich kaum formen.

### Dürfen Kinder Höhlen graben?
Besser nicht. Schneehöhlen können einstürzen, deshalb baut nur niedrige Mauern.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 45, 120, 'free', 0.00, 'none', 'easy', false, true, array['winter']::text[], array['schnee']::text[], array['Eimer und Förmchen', 'Schaufeln', 'wasserfeste Kleidung', 'warme Handschuhe']::text[], '1. Feuchten, formbaren Schnee suchen, am besten bei Temperaturen um 0 Grad.
2. Schnee in Eimer füllen, festdrücken und als Ziegel stürzen.
3. Ziegel reihenweise zu einer Mauer aufschichten und mit Schnee verfugen.
4. Mit Fahne, Fenstern und Zinnen verzieren.', 'Keine tiefen Höhlen oder Tunnel graben, Einsturzgefahr. Burg nur so hoch bauen, dass sie niemanden gefährdet. Auf Aufwärmpausen und trockene Kleidung achten.', array['Kostenlos und für alle Altersstufen', 'Teamarbeit mit klaren Aufgaben für mehrere Kinder', 'Bleibt als Spielort noch Tage stehen']::text[], array['Nur bei Schnee möglich', 'Pulverschnee eignet sich nicht zum Bauen']::text[], 'Schneeburg bauen mit Kindern: Winterspaß im Garten', 'Schneeburg selber bauen: Anleitung mit Eimer und Förmchen für Familien. Ideen, Rollenverteilung und Sicherheitstipps für Schneetage.', true, 'draft', false),
  ('Schatzsuche mit selbstgemalter Karte', 'schatzsuche-mit-selbstgemalter-karte', 'Eine Schatzkarte zeichnen, altern lassen und gemeinsam im Garten oder Park einen Schatz suchen.', 'Ein Elternteil oder ein älteres Kind versteckt einen kleinen Schatz und zeichnet eine Karte mit Hinweisen. Die Karte wird mit kaltem Tee leicht gefärbt, damit sie alt aussieht, und die Suche kann beginnen. Mehrere Kinder können gemeinsam suchen oder in Teams gegeneinander antreten. Der Schatz kann aus Süßigkeiten, kleinen Spielzeugen oder Gutscheinen bestehen.

### Für wen ist das Abenteuer geeignet?
Die Suche passt für Kinder ab etwa vier Jahren, die Rätsel lassen sich leicht anpassen. Ältere Kinder gestalten Karte und Rätsel selbst.

### Tipps für Familien mit mehreren Kindern
Mit mehreren Kindern funktionieren Teams mit je einer eigenen Karte oder eine Staffel-Schatzsuche mit Stationen. Gebt jedem Team eine eigene Aufgabe, damit alle gleichmäßig eingebunden sind. Ein gemeinsamer Schatz zum Teilen vermeidet Streit.

### Varianten und Ideen zum Weitermachen
- Rätsel in Reimen schreiben
- Zahlenschloss oder Geheimschrift einbauen
- Die Karte als Erinnerung aufbewahren

### Wie macht man eine Schatzkarte alt?
Papier kurz in kalten Tee tauchen, trocknen lassen und die Ränder vorsichtig einreißen.

### Was kommt in den Schatz?
Kleine Spielsachen, Süßigkeiten, selbstgemachte Gutscheine oder Aufkleber. Bei kleinen Kindern auf Kleinteile achten.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 45, 90, 'low', 5.00, 'moderate', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken']::text[], array['Papier und Stifte', 'kalter Tee zum Färben', 'kleine Schatzkiste', 'Kleinigkeiten als Schatz']::text[], '1. Schatz verstecken und Weg mit drei bis fünf Stationen planen.
2. Karte zeichnen und Hinweise oder Rätsel für jede Station schreiben.
3. Papier kurz in kalten Tee tauchen und trocknen lassen.
4. Suche starten und am Ziel den Schatz gemeinsam öffnen.', 'Keine Verstecke an gefährlichen Stellen wie Hängen oder Gewässern wählen. Kleinteile nur für Kinder ab drei Jahren verwenden.', array['Beschäftigt mehrere Kinder und Altersstufen zugleich', 'Lässt sich beliebig anpassen: Garten, Park oder Wohnung', 'Verbindet Kreativität mit Bewegung']::text[], array['Vorbereitung durch einen Erwachsenen nötig', 'Rätsel müssen zum Alter der Kinder passen']::text[], 'Schatzsuche für Kinder: Karte malen und suchen', 'Schatzsuche mit selbstgemalter Karte: Anleitung, Rätselideen und Tipps für Garten oder Park. Kindergeburtstag und Familienabenteuer.', true, 'draft', false),
  ('Familien-Zeitkapsel vergraben', 'familien-zeitkapsel', 'Erinnerungen, Zeichnungen und Wünsche in einer Dose verstecken und in einem Jahr wieder ausgraben.', 'Jedes Familienmitglied legt etwas in eine wasserdichte Dose: eine Zeichnung, ein Foto, einen Brief an sein zukünftiges Ich oder einen Lieblingsgegenstand. Die Dose wird vergraben, der Ort markiert, und nach einem Jahr feierlich wieder geöffnet. Das Projekt macht deutlich, wie sehr sich Kinder und Interessen verändern.

### Für wen ist das Abenteuer geeignet?
Das Projekt eignet sich für alle Altersgruppen, jedes Familienmitglied kann etwas beisteuern. Kleinere Kinder malen, größere schreiben Briefe.

### Tipps für Familien mit mehreren Kindern
Jedes Kind legt mindestens drei Dinge hinein: eine Zeichnung, einen Wunsch und einen Gegenstand. So bleibt die Dose später für alle spannend. Legt gemeinsam ein Öffnungsdatum fest und haltet es im Kalender fest.

### Varianten und Ideen zum Weitermachen
- Eine Frage-Liste mit aktuellen Lieblingssachen ergänzen
- Einen Brief mit Fragen an euer künftiges Ich schreiben
- Jedes Jahr eine neue Kapsel anlegen

### Wie lange sollte eine Zeitkapsel vergraben bleiben?
Ein Jahr funktioniert gut für Kinder. Für längere Zeiträume braucht es eine besonders dichte Verpackung und einen sicheren Ort.

### Was darf nicht hinein?
Lebensmittel, Batterien und Dinge, die verrotten oder auslaufen könnten.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 45, 90, 'low', 5.00, 'light', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken']::text[], array['wasserdichte Dose oder Box', 'Papier und Stifte', 'Fotos und Erinnerungsstücke', 'kleine Schaufel']::text[], '1. Dose auswählen und jedes Familienmitglied bitten, etwas hineinzulegen.
2. Briefe an das zukünftige Ich schreiben oder malen.
3. Dose im eigenen Garten vergraben und Platz mit Foto und Skizze markieren.
4. Termin für die Ausgrabung in einem Jahr in den Kalender eintragen.', 'Nur auf eigenem Grundstück oder mit Erlaubnis vergraben, vorher auf Leitungen achten. Keine Lebensmittel oder verderblichen Dinge einlegen.', array['Bleibt als gemeinsame Erinnerung lange wirksam', 'Kinder jeden Alters können sich beteiligen', 'Kostet fast nichts']::text[], array['Auf das Wiederausgraben muss man ein Jahr warten', 'Braucht passenden Platz, am besten im eigenen Garten']::text[], 'Zeitkapsel vergraben: Familienprojekt mit Erinnerungen', 'Familien-Zeitkapsel vergraben: Was hineingehört, wie ihr sie sicher verpackt und wann ihr sie öffnet. Anleitung für ein besonderes Familienprojekt.', true, 'draft', false),
  ('Naturfarben herstellen und malen', 'naturfarben-herstellen', 'Aus Rote Bete, Kurkuma, Spinat und Blaukraut eigene Farben anrühren und damit malen.', 'Aus Lebensmitteln lassen sich kräftige Farben gewinnen: Rote Bete ergibt Rot-Rosa, Kurkuma Gelb, Spinat Grün, Rotkohl Violett bis Blau. Ihr kocht kleine Mengen ein, lasst die Farben abkühlen und malt damit auf dickem Papier. Ein Spritzer Zitrone oder Natron verändert beim Rotkohl die Farbe, was Kinder begeistert.

### Für wen ist das Abenteuer geeignet?
Das Experiment ist ab etwa fünf Jahren geeignet, mit Erwachsenen beim Kochen. Größere Kinder beobachten und dokumentieren die Farbwechsel.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind eine Farbe zuständig sein und mit den anderen tauschen. Das stärkt die Zusammenarbeit und sorgt für eine große Palette. Malkittel und Folie schützen Tisch und Kleidung.

### Varianten und Ideen zum Weitermachen
- Mit Zitrone und Natron Farbwechsel beim Rotkohl testen
- Ein Gemeinschaftsbild auf einer langen Papierrolle malen
- Ostereier mit Zwiebelschalen färben

### Welche Lebensmittel eignen sich für Naturfarben?
Rote Bete, Kurkuma, Spinat, Rotkohl, Heidelbeeren und Zwiebelschalen liefern kräftige Farben.

### Sind Naturfarben lichtecht?
Meist nicht. Die Farben verblassen mit der Zeit, das Bild sollte also nicht dauerhaft in der Sonne hängen.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 45, 90, 'low', 8.00, 'moderate', 'medium', true, false, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'trocken']::text[], array['Rote Bete, Kurkuma, Spinat, Rotkohl', 'kleine Töpfe und Schälchen', 'Pinsel', 'dickes Zeichenpapier', 'Malkittel']::text[], '1. Gemüse klein schneiden und je in einem Topf mit wenig Wasser kurz aufkochen.
2. Sud abseihen, abkühlen lassen und in Schälchen füllen.
3. Mit Pinsel auf dickem Papier malen und trocknen lassen.
4. Beim Rotkohl-Sud einen Spritzer Zitronensaft oder eine Prise Natron probieren und die Farbänderung beobachten.', 'Kochen und Umgang mit heißem Sud nur durch Erwachsene. Tischdecke und Malkittel nutzen, Farben können Kleidung färben. Nur Lebensmittel verwenden, keine Zusätze.', array['Lehrreich und zugleich kreativ', 'Farben stammen aus der Küche', 'Gut für Regentage und für mehrere Kinder am Tisch']::text[], array['Farben sind nicht lichtecht und verblassen mit der Zeit', 'Kochen und Aufräumen erfordern Zeit']::text[], 'Naturfarben herstellen: Malen mit Gemüse und Gewürzen', 'Naturfarben selber machen: Mit Rote Bete, Kurkuma und Rotkohl Farben herstellen und malen. Anleitung, Tipps und Experiment für Familien.', true, 'draft', false),
  ('Schattentheater mit Taschenlampe', 'schattentheater', 'Mit einem Bettlaken, einer Lampe und Pappfiguren eine eigene Vorstellung aufführen.', 'Ein Bettlaken wird aufgehängt oder gespannt, dahinter steht eine helle Lampe. Aus Pappe schneidet ihr Figuren und befestigt sie an Stäben. Mit den Händen lassen sich außerdem einfache Tiere formen. Die Kinder denken sich eine Geschichte aus und führen sie der Familie vor, am besten im abgedunkelten Raum.

### Für wen ist das Abenteuer geeignet?
Schon ab drei Jahren macht das Spiel Spaß, ältere Kinder schreiben Geschichten und bauen Figuren. Für Kinder gemischter Altersgruppen ideal.

### Tipps für Familien mit mehreren Kindern
Verteilt Aufgaben: Lampe, Figuren, Erzähler, Zuschauer. Wechselt nach jeder Geschichte. Mit mehreren Kindern entsteht so ein kleines Ensemble, in dem jeder wichtig ist.

### Varianten und Ideen zum Weitermachen
- Märchen oder Tiergeschichten nachspielen
- Handschatten üben und ein Ratespiel daraus machen
- Mit farbigem Transparentpapier Farbeffekte erzeugen

### Welche Lampe eignet sich?
Eine helle Taschenlampe oder eine LED-Schreibtischlampe, die nicht heiß wird.

### Welches Tuch eignet sich als Leinwand?
Ein helles, dünnes Bettlaken ohne Muster. Es sollte gut gespannt sein, damit die Schatten scharf werden.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 45, 90, 'low', 3.00, 'moderate', 'easy', true, false, array['fruehling', 'herbst', 'winter']::text[], array['regen', 'dunkel']::text[], array['helles Bettlaken', 'Taschenlampe oder Schreibtischlampe', 'Pappe', 'Schere', 'Holzstäbe oder Strohhalme']::text[], '1. Laken zwischen zwei Stuhllehnen oder an einer Leine spannen.
2. Figuren aus Pappe schneiden und an Stäben befestigen.
3. Lampe hinter dem Laken aufstellen und Zuschauer davor setzen.
4. Geschichte erzählen und die Figuren vor der Lampe bewegen.', 'Lampe nicht zu nah am Stoff platzieren. Wärmeentwickelnde Lampen nicht direkt an das Laken lehnen. Scheren nur mit Aufsicht benutzen.', array['Ideal für Regentage', 'Alle Altersgruppen können mitmachen', 'Fördert Fantasie und Erzählen']::text[], array['Raum muss verdunkelt werden', 'Basteln der Figuren dauert etwas']::text[], 'Schattentheater selber machen: Spaß für Regentage', 'Schattentheater mit Kindern: Figuren aus Pappe, Bettlaken und Lampe. Anleitung, Geschichten und Ideen für Regentage.', true, 'draft', false),
  ('Höhlenbau im Wohnzimmer', 'hoehlenbau-im-wohnzimmer', 'Aus Decken, Stühlen und Kissen eine große Höhle bauen und dort Geschichten erzählen.', 'Aus Stühlen, Decken, Kissen und Wäscheklammern wird im Wohnzimmer eine große Höhle. Mit Lichterketten und Taschenlampen gemütlich ausgestattet, lädt sie zum Vorlesen, Hörspielhören oder Picknick ein. Mehrere Kinder können gemeinsam planen und bauen, wer will, schläft sogar dort.

### Für wen ist das Abenteuer geeignet?
Das Projekt gefällt Kindern jeden Alters. Größere Kinder planen und bauen, Kleinere richten ein und kuscheln.

### Tipps für Familien mit mehreren Kindern
Teilt die Höhle in Zonen auf: Leseecke, Schlafecke, Schatzkammer. Jedes Kind darf eine Zone gestalten. So gibt es keinen Streit um Plätze, und alle fühlen sich zuhause.

### Varianten und Ideen zum Weitermachen
- Eine Lesenacht mit Taschenlampe veranstalten
- Als Piratenschiff oder Raumstation umdekorieren
- In der Höhle ein Picknick machen

### Welche Materialien braucht man?
Decken, Laken, Stühle, Kissen, Wäscheklammern und eine LED-Lichterkette.

### Ist eine Höhle zum Schlafen geeignet?
Ja, wenn alles stabil ist und keine Wärmequellen in der Nähe sind. Für Kleinkinder besser mit Aufsicht.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 60, 150, 'free', 0.00, 'light', 'easy', true, false, array['fruehling', 'herbst', 'winter']::text[], array['regen', 'frost', 'schnee']::text[], array['Decken und Laken', 'Stühle oder Wäscheständer', 'Kissen', 'Wäscheklammern', 'LED-Lichterkette']::text[], '1. Stühle und Möbel als Gerüst anordnen.
2. Decken darüber legen und mit Klammern fixieren.
3. Höhle mit Kissen, Matratzen und Lichterkette gemütlich einrichten.
4. Gemeinsam vorlesen, Hörspiel hören oder Snacks essen.', 'Decken nicht über Kerzen, Heizkörper oder warme Lampen legen, nur LED-Licht verwenden. Standfestigkeit prüfen, damit nichts umkippt.', array['Kostenlos und sofort umsetzbar', 'Beschäftigt mehrere Kinder lange', 'Sehr gut für Regen- und Schneetage']::text[], array['Wohnzimmer wirkt danach chaotisch', 'Aufräumen sollte fest eingeplant werden']::text[], 'Höhle bauen im Wohnzimmer: Spielidee für Regentage', 'Höhle im Wohnzimmer bauen: Anleitung mit Decken, Stühlen und Lichterkette. Ideen für Regentage, Vorlesezeit und Familienabende.', true, 'draft', false),
  ('Pizza-Duell: Jeder belegt seine eigene', 'pizza-duell', 'Jedes Kind belegt seine eigene Mini-Pizza, am Ende gibt es eine Jury und Preise.', 'Ihr bereitet Pizzateig vor oder nehmt fertigen, stellt viele Zutaten bereit und jedes Familienmitglied gestaltet eine eigene Pizza. Nach dem Backen bewertet eine Jury nach Kategorien wie Kreativität, Optik oder Geschmack. Das funktioniert besonders gut mit mehreren Kindern, die gern selbst entscheiden.

### Für wen ist das Abenteuer geeignet?
Ab etwa vier Jahren können Kinder Zutaten verteilen, mit Aufsicht auch schneiden. Größere Kinder übernehmen die Jury.

### Tipps für Familien mit mehreren Kindern
Jedes Kind bekommt einen eigenen Pizzaboden und eine eigene Schale mit Zutaten. So entstehen individuelle Kreationen ohne Konkurrenz um Platz. Am Ende probiert jeder jede Pizza, die Jury vergibt Preise für Optik, Kreativität und Geschmack.

### Varianten und Ideen zum Weitermachen
- Dessert-Pizza mit Obst und Schokolade backen
- Pizza-Gesichter oder Tierpizzen formen
- Mit Teamaufgaben zusammen eine Riesenpizza belegen

### Welchen Teig nimmt man für kleine Pizzen?
Fertigen Pizzateig aus dem Kühlregal oder selbstgemachten Hefeteig. Wichtig ist, dass er sich gut ausrollen lässt.

### Wie vermeidet man Streit um Zutaten?
Portioniert vorher in Schalen oder gebt jedem Kind seinen eigenen Zutatenteller.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 75, 120, 'low', 12.00, 'moderate', 'easy', true, false, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'trocken']::text[], array['Pizzateig', 'Tomatensauce', 'Käse und verschiedene Beläge', 'Backbleche', 'Schürzen']::text[], '1. Teig ausrollen und kleine Pizzaböden formen.
2. Zutaten in Schälchen bereitstellen, jedes Kind belegt seine Pizza.
3. Im vorgeheizten Ofen backen, Heißes nur durch Erwachsene hantieren lassen.
4. Jury-Runde mit Bewertungskategorien und kleinen Preisen durchführen.', 'Ofen und heiße Bleche nur durch Erwachsene bedienen. Allergien und Unverträglichkeiten bei den Belägen beachten. Messer nur mit Aufsicht.', array['Alle essen am Ende satt', 'Jedes Kind kann selbst entscheiden', 'Gut für Regentage und Geburtstage']::text[], array['Küche muss danach aufgeräumt werden', 'Kosten steigen mit Anzahl der Zutaten']::text[], 'Pizza-Duell: Pizza backen mit Kindern', 'Pizza selber belegen mit Kindern: Das Pizza-Duell mit Jury für Familien. Ablauf, Teig-Tipps und Ideen für Regentage und Geburtstage.', true, 'draft', false),
  ('Mini-Olympiade im Garten', 'mini-olympiade-im-garten', 'Fünf einfache Disziplinen, Teams, Punktetafel und eine Siegerehrung – alles aus Material, das ihr schon habt.', 'Im Garten oder im Park denkt ihr euch fünf bis sechs Disziplinen aus: Sackhüpfen, Eierlauf mit Löffel, Dosenwerfen, Weitsprung, Gummistiefel-Weitwurf. Die Kinder bilden Teams, sammeln Punkte und bekommen am Ende Medaillen aus Pappe. Mit mehreren Kindern entsteht schnell Wettkampfstimmung, die Regeln lassen sich leicht an das Alter anpassen.

### Für wen ist das Abenteuer geeignet?
Die Disziplinen lassen sich für Kinder von drei bis zwölf Jahren anpassen. Kleine Kinder bekommen kürzere Wege oder Vorsprung.

### Tipps für Familien mit mehreren Kindern
Mischt die Teams nach Alter und Geschick und gebt jedem Team einen Namen. Vergebt Extrapunkte für Fairness und Anfeuern. Bei vielen Kindern funktioniert ein Stationen-Parcours, an dem alle gleichzeitig spielen.

### Varianten und Ideen zum Weitermachen
- Eine Eröffnungsfeier mit Fackel aus Papier
- Disziplinen wie Sackhüpfen, Eierlauf und Dosenwerfen
- Medaillen aus Pappe und Wolle basteln

### Welche Disziplinen sind einfach umzusetzen?
Sackhüpfen, Eierlauf, Dosenwerfen, Weitsprung und Gummistiefel-Weitwurf brauchen kaum Material.

### Wie bleibt es fair?
Teams mischen, Regeln vorher klären und Punkte auch für Fairplay vergeben.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 60, 120, 'free', 0.00, 'light', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'sonnig']::text[], array['Löffel und Bälle oder Kartoffeln', 'Kissenbezüge für Sackhüpfen', 'Dosen zum Werfen', 'Papier für Punktetafel']::text[], '1. Disziplinen sammeln und Regeln festlegen.
2. Teams mischen, damit sie ungefähr ausgeglichen sind.
3. Alle Disziplinen nacheinander spielen und Punkte eintragen.
4. Siegerehrung mit selbstgebastelten Medaillen.', 'Auf rutschfesten Untergrund achten, genug Platz zwischen den Stationen. Trinkpausen einplanen. Schwächere Teilnehmer durch angepasste Regeln unterstützen.', array['Ohne Spezialmaterial', 'Gut für große Familien und Kindergruppen', 'Bewegung und Teamgeist in einem']::text[], array['Organisation durch einen Erwachsenen sinnvoll', 'Streit um Regeln möglich, vorher klar absprechen']::text[], 'Mini-Olympiade im Garten: Spielideen für Kinder', 'Mini-Olympiade im Garten: Disziplinen, Regeln und Medaillen für Familien. Spielideen für Kindergeburtstag und Familiennachmittag.', true, 'draft', false),
  ('Papierflieger-Wettbewerb', 'papierflieger-wettbewerb', 'Verschiedene Flugzeugmodelle falten und testen, wessen Flieger am weitesten und längsten fliegt.', 'Ihr faltet mehrere Modelle aus normalem Papier und testet sie in drei Kategorien: weitester Flug, längste Flugzeit, schönster Kunstflug. Die Kinder tüfteln selbst an Flügeln und Gewichten und beobachten, wie sich kleine Änderungen auswirken. Mit einem Maßband wird gemessen, die besten Flieger kommen ins Finale.

### Für wen ist das Abenteuer geeignet?
Das Falten gelingt ab etwa fünf Jahren, größere Kinder tüfteln an Flügeln und Gewichten. Auch Erwachsene machen gern mit.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind ein eigenes Modell erfinden und in einer Testrunde verbessern. Mit mehreren Kindern entsteht so eine Flotte, die in drei Kategorien gegeneinander antritt. Ein Maßband macht den Wettbewerb fair.

### Varianten und Ideen zum Weitermachen
- Wettbewerb draußen im Wind und drinnen vergleichen
- Flieger mit Stiften und Aufklebern dekorieren
- Ein Ziel aufstellen und Treffer zählen

### Welches Papier ist am besten?
Normales Druckerpapier funktioniert gut, schwereres Papier fliegt weiter, leichteres länger.

### Wie fliegen Papierflieger weiter?
Mit gleichmäßig gefalteten Flügeln, einem festen Wurf und einem leicht schweren Bug.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 30, 60, 'free', 0.00, 'none', 'easy', true, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['trocken', 'regen']::text[], array['Papier', 'Maßband', 'Stoppuhr', 'Büroklammern zum Beschweren']::text[], '1. Mehrere Faltanleitungen ausprobieren oder gemeinsam erfinden.
2. Startlinie festlegen und in drei Kategorien messen.
3. Verbesserungen testen: Flügel biegen, Klammer ans Ende setzen.
4. Gewinner küren und Flugzeuge dekorieren.', 'Beim Werfen auf Mitspieler achten und in leerer Richtung starten. Drinnen auf zerbrechliche Gegenstände achten.', array['Fast ohne Kosten und Vorbereitung', 'Drinnen und draußen möglich', 'Fördert Ausprobieren und Technikverständnis']::text[], array['Windiges Wetter stört Messungen', 'Ältere Kinder wollen oft komplexere Modelle']::text[], 'Papierflieger-Wettbewerb: Falten, testen, gewinnen', 'Papierflieger-Wettbewerb für Kinder: Modelle falten, testen und vergleichen. Tipps für Weitflug, Flugdauer und Kunstflug.', true, 'draft', false),
  ('Familien-Podcast aufnehmen', 'familien-podcast', 'Mit dem Smartphone eine Interview- oder Geschichtensendung aufnehmen – nur für die Familie.', 'Ihr nutzt die Sprachmemo-Funktion eures Smartphones und nehmt eine kleine Familiensendung auf. Die Kinder interviewen Eltern oder Großeltern, erzählen eine Gutenacht-Geschichte oder moderieren eine Nachrichtensendung. Am Ende wird die Aufnahme zusammen angehört. Das schult Sprechen, Zuhören und Selbstvertrauen.

### Für wen ist das Abenteuer geeignet?
Schon ab etwa fünf Jahren erzählen Kinder gern. Größere Kinder planen Fragen und moderieren.

### Tipps für Familien mit mehreren Kindern
Verteilt Rollen: Moderator, Interviewpartner, Techniker. Mit mehreren Kindern kann jeder eine eigene Folge gestalten. Hört danach alles gemeinsam an und feiert die Lieblingsstellen.

### Varianten und Ideen zum Weitermachen
- Großeltern interviewen
- Eine Hörspielfolge mit Geräuschen erfinden
- Reise- oder Wochenrückblick aufnehmen

### Welche Fragen eignen sich für ein Interview?
Was war dein schönster Tag? Was hast du als Kind gespielt? Was wünschst du dir für die Zukunft?

### Ist eine Veröffentlichung sinnvoll?
Für die Familie lieber nicht öffentlich. Mit Einverständnis aller Beteiligten kann man Aufnahmen privat teilen.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 30, 60, 'free', 0.00, 'light', 'easy', true, false, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'trocken']::text[], array['Smartphone mit Sprachmemo', 'Zettel für Fragen', 'ruhiger Raum']::text[], '1. Thema und kurze Fragen oder eine Geschichte vorbereiten.
2. Sprachmemo starten und in Ruhe sprechen lassen.
3. Aufnahme gemeinsam anhören und über die Lieblingsstellen sprechen.
4. Auf Wunsch einen Jingle oder Geräusche ergänzen.', 'Aufnahmen nur für die Familie behalten und nicht ohne Einverständnis aller Beteiligten im Internet veröffentlichen.', array['Gut an Regentagen', 'Stärkt Sprechfreude und Zuhören', 'Entstehende Aufnahmen werden zur Erinnerung']::text[], array['Schüchterne Kinder brauchen Zeit', 'Hintergrundgeräusche stören manchmal']::text[], 'Familien-Podcast aufnehmen: Idee für Regentage', 'Familien-Podcast mit dem Smartphone aufnehmen: Interviewfragen, Geschichten und Tipps für Aufnahme und Datenschutz. Kreativer Familienspaß.', true, 'draft', false),
  ('Lichtmalerei mit Taschenlampen', 'lichtmalerei', 'Im Dunkeln mit Lampen in die Luft malen und mit Langzeitbelichtung als Foto festhalten.', 'In einem abgedunkelten Raum oder am Abend im Garten malt ihr mit Taschenlampen, Knicklichtern oder Wunderkerzen-Alternativen Figuren in die Luft. Das Smartphone steht auf einem festen Untergrund und belichtet mit Nachtmodus oder einer Langzeitbelichtungs-Funktion mehrere Sekunden lang. So entstehen leuchtende Zeichnungen, die ihr im Anschluss anschauen könnt.

### Für wen ist das Abenteuer geeignet?
Das Projekt eignet sich für Kinder ab etwa sechs Jahren, die ruhig zeichnen können. Jüngere Kinder malen große, einfache Formen.

### Tipps für Familien mit mehreren Kindern
Teilt die Rollen auf: Fotograf, Maler, Regie. Wechselt nach jedem Bild. Mit mehreren Kindern könnt ihr gemeinsame Bilder zeichnen, bei denen jeder einen Teil beiträgt.

### Varianten und Ideen zum Weitermachen
- Namen oder Sterne in die Luft schreiben
- Mit verschiedenen Farben und Lampen experimentieren
- Ein Fotoalbum mit Lichtbildern anlegen

### Welche Kameraeinstellung braucht man?
Nachtmodus oder Langzeitbelichtung, dazu ein fester Untergrund. Kinder malen langsam, damit die Linien sichtbar werden.

### Funktioniert das auch ohne Stativ?
Ja, wenn das Smartphone auf einem Stapel Bücher oder einem Tisch fest steht.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 30, 60, 'free', 0.00, 'moderate', 'medium', true, true, array['herbst', 'winter', 'fruehling']::text[], array['dunkel', 'trocken']::text[], array['Smartphone mit Nachtmodus oder Langzeitbelichtung', 'Taschenlampen oder Knicklichter', 'festen Untergrund oder Stativ', 'dunkle Kleidung']::text[], '1. Kamera auf festen Untergrund stellen und Langzeitbelichtungs-Modus oder Nachtmodus aktivieren.
2. Raum abdunkeln, Kinder in dunkler Kleidung malen mit Lampen in die Luft.
3. Aufnahme auslösen, in Ruhe zeichnen und das Ergebnis betrachten.
4. Motive wechseln: Sterne, Namen, Tiere.', 'Im Dunkeln auf Hindernisse achten und nur ruhige Bewegungen machen. Keine offenen Flammen oder Wunderkerzen in Innenräumen verwenden.', array['Beeindruckende Ergebnisse mit einfachen Mitteln', 'Funktioniert drinnen wie draußen', 'Gut für mehrere Kinder abwechselnd']::text[], array['Ergebnis hängt vom Smartphone ab', 'Etwas Ausprobieren nötig']::text[], 'Lichtmalerei mit Kindern: Langzeitbelichtung zuhause', 'Lichtmalerei mit Taschenlampen: Anleitung für Langzeitbelichtung mit dem Smartphone. Kreatives Fotoabenteuer für Familien im Dunkeln.', true, 'draft', false),
  ('Regenmesser bauen und Wetter-Tagebuch', 'regenmesser-wetter-tagebuch', 'Aus einer Plastikflasche einen Regenmesser bauen und eine Woche lang Wetterdaten sammeln.', 'Eine durchsichtige Plastikflasche wird oben abgeschnitten, umgedreht als Trichter eingesetzt und mit einer Skala aus Millimetern beklebt. Draußen aufgestellt, sammelt sie Regenwasser. Die Kinder tragen täglich Niederschlag, Temperatur und Wolkenbild in ein Wetter-Tagebuch ein. Ein Millimeter Niederschlag entspricht dabei einem Liter pro Quadratmeter.

### Für wen ist das Abenteuer geeignet?
Das Projekt passt für Grundschulkinder, die lesen und messen können. Jüngere helfen beim Ablesen.

### Tipps für Familien mit mehreren Kindern
Verteilt Aufgaben: Ein Kind liest ab, eines trägt ein, eines zeichnet das Wetter. Mit mehreren Kindern kann jedes eine Woche leiten. Am Wochenende wertet ihr gemeinsam aus.

### Varianten und Ideen zum Weitermachen
- Temperatur, Wind und Wolken ergänzen
- Eine Wetterstation aus mehreren Messgeräten bauen
- Das Wetter im Monatsvergleich dokumentieren

### Wie funktioniert ein selbstgebauter Regenmesser?
Regenwasser sammelt sich in der Flasche, auf der Skala lest ihr die Höhe ab. Ein Millimeter entspricht einem Liter pro Quadratmeter.

### Wo stellt man ihn auf?
Auf eine freie, ebene Fläche, nicht unter Bäumen oder Dächern, und standsicher fixiert.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 30, 60, 'free', 0.00, 'moderate', 'easy', false, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'bewoelkt']::text[], array['leere Plastikflasche', 'Schere oder Cuttermesser (nur Erwachsene)', 'Lineal und Klebeband', 'Notizbuch']::text[], '1. Flasche oben abschneiden und den Oberteil als Trichter umgedreht einsetzen.
2. Eine Millimeterskala von unten aufkleben und die Flasche sicher draußen aufstellen.
3. Täglich zur gleichen Zeit die Menge ablesen und Wetter ins Tagebuch eintragen.
4. Nach einer Woche gemeinsam auswerten, was am meisten Regen gebracht hat.', 'Schneiden der Flasche nur durch Erwachsene. Behälter standsicher platzieren, damit er nicht umkippt oder Tiere anlockt.', array['Lernprojekt über mehrere Tage', 'Gut für Regenwetter und Wetterbegeisterte', 'Material meist vorhanden']::text[], array['Ergebnis zeigt sich erst über einige Tage', 'Bei Frost kann der Behälter einfrieren']::text[], 'Regenmesser selber bauen: Wetter-Tagebuch für Kinder', 'Regenmesser selber bauen und ein Wetter-Tagebuch führen: Anleitung aus Plastikflasche für Familien. Lernprojekt für Regentage.', true, 'draft', false),
  ('Wolken-Detektive', 'wolken-detektive', 'Auf einer Decke liegen, Wolkenformen deuten und dazu Geschichten erfinden.', 'Ihr legt euch auf eine Decke ins Gras und schaut gemeinsam in den Himmel. Jede Wolke bekommt einen Namen: Drache, Schaf, Burg. Ihr erfindet Geschichten dazu, schaut, wie sich die Formen verändern, und lernt nebenbei einfache Wolkenarten wie Haufenwolken (Cumulus) und Schleierwolken (Cirrus) kennen. Perfekt als ruhige Pause nach einem aktiven Tag.

### Für wen ist das Abenteuer geeignet?
Das Abenteuer passt für alle Altersgruppen, schon Kleinkinder sehen Tiere und Figuren. Größere Kinder lernen die Wolkenarten.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind einen Wolkennamen und lasst es eine Geschichte erzählen. So wird aus dem Liegen ein gemeinsames Fantasiespiel. Mit mehreren Kindern könnt ihr die Wolken-Geschichten aneinanderhängen.

### Varianten und Ideen zum Weitermachen
- Eine Wolkenkarte mit Zeichnungen führen
- Wolken fotografieren und zuordnen
- Wetter aus Wolken vorhersagen

### Welche Wolkenarten kann man erkennen?
Haufenwolken (Cumulus), Schleierwolken (Cirrus) und Schichtwolken (Stratus) sind einfache Einstiege.

### Wann ist die beste Zeit?
An sonnigen Tagen mit einzelnen Wolken. Bei Gewitterwolken sofort ins Haus gehen.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 20, 45, 'free', 0.00, 'none', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'bewoelkt']::text[], array['Decke', 'Wolkenkarte oder Bestimmungs-App (optional)']::text[], '1. Eine trockene Wiese oder einen Park auswählen und eine Decke ausbreiten.
2. Auf den Rücken legen und eine Minute still schauen.
3. Reihum eine Wolke aussuchen, benennen und eine kurze Geschichte erfinden.
4. Nach zehn Minuten schauen, wie sich die Wolken verändert haben.', 'Nicht in die Sonne schauen. Bei Gewitterwolken oder aufziehendem Sturm sofort den Platz verlassen. Sonnenschutz und Trinkwasser mitnehmen.', array['Entspannt und kostet nichts', 'Fördert Fantasie und Erzählfreude', 'Ideal als Pause bei langen Ausflügen']::text[], array['Bei komplett bedecktem oder wolkenlosem Himmel weniger spannend', 'Wenig Bewegung, für Bewegungsfreudige als Ergänzung gedacht']::text[], 'Wolken beobachten mit Kindern: Wolken-Detektive', 'Wolken beobachten mit Kindern: Wolkenarten erkennen, Geschichten erfinden und entspannen. Ruhiges Naturabenteuer für Familien.', true, 'draft', false),
  ('Baumrinden-Abdrücke sammeln', 'baumrinden-abdruecke', 'Mit Papier und Wachsmalstift die Rinde verschiedener Bäume abrubbeln und ein Rindenmuseum anlegen.', 'Jede Baumrinde hat ihr eigenes Muster: tief gefurcht, glatt, schuppig oder papierartig. Mit einem Blatt Papier und einem Wachsmalstift rubbelt ihr diese Muster ab und sammelt so ein kleines Archiv. Dabei lernen Kinder, genau hinzusehen und Bäume am Stamm zu unterscheiden, auch wenn gerade keine Blätter dranhängen.

### Für wen ist das Abenteuer geeignet?
Schon ab drei Jahren macht das Rubbeln Spaß, größere Kinder ordnen die Abdrücke den Baumarten zu und beschriften sie.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind eine eigene Farbe und einen eigenen Baum. Am Ende legt ihr alle Abdrücke nebeneinander und raten gemeinsam, welcher Baum welches Muster hat. So hat jedes Kind seinen Anteil, und es entsteht ein gemeinsames Rindenmuseum.

### Varianten und Ideen zum Weitermachen
- Abdrücke zu einem Poster oder Fensterbild zusammenkleben
- Dieselbe Rinde im Sommer und im Winter vergleichen
- Auch Blätter, Gullideckel und Pflastersteine abrubbeln

### Welche Stifte eignen sich zum Rubbeln?
Dicke Wachsmalstifte ohne Papierhülle, die man flach halten kann. Auch Buntstifte funktionieren, sind aber weniger deckend.

### Ab welchem Alter funktioniert das?
Ab etwa drei Jahren mit Hilfe, ab fünf Jahren allein. Es gibt keine richtige oder falsche Technik.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 30, 60, 'free', 0.00, 'light', 'easy', false, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['trocken', 'bewoelkt']::text[], array['Papier (dünn, ungefärbt)', 'Wachsmalstifte ohne Papierhülle', 'Klemmbrett oder feste Unterlage', 'Klebeband']::text[], '1. Einen Baum mit gut erreichbarer Rinde wählen und das Papier mit Klebeband locker fixieren.
2. Den Wachsmalstift flach halten und gleichmäßig über das Papier rubbeln, bis das Muster erscheint.
3. Name oder Foto des Baums auf der Rückseite notieren.
4. Mehrere Bäume sammeln und die Abdrücke nebeneinander vergleichen: Welche Rinde fühlt sich wie an?', 'Nur Bäume am Wegrand nutzen und nicht auf Wurzeln klettern. Rinde nicht abschälen oder beschädigen. Auf Ameisen und Insekten am Stamm achten.', array['Funktioniert in allen Jahreszeiten, auch im Winter', 'Kostet fast nichts und passt für jedes Alter', 'Schult Beobachten und Unterscheiden']::text[], array['Dünnes Papier reißt bei zu viel Druck', 'Bei Regen ist die Rinde rutschig und das Papier wird nass']::text[], 'Baumrinden-Abdrücke mit Kindern: Rindenmuseum', 'Baumrinden-Abdrücke mit Kindern machen: Mit Papier und Wachsmalstift Muster abrubbeln und Bäume erkennen. Anleitung und Tipps für Familien.', true, 'draft', false),
  ('Waldbaden mit Kindern: Der Sinnesspaziergang', 'waldbaden-mit-kindern', 'Langsam durch den Wald gehen, alle Sinne einsetzen und mit Aufgaben wie Riechen, Lauschen und Fühlen zur Ruhe kommen.', 'Beim Waldbaden geht es nicht um Strecke oder Tempo, sondern ums bewusste Wahrnehmen. Ihr geht langsam durch den Wald und bekommt kleine Sinnesaufgaben: Was riecht ihr? Was hört ihr? Wie fühlt sich Moos an? Das beruhigt Kinder und Erwachsene und lässt den Alltag kurz hinter sich. Ein gutes Abenteuer für Familien, die nach einer hektischen Woche runterkommen wollen.

### Für wen ist das Abenteuer geeignet?
Der Spaziergang passt für alle Altersgruppen. Kleinere Kinder entdecken mit den Händen, ältere erzählen oder zeichnen ihre Eindrücke.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind pro Station einen Sinn, etwa Riechen, Lauschen oder Fühlen, und wechselt reihum. So hat jedes Kind eine Aufgabe, und niemand wird unruhig. Plant kurze Strecken ein, bei mehreren Kindern funktioniert ein Tempo, bei dem das langsamste bestimmt.

### Varianten und Ideen zum Weitermachen
- Eine Fünf-Sinne-Bingo-Karte mitbringen
- Mit Augenbinde einen Baum blind ertasten
- Eine Achtsamkeits-Geschichte vorlesen

### Was ist Waldbaden?
Ein achtsamer Spaziergang im Wald, bei dem es ums Wahrnehmen geht, nicht um Sport. Die Idee kommt ursprünglich aus Japan.

### Wie lange sollte ein Waldbad dauern?
Für Familien reichen 45 bis 90 Minuten mit mehreren Pausen.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 45, 90, 'free', 0.00, 'none', 'easy', false, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['trocken', 'bewoelkt']::text[], array['bequeme Schuhe', 'Decke zum Sitzen (optional)', 'kleines Notizbuch (optional)']::text[], '1. Handys wegstecken und gemeinsam vereinbaren: Wir gehen heute langsam und leise.
2. An einer Station nacheinander riechen, lauschen, fühlen und schauen. Jeder erzählt kurz, was er wahrnimmt.
3. Fünf Minuten still auf einer Decke sitzen und zählen, wie viele verschiedene Geräusche ihr hört.
4. Zum Abschluss erzählen, was am besten gefallen hat.', 'Wege nicht verlassen, Zecken-Check nach dem Waldbesuch. Bei Gewitter, Sturm oder starkem Wind nicht in den Wald gehen.', array['Beruhigt und lässt sich ohne Vorbereitung machen', 'Passt zu jeder Jahreszeit', 'Gut nach stressigen Wochen']::text[], array['Sehr bewegungsfreudige Kinder brauchen Zwischenaufgaben', 'Funktioniert besser ohne Ablenkung durch Handys']::text[], 'Waldbaden mit Kindern: Sinnesspaziergang', 'Waldbaden mit Kindern: Mit Riechen, Lauschen und Fühlen zur Ruhe kommen. Ablauf, Aufgaben und Tipps für einen entspannten Familienspaziergang.', true, 'draft', false),
  ('Flugsamen-Experiment: Wer fliegt am weitesten?', 'flugsamen-experiment', 'Ahornnasen, Löwenzahn und Kiefernzapfen testen: Wessen Samen fliegt am weitesten und am längsten?', 'Pflanzen verbreiten ihre Samen auf kreative Weise: Ahornnasen drehen wie kleine Hubschrauber, Löwenzahn schwebt mit seinem Schirm, Kletten haften im Fell. Ihr sammelt verschiedene Samen, testet ihre Flugeigenschaften und vergleicht sie. So lernen Kinder spielerisch, wie Natur Probleme löst, und haben dabei viel Spaß beim Werfen und Messen.

### Für wen ist das Abenteuer geeignet?
Ab etwa vier Jahren macht das Fallenlassen Spaß, Grundschulkinder messen und vergleichen genau.

### Tipps für Familien mit mehreren Kindern
Teilt Gruppen auf und lasst jedes Team einen Samen testen. Anschließend bewertet ihr gemeinsam, welcher am weitesten, am längsten oder am schönsten fliegt. Mit mehreren Kindern entsteht schnell ein richtiges Wettfliegen.

### Varianten und Ideen zum Weitermachen
- Eigene Flugsamen aus Papier nachbauen
- Samen in Tüten sammeln und später im Garten säen
- Fallschirme aus Taschentüchern basteln

### Welche Samen fliegen besonders weit?
Ahornnasen und Löwenzahn gelten als gute Flieger. Probieren geht über Studieren, denn die Windverhältnisse spielen mit.

### Darf man Samen mitnehmen?
Gesammelte Samen am Wegrand sind unproblematisch. In Schutzgebieten solltet ihr nichts mitnehmen.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 30, 60, 'free', 0.00, 'light', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'windstill']::text[], array['verschiedene Samen (Ahorn, Löwenzahn, Linde, Kiefer)', 'Maßband oder Schritte zählen', 'Stoppuhr']::text[], '1. Gemeinsam verschiedene Samen sammeln und kurz betrachten: Welcher sieht wie ein Flieger aus?
2. Samen aus gleicher Höhe fallen lassen und die Fallzeit stoppen.
3. Den Flugweg bei leichtem Wind messen oder schätzen.
4. Ergebnisse notieren und überlegen, warum manche Samen weiter kommen.', 'Nur Samen sammeln, die am Boden liegen oder leicht pflückbar sind. Keine Früchte essen. Nach dem Sammeln Hände waschen.', array['Verbindet Natur und Physik', 'Bringt Bewegung und Staunen', 'Funktioniert mit sehr wenig Aufwand']::text[], array['Nur in der Samenzeit, meist Frühling bis Herbst', 'Bei starkem Wind schwer zu messen']::text[], 'Flugsamen-Experiment mit Kindern: Ahornnasen testen', 'Flugsamen-Experiment für Familien: Ahornnasen, Löwenzahn und Co. sammeln, testen und vergleichen. Einfaches Naturabenteuer mit Messen.', true, 'draft', false),
  ('Naturmandala legen', 'naturmandala-legen', 'Aus Blättern, Blüten, Steinen und Zapfen ein farbenfrohes Mandala legen und fotografieren.', 'Ein Naturmandala ist ein kreisförmiges Muster, das ihr aus gesammelten Fundstücken auf dem Waldboden oder der Wiese legt. Die Kinder wählen Farben und Formen, und gemeinsam entsteht ein Kunstwerk, das nur für den Moment existiert. Danach wird es fotografiert und dem Wind oder dem Regen überlassen. Das Abenteuer macht Kreativität draußen möglich und braucht kaum Vorbereitung.

### Für wen ist das Abenteuer geeignet?
Das Abenteuer passt für alle Altersgruppen. Kleinere Kinder legen frei, größere planen Muster und Farbverläufe.

### Tipps für Familien mit mehreren Kindern
Jedes Kind übernimmt einen Ring oder einen Farbbereich. So fügt sich am Ende alles zusammen, und niemand muss um den besten Platz konkurrieren. Fotografiert den Entstehungsprozess in Etappen.

### Varianten und Ideen zum Weitermachen
- Mandala am Strand mit Muscheln und Steinen
- Im Herbst aus Laub, im Winter aus Zweigen legen
- Ein Fotoalbum der Naturmandalas anlegen

### Was ist ein Naturmandala?
Ein kreisförmiges Muster aus Naturmaterialien, das vorübergehend auf dem Boden gelegt wird.

### Wohin mit dem Mandala danach?
Einfach liegen lassen. Die Materialien kehren in den Kreislauf der Natur zurück.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 45, 90, 'free', 0.00, 'none', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'windstill']::text[], array['gesammelte Naturmaterialien', 'Smartphone oder Kamera']::text[], '1. Einen ebenen Platz wählen und einen Kreis mit einem Stock in die Erde ziehen.
2. Naturmaterialien nach Farben und Formen sammeln und sortieren.
3. Von der Mitte nach außen Ring für Ring legen, jedes Kind übernimmt einen Ring.
4. Das Mandala fotografieren und danach alles der Natur zurückgeben.', 'Nur herabgefallene Blätter, Blüten und Zapfen verwenden und keine Pflanzen ausreißen. Giftige Beeren und Pflanzen nicht in den Mund nehmen.', array['Fördert Kreativität und Ruhe', 'Alle Altersgruppen können beitragen', 'Hinterlässt keine Spuren']::text[], array['Wind kann das Mandala zerstören', 'Material hängt von der Jahreszeit ab']::text[], 'Naturmandala legen mit Kindern: Anleitung', 'Naturmandala mit Kindern legen: Aus Blättern, Blüten und Steinen ein Kunstwerk gestalten. Anleitung, Ideen und Tipps für Familien.', true, 'draft', false),
  ('Natur-Bingo für unterwegs', 'natur-bingo', 'Mit einer selbstgemachten Bingo-Karte Dinge in der Natur finden: ein rotes Blatt, eine Feder, ein Vogelnest.', 'Bei diesem Spiel hat jedes Kind eine Karte mit Dingen, die es draußen entdecken soll: ein gelbes Blatt, ein Tier, ein Stein mit Loch, etwas Weiches, etwas Glattes. Wer eine Reihe gefunden hat, ruft Bingo. Das Spiel lässt sich auf jedem Spaziergang spielen und wechselt mit den Jahreszeiten. Ideal, wenn Kinder auf langen Wegen schnell das Interesse verlieren.

### Für wen ist das Abenteuer geeignet?
Das Spiel passt für Kinder ab etwa vier Jahren. Mit Bildern statt Wörtern spielen auch jüngere mit.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind eine eigene Karte und legt eine gemeinsame Regel fest: Nur gucken, nicht pflücken. Mit mehreren Kindern könnt ihr in Teams spielen oder eine Familienkarte erstellen. Jede Jahreszeit bekommt eine neue Karte.

### Varianten und Ideen zum Weitermachen
- Ein Winter-Bingo mit Spuren im Schnee
- Stadt-Bingo mit Briefkasten, Taube, Brunnen
- Zeitrennen: Wer hat nach 20 Minuten die meisten Felder?

### Was kommt auf eine Natur-Bingo-Karte?
Blätter in bestimmten Farben, Federn, Steine, Tiere, Geräusche und Gerüche. Passt die Karte an Jahreszeit und Ort an.

### Wie lange dauert ein Bingo-Spaziergang?
Etwa 30 bis 90 Minuten, je nach Strecke.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 30, 90, 'free', 0.00, 'light', 'easy', false, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['trocken', 'bewoelkt']::text[], array['Papier und Stifte für die Bingo-Karte', 'Klemmbrett oder feste Unterlage']::text[], '1. Gemeinsam eine Bingo-Karte mit neun bis zwölf Naturdingen malen oder ausdrucken.
2. Auf dem Spaziergang die Dinge suchen und abhaken, ohne sie mitzunehmen.
3. Wer eine Reihe, eine Spalte oder die ganze Karte voll hat, ruft Bingo.
4. Zuhause besprechen: Was war am schwersten zu finden?', 'Wege nicht verlassen und beim Suchen nichts abreißen. Auf Straßenverkehr achten und nur ungefährliche Dinge auf die Karte schreiben.', array['Hält Kinder auf Spaziergängen bei Laune', 'Anpassbar für jede Jahreszeit', 'Ohne Material fast sofort spielbar']::text[], array['Etwas Vorbereitung für die Karte nötig', 'Ungeduldige Kinder wollen sofort alles finden']::text[], 'Natur-Bingo für Kinder: Spiel für Spaziergänge', 'Natur-Bingo für Kinder selber machen: Karten-Ideen für Frühling, Sommer, Herbst und Winter. Einfaches Spiel für Spaziergänge und Ausflüge.', true, 'draft', false),
  ('Insektenhotel bauen', 'insektenhotel-bauen', 'Ein einfaches Insektenhotel aus Holz, Bambus und Lehm bauen und beobachten, wer einzieht.', 'Wildbienen, Marienkäfer und andere nützliche Insekten suchen Verstecke zum Nisten und Überwintern. Mit einem Holzkasten, Bambusröhrchen, Zapfen und Stroh baut ihr ein einfaches Insektenhotel für Garten oder Balkon. Danach beobachtet ihr über Wochen, wer einzieht. Ein Projekt, das Naturschutz begreifbar macht und lange Freude bereitet.

### Für wen ist das Abenteuer geeignet?
Ab etwa fünf Jahren können Kinder beim Füllen und Beobachten helfen. Das Sägen übernehmen Erwachsene.

### Tipps für Familien mit mehreren Kindern
Jedes Kind füllt einen eigenen Bereich, etwa Röhrchen, Zapfen oder Stroh. Mit mehreren Kindern entsteht so ein vielfältiges Hotel, und jeder hat sein Fach. Notiert gemeinsam Beobachtungen in einem Tagebuch.

### Varianten und Ideen zum Weitermachen
- Ein Mini-Hotel aus einer Blechdose für den Balkon
- Eine Insekten-Beobachtungskarte führen
- Nisthilfen für Vögel ergänzen

### Wo hängt man ein Insektenhotel auf?
Sonnig, windgeschützt und regengeschützt, möglichst nach Süden ausgerichtet und in Blütennähe.

### Welche Insekten ziehen ein?
Häufig Wildbienen, Wespenarten und Florfliegen. Was bei euch einzieht, hängt vom Standort ab.', (select id from categories where content_type = 'micro_adventure' and slug = 'natur-wald'), 60, 120, 'low', 10.00, 'moderate', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken']::text[], array['Holzkasten oder alte Dose', 'Bambusröhrchen oder Strohhalme aus Papier', 'Tannenzapfen, Stroh, Holzstücke', 'Schnur zum Aufhängen']::text[], '1. Holzkasten oder Dose als Rahmen vorbereiten und einen geschützten Platz wählen.
2. Röhrchen auf gleiche Länge schneiden und dicht packen, die Enden müssen offen sein.
3. Zwischenräume mit Zapfen, Stroh und Holz füllen.
4. An einem sonnigen, regengeschützten Platz in Südrichtung aufhängen und regelmäßig beobachten.', 'Schneiden und Sägen nur durch Erwachsene. Nicht in Wespennester greifen und nicht an Insekten herumdrücken. Allergien beachten.', array['Fördert Verständnis für Natur- und Artenschutz', 'Langfristiges Projekt mit Beobachtungsspaß', 'Passt für Garten und Balkon']::text[], array['Es kann Wochen dauern, bis Insekten einziehen', 'Schneiden und Aufhängen erfordert Erwachsene']::text[], 'Insektenhotel bauen mit Kindern: Anleitung', 'Insektenhotel mit Kindern bauen: Anleitung mit Holz, Bambus und Zapfen. Tipps zu Standort, Material und Beobachtung für Familien.', true, 'draft', false),
  ('Schwimmen oder sinken? Das Wasserexperiment', 'schwimmen-oder-sinken', 'Mit einer Schüssel Wasser testen, welche Dinge aus Haus und Garten schwimmen und welche untergehen.', 'Zuerst raten, dann testen: Schwimmt der Korken, die Münze, der Apfel, der Stein? Mit einer großen Schüssel Wasser und einer Handvoll Alltagsgegenständen wird die Küche oder der Garten zum Labor. Die Kinder sortieren die Dinge nach Vermutung und Ergebnis und überlegen, warum manche schwimmen. Ein Klassiker, der Naturwissenschaft ohne Aufwand erlebbar macht.

### Für wen ist das Abenteuer geeignet?
Schon Dreijährige planschen mit, ab Grundschulalter können Kinder Vermutungen aufstellen und begründen.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind einen Gegenstand auswählen und vorher raten. So gibt es viele Überraschungen und keinen Streit. Mit mehreren Kindern führt ihr eine Siegerliste: Wer hat am häufigsten richtig getippt?

### Varianten und Ideen zum Weitermachen
- Boote aus Knete oder Alufolie bauen
- Eier im Salzwasser testen
- Gegenstände aus der Natur sammeln und testen

### Warum schwimmen manche Dinge und andere nicht?
Es kommt auf das Gewicht im Verhältnis zur Größe an. Ein großes, leichtes Ding schwimmt, ein kleines, schweres sinkt.

### Wie macht man ein Experiment kindgerecht?
Erst vermuten, dann testen, dann besprechen. Das Staunen gehört dazu.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 30, 60, 'free', 0.00, 'light', 'easy', true, true, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'trocken']::text[], array['große Schüssel oder Wanne', 'Wasser', 'Alltagsgegenstände (Korken, Münzen, Obst, Steine, Löffel)', 'Handtuch']::text[], '1. Schüssel mit Wasser füllen und Gegenstände bereitlegen.
2. Jedes Kind sagt voraus: schwimmt oder sinkt? Die Vermutungen aufschreiben.
3. Nacheinander testen und das Ergebnis in zwei Gruppen sortieren.
4. Mit Knetmasse ausprobieren: Wie kann man ein sinkendes Ding zum Schwimmen bringen?', 'Kleinkinder nicht unbeaufsichtigt an der Wasserschüssel lassen. Nur ungefährliche Gegenstände testen, keine scharfen oder spitzen Dinge.', array['Wissenschaft ohne Vorkenntnisse', 'Gut für Regentage', 'Mehrere Kinder können gleichzeitig mitmachen']::text[], array['Wasser auf dem Boden ist wahrscheinlich', 'Bei vielen Gegenständen dauert das Aufräumen']::text[], 'Schwimmen oder sinken: Wasserexperiment für Kinder', 'Wasserexperiment für Kinder: Schwimmen oder sinken? Mit Alltagsgegenständen forschen und Dichte erleben. Anleitung und Tipps für Familien.', true, 'draft', false),
  ('Sandskulpturen-Wettbewerb', 'sandskulpturen-wettbewerb', 'Am Strand oder Sandkasten eine Skulptur nach Thema bauen und von einer Jury bewerten lassen.', 'Jede Familie ist ein Bildhauer-Team: Ihr bekommt ein Thema, etwa Tiere, Burgen oder Fabelwesen, und baut mit Sand und Wasser eine Skulptur. Eine kleine Jury bewertet am Ende nach Kategorien wie Kreativität, Größe und Detail. Das Abenteuer funktioniert am Meer, am See oder im Sandkasten und bringt Teamarbeit und Fantasie zusammen.

### Für wen ist das Abenteuer geeignet?
Alle Altersgruppen können mitmachen. Kleinere Kinder bauen Formen, größere gestalten Details und Muster.

### Tipps für Familien mit mehreren Kindern
Bildet Teams aus Groß und Klein, damit die Aufgaben fair verteilt sind. Mit mehreren Kindern könnt ihr auch eine Gemeinschaftsskulptur bauen, bei der jedes ein Teil verantwortet. Plant Zeit für Fotos ein.

### Varianten und Ideen zum Weitermachen
- Sandburg mit Wassergraben und Zugbrücke
- Skulpturen im Garten mit Matsch bauen
- Ein Sandmuseum mit Schildchen gestalten

### Welcher Sand eignet sich zum Bauen?
Feuchter, fein-körniger Sand lässt sich am besten formen. Trockener Sand fällt auseinander.

### Was kann man als Deko verwenden?
Muscheln, Steine, Zweige und Treibholz, die am Strand liegen.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 60, 120, 'free', 0.00, 'light', 'easy', false, true, array['sommer', 'fruehling']::text[], array['sonnig', 'trocken']::text[], array['Eimer und Schaufeln', 'Förmchen', 'Wasser', 'Muscheln, Steine oder Stöcke zum Dekorieren']::text[], '1. Thema auswählen und Skizze zeichnen oder besprechen.
2. Feuchten, festen Sand an einem Platz sammeln und die Grundform bauen.
3. Details mit Händen, Löffeln und Stöcken herausarbeiten und mit Muscheln verzieren.
4. Jury-Runde mit Preisen für Kreativität, Größe und Detail.', 'Keine tiefen Löcher graben, in die Kinder fallen oder die einstürzen können. Sonnenschutz und Trinkpausen einplanen. Baden nur mit Aufsicht.', array['Teamarbeit für die ganze Familie', 'Funktioniert mit Meer, See oder Sandkasten', 'Keine speziellen Materialien nötig']::text[], array['Trockener Sand eignet sich nicht', 'Flut, Wind oder Regen zerstören das Kunstwerk schnell']::text[], 'Sandskulpturen bauen mit Kindern: Wettbewerb', 'Sandskulpturen-Wettbewerb für Familien: Thema, Regeln und Tipps zum Bauen am Strand oder im Sandkasten. Kreativ mit Sand und Wasser.', true, 'draft', false),
  ('Wasserstaffel im Garten', 'wasserstaffel-im-garten', 'In Teams mit Bechern Wasser von einem Eimer zum anderen transportieren und schauen, wer zuerst voll ist.', 'Zwei Teams stehen sich gegenüber. Jedes hat einen leeren und einen vollen Eimer und einen Becher mit Löchern oder Schwamm. Reihum wird Wasser von Eimer zu Eimer gebracht. Wer zuerst die Markierung erreicht, gewinnt. Das Spiel macht an heißen Tagen Spaß und bringt Teamarbeit und Geschick zusammen.

### Für wen ist das Abenteuer geeignet?
Das Spiel passt für Kinder ab etwa vier Jahren. Kleinere Kinder bekommen größere Becher, ältere Löcher im Becher als Herausforderung.

### Tipps für Familien mit mehreren Kindern
Teilt die Teams gleichmäßig auf und lasst größere Kinder die Mitte übernehmen. Mit drei oder mehr Kindern pro Team funktioniert eine Kette. Vergebt Extrapunkte für Teamgeist.

### Varianten und Ideen zum Weitermachen
- Mit Löchern im Becher mehr Herausforderung
- Mit Schwämmen statt Bechern
- Als Staffel mit Hindernissen

### Wie spart man Wasser?
Nutzt gesammeltes Regenwasser und gießt danach Beete oder Pflanzen mit dem Rest.

### Wie viele Kinder braucht man?
Zwei Teams mit je zwei Kindern genügen, mit mehr macht es noch mehr Spaß.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 30, 60, 'free', 0.00, 'light', 'easy', false, true, array['sommer']::text[], array['sonnig', 'trocken']::text[], array['Eimer oder Schüsseln', 'Becher oder Schwämme', 'Wasser', 'Markierung am Eimer']::text[], '1. Zwei Teams bilden und die Startlinie markieren.
2. Wasser in den Start-Eimer füllen, am Ziel eine Markierung anbringen.
3. Auf Start wird jeder Becher gefüllt und zum Ziel getragen.
4. Das Team, dessen Eimer zuerst die Markierung erreicht, gewinnt.', 'Auf rutschige Flächen achten. Wasser sparsam nutzen und nach dem Spiel Pflanzen gießen. Sonnenschutz und Pausen nicht vergessen.', array['Teamspiel für mehrere Kinder', 'Kostet nichts und erfrischt', 'Variiert leicht mit Regeln']::text[], array['Nur bei warmem Wetter sinnvoll', 'Wasser läuft auf Rasen und Boden']::text[], 'Wasserstaffel für Kinder: Spiel im Garten', 'Wasserstaffel im Garten: Spielidee für heiße Tage mit Eimern, Bechern und Teams. Ablauf, Varianten und Tipps für Kinder und Familien.', true, 'draft', false),
  ('Bachforscher: Kleine Wassertiere entdecken', 'bachforscher', 'Mit Kescher und Becherlupe kleine Bachbewohner suchen, betrachten und wieder freilassen.', 'In einem sauberen, flachen Bach leben viele kleine Tiere, die man leicht übersieht: Larven, Schnecken, Krebse, Wasserläufer. Mit einem Kescher, einer Wanne und einer Becherlupe untersucht ihr Steine, Blätter und Sand. Alle Tiere werden vorsichtig betrachtet und an der Fundstelle wieder freigelassen. Ein spannendes Abenteuer für kleine Naturforscher.

### Für wen ist das Abenteuer geeignet?
Ab etwa fünf Jahren können Kinder mit Begleitung forschen. Grundschulkinder bestimmen Tiere und führen ein Forschertagebuch.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind eine Aufgabe: Keschern, Betrachten, Zeichnen, Zurücksetzen. Mit mehreren Kindern wechselt ihr die Rollen und sammelt gemeinsam einen Fundbericht. Fragt vorab, ob Keschern am Bach erlaubt ist.

### Varianten und Ideen zum Weitermachen
- Steckbriefe zu den gefundenen Tieren anlegen
- Wasserqualität grob anhand der Tiere einschätzen
- Ein Forschertagebuch mit Zeichnungen führen

### Darf man im Bach keschern?
Das hängt vom Gewässer ab. In Schutzgebieten und an Privatgewässern ist es oft verboten. Fragt im Zweifel nach.

### Was macht man mit den Tieren?
Alle Tiere nach kurzer Betrachtung dorthin zurücksetzen, wo sie gefunden wurden.', (select id from categories where content_type = 'micro_adventure' and slug = 'wasser-strand'), 45, 90, 'low', 5.00, 'light', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'sonnig']::text[], array['Kescher oder Sieb', 'helle Wanne mit Wasser', 'Becherlupe', 'Wasserschuhe', 'Bestimmungskarte (optional)']::text[], '1. Einen flachen Bach mit klarem Wasser und ungefährlichem Ufer auswählen.
2. Steine vorsichtig umdrehen und Blätter im Kescher untersuchen.
3. Gefundene Tiere in die Wanne setzen, betrachten, vergleichen und zeichnen.
4. Alle Tiere vorsichtig an die Fundstelle zurücksetzen und Steine zurücklegen.', 'Nur an flachen, ungefährlichen Stellen forschen. Nicht in Schutzgebieten ohne Erlaubnis keschern. Wasser nicht trinken, Hände nach dem Forschen waschen.', array['Echte Forschung für Kinder', 'Macht Naturschutz anschaulich', 'Funktioniert an vielen Bächen']::text[], array['Braucht einen sauberen, zugänglichen Bach', 'Nasse Füße und Kleidung sind wahrscheinlich']::text[], 'Bachforscher mit Kindern: Wassertiere entdecken', 'Bachforscher-Abenteuer für Familien: Mit Kescher und Becherlupe Wassertiere entdecken und wieder freilassen. Ablauf, Ausrüstung und Sicherheitstipps.', true, 'draft', false),
  ('Familien-Kochbuch gestalten', 'familien-kochbuch', 'Lieblingsrezepte der Familie sammeln, aufschreiben, bebildern und zu einem eigenen Kochbuch binden.', 'Jedes Familienmitglied bringt sein Lieblingsrezept mit: Omas Apfelkuchen, Papas Nudelsoße, das Pausenbrot der Kinder. Ihr schreibt die Rezepte auf, zeichnet oder fotografiert die Gerichte und bindet alles zu einem Kochbuch. Das Projekt verbindet Erinnerungen mit Kreativität und liefert am Ende ein Geschenk, das lange Freude macht.

### Für wen ist das Abenteuer geeignet?
Das Projekt passt für alle Altersgruppen. Kleine Kinder malen die Gerichte, größere schreiben Rezepte auf.

### Tipps für Familien mit mehreren Kindern
Jedes Kind gestaltet eine eigene Seite und wählt seine Lieblingsspeise. So entsteht ein buntes Gesamtwerk. Kocht anschließend gemeinsam ein Rezept aus dem neuen Buch.

### Varianten und Ideen zum Weitermachen
- Rezepte von Großeltern per Interview sammeln
- Ein Familienrezept-Quiz basteln
- Ein digitales Kochbuch am Computer anlegen

### Wie bindet man ein Kochbuch?
Mit Locher und Ringen, mit Ordner oder per Fotobuchdienst, wenn ihr digital arbeitet.

### Was gehört in ein Rezept?
Name, Zutaten mit Mengen, Schritte, Zeit und gern eine kleine Geschichte dazu.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 60, 150, 'low', 8.00, 'moderate', 'easy', true, false, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'frost', 'schnee']::text[], array['Papier oder Ringbuch', 'Stifte', 'Fotos oder Zeichnungen', 'Kleber']::text[], '1. Jedes Familienmitglied wählt ein Lieblingsrezept und sagt, wer es gekocht hat.
2. Zutaten und Schritte aufschreiben, jüngere Kinder diktieren oder malen.
3. Zu jedem Rezept ein Foto oder eine Zeichnung ergänzen.
4. Blätter zu einem Buch binden oder lochen und mit einem Titel versehen.', 'Beim späteren Nachkochen auf Küchensicherheit achten, Messer und heiße Töpfe nur mit Erwachsenen. Allergien bei Zutaten notieren.', array['Verbindet Familienerinnerungen und Kreativität', 'Gut als Geschenk für Verwandte', 'Gelingt auch bei Regenwetter']::text[], array['Etwas Vorbereitungszeit für Rezepte', 'Rezepte aus dem Kopf sind oft unvollständig']::text[], 'Familien-Kochbuch gestalten: Rezepte sammeln', 'Familien-Kochbuch selber machen: Lieblingsrezepte sammeln, bebildern und binden. Anleitung und Ideen für ein persönliches Geschenk.', true, 'draft', false),
  ('Detektivspiel zuhause: Wer war''s?', 'detektivspiel-zuhause', 'Ein selbstgebauter Mini-Krimi mit Hinweisen, Verdächtigen und Lupe, der durchs ganze Haus führt.', 'Ein Plätzchen ist verschwunden, ein Schatz geklaut oder das Lieblingsstofftier verschwunden: Euer Haus verwandelt sich in einen Tatort. Ein Erwachsener oder ein älteres Kind versteckt Hinweise, die zu einem Täter führen. Mit Lupe, Notizblock und Fingerabdruckpulver aus Kakao werden Kinder zu Detektiven. Ein Spiel für Regentage mit Spannung und Teamarbeit.

### Für wen ist das Abenteuer geeignet?
Das Spiel passt für Kinder ab etwa sechs Jahren. Jüngere brauchen einfachere Hinweise und Hilfe beim Lesen.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind eine eigene Detektivrolle: Spurensicherer, Protokollführer, Befrager. Mit mehreren Kindern vermeiden Rollen Streit. Plant Hilfen ein, falls das Team festhängt.

### Varianten und Ideen zum Weitermachen
- Ein Fall im Garten mit Naturhinweisen
- Geheimschrift und Zahlenschlösser einbauen
- Einen Detektivausweis für jedes Kind basteln

### Wie macht man Fingerabdrücke sichtbar?
Mit feinem Kakaopulver und weichem Pinsel auf glatten Flächen. Vorsichtig pusten, bis der Abdruck erscheint.

### Was tun, wenn die Kinder nicht weiterkommen?
Gebt einen zusätzlichen Hinweis oder lasst sie in der Gruppe Ideen sammeln.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 45, 90, 'free', 0.00, 'moderate', 'medium', true, false, array['fruehling', 'herbst', 'winter']::text[], array['regen', 'schnee', 'frost']::text[], array['Lupe', 'Notizblock und Stifte', 'Hinweise auf Zetteln', 'Kakao und Pinsel für Fingerabdrücke']::text[], '1. Fall ausdenken und Hinweise schreiben, die zu drei bis vier Verdächtigen führen.
2. Hinweise im Haus verstecken, am besten an fünf bis sechs Stationen.
3. Die Kinder sammeln Hinweise, notieren Beobachtungen und überlegen gemeinsam.
4. Am Ende den Täter benennen und die Auflösung besprechen.', 'Keine echten Gefahren einbauen. Kakao nur auf abwischbaren Flächen nutzen. Kinder nicht überfordern, bei Frust Hilfen geben.', array['Gut für Regentage und Geburtstage', 'Fördert logisches Denken und Teamgeist', 'Lässt sich an jedes Alter anpassen']::text[], array['Vorbereitung durch einen Erwachsenen nötig', 'Rätsel müssen zum Alter passen']::text[], 'Detektivspiel für Kinder: Mini-Krimi zuhause', 'Detektivspiel zuhause: Mini-Krimi für Kinder mit Hinweisen, Verdächtigen und Fingerabdrücken. Ablauf, Ideen und Tipps für Regentage.', true, 'draft', false),
  ('Brettspiel selber bauen', 'brettspiel-selber-bauen', 'Ein eigenes Familienspiel erfinden, Spielplan gestalten, Regeln aufschreiben und gemeinsam testen.', 'Welche Figuren? Welcher Weg? Welche Regeln? Beim Brettspielbau erfindet die ganze Familie ein eigenes Spiel. Aus Pappe, Stiften und Würfeln entsteht ein Spielplan, dazu kommen Spielfiguren aus Knöpfen oder Naturmaterial und Ereigniskarten. Danach wird getestet, verändert und verbessert, bis alle zufrieden sind. Ein Projekt, das Kreativität und Spaß vereint.

### Für wen ist das Abenteuer geeignet?
Das Projekt passt für Kinder ab etwa sechs Jahren. Jüngere helfen beim Malen und Basteln.

### Tipps für Familien mit mehreren Kindern
Teilt Aufgaben: Spielplan, Karten, Figuren, Regeln. Mit mehreren Kindern entstehen so mehrere Teile, die am Ende zusammenfinden. Vereinbart vorher, dass Regeln nach der ersten Runde geändert werden dürfen.

### Varianten und Ideen zum Weitermachen
- Ein Memory aus Familienfotos basteln
- Ein Rätselspiel mit Fragen zur Familie
- Das Spiel als Geschenk für Freunde verpacken

### Wie fängt man ein eigenes Spiel an?
Mit einem Thema und einem klaren Ziel. Alles andere lässt sich nach dem ersten Test verbessern.

### Wie lange dauert das Projekt?
Meist zwei bis drei Stunden, bei großen Plänen auch über mehrere Tage.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 90, 180, 'low', 5.00, 'moderate', 'medium', true, false, array['fruehling', 'herbst', 'winter']::text[], array['regen', 'schnee', 'frost']::text[], array['Pappe oder Karton', 'Stifte und Papier', 'Würfel', 'Spielfiguren aus Knöpfen, Steinen oder Knete']::text[], '1. Thema und Spielziel festlegen, zum Beispiel Piratenreise oder Dschungelrennen.
2. Spielplan auf Pappe zeichnen und Felder mit Aufgaben gestalten.
3. Regeln aufschreiben, Karten und Figuren basteln.
4. Spiel testen, Regeln anpassen und im Familienkreis spielen.', 'Scheren und Cuttermesser nur mit Aufsicht benutzen. Kleine Figuren nicht für Kinder unter drei Jahren verwenden.', array['Kreativität und Regelverständnis in einem', 'Das Ergebnis ist bleibend und teilbar', 'Gut für lange Regentage']::text[], array['Braucht Zeit und Geduld', 'Streit um Regeln ist möglich']::text[], 'Brettspiel selber bauen: Familienprojekt', 'Brettspiel selber bauen mit Kindern: Spielplan, Regeln und Figuren gestalten. Anleitung, Ideen und Tipps für kreative Familien.', true, 'draft', false),
  ('Lesenacht mit Taschenlampe', 'lesenacht-mit-taschenlampe', 'Mit Decken, Taschenlampen und Lieblingsbüchern einen gemütlichen Leseabend im Dunkeln feiern.', 'Wenn es draußen dunkel wird, beginnt die Lesenacht: Das Licht geht aus, die Taschenlampen an. Jedes Kind sucht sich ein Buch aus, ihr kuschelt euch in Decken und lest abwechselnd vor oder allein. Mit Kakao und kleinen Snacks entsteht ein besonderes Abendritual, das Kindern Lust aufs Lesen macht und die Familie zusammenbringt.

### Für wen ist das Abenteuer geeignet?
Das Format passt für alle Altersgruppen: Kleine bekommen vorgelesen, Größere lesen selbst oder anderen vor.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind einen Buchabschnitt vorlesen. So hat jedes seine Rolle und jedes Kind wird gehört. Bei großen Altersunterschieden hilft eine Auswahl mit Büchern in verschiedenen Schwierigkeitsgraden.

### Varianten und Ideen zum Weitermachen
- Hörbuchnacht mit Kopfkissen
- Eigene Geschichten schreiben und vorlesen
- Mit Schattenspielen zu Szenen aus dem Buch

### Welche Bücher eignen sich?
Bilderbücher für die Kleinen, Vorlesebücher und Abenteuergeschichten für Größere. Die Kinder dürfen selbst wählen.

### Wie lange sollte die Lesenacht gehen?
Ein bis zwei Stunden reichen, bevor Müdigkeit einsetzt.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 60, 120, 'free', 0.00, 'light', 'easy', true, false, array['herbst', 'winter', 'fruehling']::text[], array['regen', 'frost', 'schnee', 'dunkel']::text[], array['Taschenlampen', 'Decken und Kissen', 'Lieblingsbücher', 'Kakao und Snacks (optional)']::text[], '1. Wohnzimmer oder Höhle abdunkeln und gemütlich einrichten.
2. Jedes Kind wählt ein Buch und eine Taschenlampe.
3. Abwechselnd vorlesen oder jeder liest für sich im Lichtkegel.
4. Zum Schluss erzählen, welches Buch am besten gefallen hat.', 'Keine Kerzen verwenden, nur Taschenlampen oder LED-Lichter. Auf Stolperfallen achten und Decken nicht über Heizkörper legen.', array['Fördert Leselust ganz nebenbei', 'Gemeinsames Ritual mit wenig Aufwand', 'Für alle Altersgruppen geeignet']::text[], array['Kleinere Kinder schlafen leicht ein', 'Ältere Kinder wollen oft ihr eigenes Buch']::text[], 'Lesenacht mit Kindern: Leseabend mit Taschenlampe', 'Lesenacht mit Taschenlampe für Familien: Ablauf, Buchideen und Tipps für einen gemütlichen Leseabend mit Kindern. Einfach und stimmungsvoll.', true, 'draft', false),
  ('Stop-Motion-Film mit dem Smartphone', 'stop-motion-film', 'Mit Spielfiguren und Smartphone einen kleinen Trickfilm drehen, Bild für Bild.', 'Beim Stop-Motion-Film bewegt ihr Figuren in kleinen Schritten und fotografiert jeden Schritt. Aus vielen Fotos entsteht ein Film, in dem Lego-Figuren laufen oder Knete-Tiere tanzen. Mit einer kostenlosen App und etwas Geduld gelingen schon kurze Filme in einer Stunde. Ein kreatives Projekt für Regentage, das Technik und Fantasie verbindet.

### Für wen ist das Abenteuer geeignet?
Ab etwa sieben Jahren können Kinder selbst fotografieren und bewegen. Jüngere helfen mit Figuren und Kulisse.

### Tipps für Familien mit mehreren Kindern
Teilt die Rollen: Kamera, Figuren, Drehbuch, Ton. Mit mehreren Kindern läuft das Projekt am besten, wenn jeder eine Szene verantwortet. Begrenzt den Film auf 30 Sekunden, dann gelingt er auch.

### Varianten und Ideen zum Weitermachen
- Knete-Tiere in eine kleine Geschichte verwandeln
- Lego-Film mit Kulisse
- Zeitraffer eines Pflanzenwachstums aufnehmen

### Welche App eignet sich für Stop-Motion?
Es gibt mehrere kostenlose Apps für Smartphone und Tablet. Wählt eine einfache mit Vorschaufunktion.

### Wie viele Bilder braucht man?
Für eine Sekunde etwa zehn Bilder, für 30 Sekunden also rund 300.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 60, 150, 'free', 0.00, 'moderate', 'medium', true, false, array['fruehling', 'herbst', 'winter']::text[], array['regen', 'schnee', 'frost']::text[], array['Smartphone oder Tablet mit Stop-Motion-App', 'Spielfiguren oder Knete', 'feste Unterlage oder Stativ', 'gute Beleuchtung']::text[], '1. Idee und kurzes Drehbuch festlegen, zum Beispiel ein Figurenlauf über den Tisch.
2. Smartphone fest aufstellen, damit sich der Ausschnitt nicht verändert.
3. Figur minimal bewegen, Foto aufnehmen, wiederholen.
4. Fotos in der App abspielen, Ton und Titel ergänzen.', 'Gerät sicher aufstellen, damit es nicht herunterfällt. Bildschirmzeit gemeinsam begrenzen und Kleinteile von jüngeren Geschwistern fernhalten.', array['Kreative Medienkompetenz', 'Mehrere Kinder können gemeinsam arbeiten', 'Funktioniert mit vorhandenen Spielsachen']::text[], array['Braucht Geduld und feste Technik', 'Dauert länger als gedacht']::text[], 'Stop-Motion-Film mit Kindern drehen: Anleitung', 'Stop-Motion-Film mit Kindern: Anleitung für den ersten Trickfilm mit Smartphone, Figuren und kostenloser App. Tipps für Familien.', true, 'draft', false),
  ('Familienwappen gestalten', 'familienwappen-gestalten', 'Gemeinsam ein Wappen entwerfen, das zeigt, wofür eure Familie steht, mit Farben, Symbolen und einem Motto.', 'Jede Familie hat ihre eigenen Eigenheiten: Lieblingsorte, Hobbys, Werte. Ein Familienwappen macht das sichtbar. Ihr überlegt gemeinsam, welche Farben, Tiere und Symbole zu euch passen, entwerft ein Wappen auf Papier oder Pappe und gebt euch ein Familienmotto. Ein Projekt, das ins Gespräch bringt und am Ende an die Wand gehängt werden kann.

### Für wen ist das Abenteuer geeignet?
Das Projekt passt für Kinder ab etwa vier Jahren. Größere Kinder gestalten Motto und Details.

### Tipps für Familien mit mehreren Kindern
Jedes Familienmitglied bekommt ein eigenes Feld und entscheidet selbst über das Symbol. Mit mehreren Kindern bleibt das Wappen so fair und bunt. Das Motto könnt ihr mit einer Abstimmung bestimmen.

### Varianten und Ideen zum Weitermachen
- Wappen aus Salzteig modellieren
- Fahne für das Familien-Zelt gestalten
- Wappen für Haustiere ergänzen

### Was gehört in ein Familienwappen?
Symbole, die für Hobbys, Orte, Werte oder Lieblingstiere stehen. Es gibt keine festen Regeln.

### Wie lange dauert das Projekt?
Ein bis zwei Stunden, plus Trocknungszeit bei Farben.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 60, 120, 'low', 3.00, 'light', 'easy', true, false, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'frost', 'schnee']::text[], array['Papier oder Pappe', 'Buntstifte oder Wasserfarben', 'Schere und Kleber', 'Glitzer oder Wolle (optional)']::text[], '1. Gemeinsam sammeln: Was macht uns aus? Welche Farben, Tiere, Symbole passen?
2. Wappenform auf Pappe zeichnen und in vier Felder teilen.
3. Jedes Feld mit einem Symbol gestalten, jeder Person ein Feld zuordnen.
4. Ein Familienmotto in einem Band ergänzen und das Wappen aufhängen.', 'Scheren und Kleber altersgerecht verwenden. Bei Farbe Tisch abdecken.', array['Stärkt das Wir-Gefühl', 'Jedes Familienmitglied bringt Ideen ein', 'Entsteht ohne besondere Materialien']::text[], array['Entscheidungen brauchen manchmal Diskussion', 'Kleine Kinder brauchen Hilfe beim Entwerfen']::text[], 'Familienwappen gestalten: Idee für Kinder', 'Familienwappen mit Kindern gestalten: Symbole, Farben und Familienmotto finden. Anleitung und Tipps für ein kreatives Gemeinschaftsprojekt.', true, 'draft', false),
  ('Küchenexperimente für Kinder', 'kuechenexperimente-fuer-kinder', 'Mit Essig, Natron und Lebensmittelfarbe kleine Experimente durchführen: Vulkan, Farbwanderung, tanzende Rosinen.', 'Die Küche ist ein Labor voller Experimente: Natron und Essig schäumen wie ein Vulkan, Farben wandern durch Papier, Rosinen tanzen im Sprudelwasser. Mit Zutaten, die ihr zuhause habt, erlebt ihr Chemie und Physik zum Anfassen. Kinder staunen, vermuten und beobachten, und ihr habt am Ende ein ganzes Experimentenheft gefüllt.

### Für wen ist das Abenteuer geeignet?
Experimente passen für Kinder ab etwa fünf Jahren mit Begleitung. Ältere Kinder dokumentieren und stellen Hypothesen auf.

### Tipps für Familien mit mehreren Kindern
Lasst jedes Kind ein Experiment leiten und die anderen vermuten. Mit mehreren Kindern bleibt es spannend, wenn jede Person einen Schritt ausführt. Ein Forscherkittel macht Spaß und schützt die Kleidung.

### Varianten und Ideen zum Weitermachen
- Lavalampe aus Öl, Wasser und Brausetablette
- Geheimtinte aus Zitronensaft
- Regenbogen im Glas aus Zuckerlösungen

### Sind Küchenexperimente sicher?
Mit Haushaltszutaten und Aufsicht ja. Spritzschutz und Hände waschen gehören dazu.

### Was lernt man beim Vulkan-Experiment?
Natron und Essig reagieren und bilden Gas, das den Schaum erzeugt. Kinder erleben so eine einfache chemische Reaktion.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 45, 90, 'low', 5.00, 'moderate', 'medium', true, false, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'frost', 'schnee']::text[], array['Natron und Essig', 'Lebensmittelfarbe', 'Küchenpapier', 'Schüsseln, Becher und Löffel', 'Schutzbrille (optional)']::text[], '1. Arbeitsplatz mit Folie oder Tablett schützen und Zutaten bereitstellen.
2. Vulkan: Natron in einen Becher geben, Essig mit Farbe zugeben und beobachten.
3. Farbwanderung: Küchenpapier mit Farbe in Wasser stellen und die Mischung beobachten.
4. Ergebnisse besprechen und in einem Heft notieren.', 'Nur Haushaltszutaten verwenden. Nicht in Augen oder Mund bringen, danach Hände waschen. Erwachsene beaufsichtigen jedes Experiment.', array['Wissenschaft mit Zutaten aus der Küche', 'Gut für Regentage und Geburtstage', 'Mehrere Kinder können abwechselnd mitmachen']::text[], array['Es wird feucht und manchmal klebrig', 'Reaktionen sind kurz, daher oft wiederholen']::text[], 'Küchenexperimente für Kinder: Vulkan und Co.', 'Küchenexperimente für Kinder: Vulkan, Farbwanderung und tanzende Rosinen mit Haushaltszutaten. Anleitungen und Sicherheitstipps für Familien.', true, 'draft', false),
  ('Stadtrallye im eigenen Viertel', 'stadtrallye-im-eigenen-viertel', 'Mit Fotoaufgaben und Rätseln das eigene Viertel neu entdecken: Brunnen, Hausnummern, Bäume und versteckte Ecken.', 'Auch vertraute Straßen bieten Überraschungen. Bei der Stadtrallye bekommen die Kinder Aufgaben wie: Findet drei verschiedene Türklinken, einen Brunnen, ein Haus mit Zahl 7 oder ein Tier auf einem Schild. Mit Fotos und Notizen sammeln sie Punkte. Das Abenteuer funktioniert in jeder Stadt und jedem Dorf und macht das Zuhause zum Ausflugsziel.

### Für wen ist das Abenteuer geeignet?
Ab etwa sechs Jahren lösen Kinder die Aufgaben selbstständig, jüngere gehen mit Begleitung.

### Tipps für Familien mit mehreren Kindern
Mischt die Teams nach Alter und gebt jedem Team eine eigene Route oder Aufgabenreihenfolge. So drängt sich niemand, und es gibt keine Abkürzungen. Bei vielen Kindern funktionieren Stationen mit Erwachsenen als Schiedsrichter.

### Varianten und Ideen zum Weitermachen
- Fotosafari statt Aufgabenliste
- Rätselrallye mit Buchstaben, die ein Lösungswort ergeben
- Eine Rallye für Gäste oder Geburtstage

### Wie plant man eine Stadtrallye?
Eine kurze, sichere Route wählen, Aufgaben an bekannten Orten stellen und vorab einmal selbst ablaufen.

### Welche Aufgaben eignen sich?
Finde etwas Rotes, zähle Treppenstufen, fotografiere ein Tier oder eine Zahl.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 60, 120, 'free', 0.00, 'moderate', 'easy', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'bewoelkt']::text[], array['Aufgabenliste auf Papier', 'Smartphone oder Kamera', 'Stifte']::text[], '1. Eine Route mit sicheren Wegen planen und zehn bis zwölf Aufgaben schreiben.
2. Teams bilden und Zeit oder Strecke festlegen.
3. Aufgaben lösen, Fotos machen und Punkte notieren.
4. Zurück am Startpunkt Ergebnisse vergleichen und Preise vergeben.', 'Straßenregeln beachten und nur auf Gehwegen bleiben. Jüngere Kinder nur mit Begleitung. Nicht auf Privatgrundstücke gehen und Fremde nicht ansprechen.', array['Ohne Anreise im eigenen Viertel möglich', 'Für mehrere Kinder und Teams geeignet', 'Mit wenigen Kosten verbunden']::text[], array['Planung der Route nötig', 'Straßenverkehr erfordert Aufmerksamkeit']::text[], 'Stadtrallye für Kinder im eigenen Viertel', 'Stadtrallye für Kinder selber machen: Aufgaben, Rätselideen und Tipps für eine Rallye im eigenen Viertel. Familienabenteuer ohne lange Anreise.', true, 'draft', false),
  ('Kinderflohmarkt veranstalten', 'kinderflohmarkt', 'Aussortierte Spielsachen verkaufen, Preise festlegen und das erste eigene Geld verdienen.', 'Beim Kinderflohmarkt sortieren die Kinder Spielsachen, Bücher und Kleidung aus, machen Preisschilder und stehen selbst am Verkaufsstand. Dabei lernen sie spielerisch Rechnen, Verhandeln und den Wert von Dingen. Der Flohmarkt kann im Garten, vor der Haustür oder auf einem organisierten Kinderflohmarkt stattfinden und endet mit einer selbstverdienten Kasse.

### Für wen ist das Abenteuer geeignet?
Der Flohmarkt passt für Kinder ab etwa sechs Jahren. Jüngere helfen beim Aufbau und beim Schilder malen.

### Tipps für Familien mit mehreren Kindern
Jedes Kind bekommt einen eigenen Verkaufsbereich und verwaltet seine Einnahmen selbst. Bei mehreren Kindern hilft eine Kasse pro Person. Legt vorab fest, wie viel Gewinn gespart oder gespendet wird.

### Varianten und Ideen zum Weitermachen
- Limonadenstand zum Flohmarkt ergänzen
- Spendenaktion für einen guten Zweck
- Tauschbörse statt Verkauf

### Muss man einen Kinderflohmarkt anmelden?
Für privates Verkaufen vor der Haustür meist nicht, auf öffentlichen Flächen oder größeren Märkten aber oft. Fragt vorher bei der Gemeinde nach.

### Wie legt man Preise fest?
Mit Kindern gemeinsam: Was würde ich dafür bezahlen? Kleine Preise verkaufen sich meist besser.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 120, 240, 'free', 0.00, 'moderate', 'medium', false, true, array['fruehling', 'sommer', 'herbst']::text[], array['trocken', 'sonnig']::text[], array['Tisch oder Decke', 'Preisschilder und Stifte', 'Kleingeld und Kasse', 'Spielsachen und Bücher zum Verkaufen']::text[], '1. Gemeinsam aussortieren, was verkauft werden darf, und Preise festlegen.
2. Stand aufbauen, Schilder malen und Plakate aufhängen.
3. Kinder bedienen Kunden, nehmen Geld an und geben Wechselgeld.
4. Am Ende die Einnahmen zählen und überlegen, wofür sie verwendet werden.', 'Nur Dinge verkaufen, die sicher und intakt sind. Auf öffentlichen Flächen vorab klären, ob ein Verkauf erlaubt ist oder angemeldet werden muss. Kleingeld sicher aufbewahren.', array['Lernt Rechnen, Verhandeln und Verantwortung', 'Räumt gleichzeitig das Kinderzimmer auf', 'Macht Kindern Stolz auf ihr Geld']::text[], array['Aufbau und Planung kosten Zeit', 'Nicht jeder Verkauf läuft erfolgreich']::text[], 'Kinderflohmarkt veranstalten: Tipps für Familien', 'Kinderflohmarkt selbst veranstalten: Planung, Preise, Ablauf und Tipps für Familien. So wird der Verkaufstag zum Lernabenteuer.', true, 'draft', false),
  ('Kresse-Igel ziehen: Das Keimexperiment', 'kresse-igel-ziehen', 'Kresse in einer Eierschale oder Schale aussäen, gießen und beobachten, wie die Igel-Stacheln wachsen.', 'In einer ausgehöhlten Eierschale oder einer kleinen Tonschale wachsen aus Kressesamen innerhalb weniger Tage grüne Haare, und aus dem Gefäß wird ein Igel. Kinder erleben, wie schnell Pflanzen wachsen, und dürfen ihren Igel am Ende ernten und aufs Brot streuen. Ein Projekt für die Fensterbank, das Geduld und Verantwortung schult.

### Für wen ist das Abenteuer geeignet?
Ab etwa drei Jahren dürfen Kinder mitgießen, größere Kinder dokumentieren das Wachstum.

### Tipps für Familien mit mehreren Kindern
Gebt jedem Kind einen eigenen Igel mit Namen und lasst es ihn pflegen. Mit mehreren Kindern gibt es einen kleinen Wettbewerb, wessen Igel am schnellsten wächst. Ein Wachstums-Tagebuch macht die Entwicklung sichtbar.

### Varianten und Ideen zum Weitermachen
- Bohnen im Glas keimen lassen
- Gras-Köpfe mit Erde statt Watte
- Verschiedene Lichtbedingungen vergleichen

### Wie lange dauert es, bis Kresse wächst?
Meist drei bis sieben Tage, je nach Temperatur und Licht.

### Kann man die Kresse essen?
Ja, bei sauberem Material und sauberen Händen. Vor dem Essen kurz abspülen.', (select id from categories where content_type = 'micro_adventure' and slug = 'kreativ-entdecken'), 30, 45, 'low', 3.00, 'light', 'easy', true, false, array['fruehling', 'sommer', 'herbst', 'winter']::text[], array['regen', 'frost', 'schnee', 'trocken']::text[], array['Kressesamen', 'Watte oder Küchenpapier', 'Eierschalen oder kleine Schalen', 'Wasser', 'Stifte zum Gesichtmalen']::text[], '1. Watte oder Küchenpapier in die Schale legen und anfeuchten.
2. Kressesamen gleichmäßig darauf verteilen.
3. Einen sonnigen Platz am Fenster wählen und täglich leicht gießen.
4. Nach einigen Tagen ernten und aufs Brot oder in den Salat streuen.', 'Samen in Lebensmittelqualität verwenden (Kressesamen zum Verzehr). Vor dem Essen waschen. Auf Schimmel achten und den Igel dann nicht essen.', array['Schnelle Erfolge, schon nach wenigen Tagen', 'Passt für die Fensterbank, auch im Winter', 'Schmeckt zum Schluss']::text[], array['Braucht tägliche Pflege', 'Zu viel Wasser kann Schimmel fördern']::text[], 'Kresse-Igel ziehen mit Kindern: Anleitung', 'Kresse-Igel selber ziehen: Einfaches Keimexperiment für Kinder mit Eierschale und Samen. Anleitung, Tipps und Pflege für die Fensterbank.', true, 'draft', false)
on conflict (slug) do update set
  full_description = excluded.full_description,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description;
