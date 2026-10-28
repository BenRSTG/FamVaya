-- FamVaya: Familienaktivitäten, Batch 1 (10 echte Ziele, alle als ENTWURF).
--
-- Voraussetzung: Migration 0030 (seo_title/meta_description für activities) ist
-- ausgeführt. Idempotent: vorhandene Slugs werden übersprungen
-- (on conflict (slug) do nothing).
--
-- Nur belegte Angaben: Preise, Altersgrenzen und Öffnungszeiten stammen von den
-- offiziellen Anbieter-Seiten (Stand 28.10.2026) oder bleiben leer, wo wir sie
-- nicht belegen konnten. Familienscore, Titelbild und "persönlich getestet"
-- bewusst leer — im Admin nach dem Gegenlesen pflegen und freischalten.
-- Keine Affiliate-Links: external_url verweist auf die offizielle Seite; eine
-- Affiliate-URL trägst du nach Freischaltung des Partnerprogramms im Admin ein.
-- Kategorien/Land werden per Slug/Code nachgeschlagen (fehlt eine, bleibt sie leer).

insert into activities (
  title, slug, short_description, full_description, category_id, country_id, city,
  indoor, outdoor, weather_suitable, adult_price, child_price, family_ticket,
  large_family_discount, booking_required, price_checked_at, external_url,
  seo_title, meta_description, pros, cons, status, featured
) values
  ('Europa-Park (Rust)', 'europa-park-rust', 'Großer Freizeitpark in Rust (Baden) mit Themenbereichen, Achterbahnen und Shows – für Familien mit Kindern jeden Alters.', 'Der Europa-Park liegt in Rust in Baden und ist ein Freizeitpark mit mehreren Themenbereichen, Fahrgeschäften und Shows. Für Familien mit mehreren Kindern ist er ein Ganztagesziel: Es gibt viel zu entdecken, aber auch einiges zu organisieren.

### Für wen passt der Europa-Park?

Der Park spricht Familien mit Kindern unterschiedlichen Alters an: Wer klein ist, findet Fahrgeschäfte und Shows ohne Größenvorgabe, ältere Kinder und Jugendliche können sich an den Achterbahnen versuchen. Welche Attraktion ab welcher Körpergröße erlaubt ist, steht bei jeder Attraktion und im Park – plant bei großem Altersunterschied darum Zeit ein, in der ihr euch aufteilt.

### Was kostet der Eintritt für eine große Familie?

Der Park verkauft Tageskarten mit Preisen, die vom Besuchstag abhängen. Auf der offiziellen Seite lagen sie für Tickets mit Gültigkeit bis 09.01.2027 so:

- Kinder 0 bis 3 Jahre: frei
- Kinder 4 bis 11 Jahre: 56,50 € bis 65,00 €
- Ab 12 Jahren: 67,00 € bis 76,00 €

Ein Rechenbeispiel: Zwei Erwachsene und drei Kinder zwischen 4 und 11 Jahren zahlen damit je nach Tag etwa 303,50 € bis 347,00 € für die Tageskarten. Ein Familien- oder Geschwisterrabatt wird auf der Preisseite nicht genannt. Der Park empfiehlt, online vorab zu buchen, weil die Kapazität begrenzt ist. An der Tageskasse kostet jedes Ticket 10 € mehr.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets online und für einen günstigeren Tag buchen – ein Wochentag außerhalb der Ferien ist oft entspannter, die Preise zeigt der Ticketshop je Besuchstag.
- Einen Altersnachweis für jedes Kind mitnehmen, falls beim Eintritt oder an Attraktionen danach gefragt wird.
- Feste Treffpunkte vereinbaren und für jedes Kind eine Telefonnummer mitgeben, falls sich jemand verliert.
- Verpflegung und Pausen einplanen: Ein ganzer Tag im Park ist für die Jüngsten anstrengend.

### Öffnungszeiten und Saison

Im Sommer und in der Halloween-Saison öffnet der Park ab 9 Uhr und schließt mindestens um 18 Uhr, in der Winter-Saison öffnet er ab 11 Uhr bis mindestens 19 Uhr. Die genauen Termine ändern sich jedes Jahr und stehen auf der Seite des Parks.

### Ab welchem Alter ist der Eintritt frei?
Kinder von 0 bis 3 Jahren zahlen keinen Eintritt.

### Muss ich online buchen?
Nötig ist es nicht, empfohlen wird es aber ausdrücklich, weil die Kapazität begrenzt ist.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), 'Rust', false, true, false, null, null, false, false, false, date '2026-10-28', 'https://www.europapark.de', 'Europa-Park mit Kindern: Preise, Tipps, Familien', 'Europa-Park Rust mit mehreren Kindern: Kinder bis 3 Jahre frei, Preise je Besuchstag, Online-Ticket-Tipp und ein Rechenbeispiel für Großfamilien.', array['Kinder von 0 bis 3 Jahren haben freien Eintritt', 'Online-Tickets sind günstiger als an der Tageskasse'], array['Preise hängen vom Besuchstag ab', 'An der Tageskasse kostet jedes Ticket 10 € mehr'], 'draft', false),
  ('Heide Park Resort (Soltau)', 'heide-park-resort-soltau', 'Freizeitpark in Soltau in der Lüneburger Heide mit Fahrgeschäften, Shows und saisonalen Events wie Halloween.', 'Das Heide Park Resort liegt in Soltau in der Lüneburger Heide und ist ein Freizeitpark in Niedersachsen. Er bietet Fahrgeschäfte für verschiedene Altersgruppen und im Jahresverlauf saisonale Events, zum Beispiel Halloween im Oktober.

### Für wen passt der Heide Park?

Der Park ist ein Ausflugsziel für Familien, die einen ganzen Tag mit Fahrgeschäften verbringen wollen. Mit Kindern unterschiedlichen Alters lohnt sich eine kurze Planung: Welche Attraktionen sind für die Jüngsten möglich, welche für die Älteren, und wann trennt ihr euch für eine Runde? Die Mindestgrößen stehen bei den Attraktionen.

### Was kostet der Eintritt?

Auf der Startseite nennt der Park Tageskarten ab 28 € pro Person bei Online-Buchung (Stand 28.10.2026). Für die Halloween-Zeit stand ein Preis ab 47 € pro Person, und beim Kauf von mindestens drei Tickets gibt es ein reduziertes Angebot. Preise für Erwachsene und Kinder samt Altersgrenzen nennt die Startseite nicht – sie findet ihr beim Ticketkauf. Der Park empfiehlt, Tickets vorab online zu buchen, um die besten Angebote zu bekommen.

Interessant für Familien: Bei ausgewählten Kurzurlauben erhalten Kinder bis einschließlich 11 Jahre zwei Tage Parkeintritt gratis.

### Tipps für Familien mit 3 oder mehr Kindern

- Online buchen und die Angebote für mehrere Tickets prüfen.
- Bei den Preisen darauf achten, ab welchem Alter und welcher Größe ein Kinderticket gilt.
- Ersatzkleidung, Regenschutz und Verpflegung einplanen – der Park ist überwiegend im Freien.
- Einen festen Treffpunkt vereinbaren.

### Öffnungszeiten und Saison

Der Park ist saisonal geöffnet. Die Hauptsaison-Zeiten liegen laut Seite typischerweise etwa zwischen 10 und 18 oder 19 Uhr. Das Halloween-Event lief 2026 vom 10. bis 31. Oktober. Die Termine für die nächste Saison findet ihr auf der Seite des Parks.

### Ab wann sind Kinder frei?
Ein allgemeines Freialter nennt die Startseite nicht – bitte im Ticketshop nachsehen.

### Lohnt sich ein Jahreskarte?
Die Jahreskarte startet laut Seite ab 69 €. Ob sie sich rechnet, hängt davon ab, wie oft ihr kommt.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), 'Soltau', false, true, false, null, null, false, false, false, date '2026-10-28', 'https://www.heide-park.de', 'Heide Park Soltau mit Kindern: Tipps für Familien', 'Heide Park Resort in Soltau mit mehreren Kindern: Online-Tickets ab 28 €, saisonale Events, Tipps für Großfamilien und was ihr vorher prüfen solltet.', array['Online-Tickets ab 28 € pro Person (Stand 28.10.2026)', 'Kurzurlaub-Pakete mit freiem Parkeintritt für Kinder bis 11 Jahre'], array['Saisonbetrieb: Öffnungstage vor dem Besuch prüfen', 'Altersgrenzen der Preise stehen nicht auf der Startseite'], 'draft', false),
  ('Phantasialand (Brühl)', 'phantasialand-bruehl', 'Themenpark in Brühl im Rheinland mit Fahrgeschäften und Themenwelten – Tickets gibt es ausschließlich online.', 'Das Phantasialand liegt in Brühl bei Köln und ist ein Themenpark mit Fahrgeschäften in verschiedenen Themenwelten. Ihr kommt dort mit Kindern jeden Alters auf eure Kosten, solange ihr Tickets rechtzeitig online besorgt.

### Für wen passt das Phantasialand?

Der Park ist für Familien gedacht, die einen Tag mit Fahrgeschäften und Themenwelten verbringen wollen. Bei Kindern verschiedenen Alters lohnt es sich, vorab die Mindestgrößen der Attraktionen anzusehen und zu überlegen, welche Fahrgeschäfte alle gemeinsam machen können.

### Tickets und Eintritt

Das Wichtigste vorweg: Tickets gibt es ausschließlich online. Eine Tageskasse vor Ort nennt der Park nicht. Die Tickets gelten nur für den gewählten Tag und werden als E-Ticket genutzt. Die Preise hängen vom Datum ab, das Kontingent pro Besuchstag ist begrenzt, und die Preise können sich jederzeit ändern. Am Besuchstag ist ein Kauf online noch bis 14 Uhr möglich, solange Tickets verfügbar sind.

Für Familien wichtig:

- Kinder von 0 bis 3 Jahren haben freien Eintritt und brauchen kein vorab gebuchtes Ticket, aber einen amtlichen Ausweis oder eine Geburtsurkunde (auch als Kopie).
- Für Kinder von 4 bis einschließlich 11 Jahren gilt der Kinderpreis, sie brauchen am Besuchstag einen Altersnachweis.
- Geburtstagskinder bis einschließlich 11 Jahre kommen am Geburtstag kostenlos in den Park, wenn sie den Besuch vorab online reservieren und einen gültigen Ausweis vorlegen.
- Ein Familien- oder Geschwisterrabatt wird auf der Preisseite nicht genannt.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets früh buchen und mehrere Tage vergleichen, weil die Preise je nach Datum schwanken.
- Für jedes Kind den Altersnachweis dabei haben.
- Einen festen Treffpunkt vereinbaren und die Handynummer der Eltern mitgeben.
- Pausen einplanen, damit die Kleinen nicht überfordert werden.

### Öffnungszeiten

Der Park ist laut Seite täglich ab 9 Uhr geöffnet, die Attraktionen starten um 10 Uhr. Saisondaten nennt die Seite nicht, bitte vorher prüfen.

### Kann ich Tickets an der Kasse kaufen?
Nein, laut Park gibt es Tickets ausschließlich online.

### Wie funktioniert der freie Geburtstagseintritt?
Der Besuch muss vorab online reserviert werden, am Eingang ist ein gültiger Ausweis nötig.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), 'Brühl', false, true, false, null, null, false, false, true, null, 'https://www.phantasialand.de', 'Phantasialand Brühl mit Kindern: Tickets & Tipps', 'Phantasialand mit mehreren Kindern: Tickets nur online, Kinder bis 3 Jahre frei, Geburtstagskinder bis 11 Jahre gratis – Tipps und Hinweise für Familien.', array['Kinder von 0 bis 3 Jahren haben freien Eintritt', 'Geburtstagskinder bis einschließlich 11 Jahre kommen kostenlos (Online-Reservierung und Ausweis nötig)'], array['Tickets gibt es nur online, keine Tageskasse vor Ort', 'Preise sind datumsabhängig und das Kontingent pro Tag ist begrenzt'], 'draft', false),
  ('LEGOLAND Deutschland Resort (Günzburg)', 'legoland-deutschland-guenzburg', 'Freizeitpark in Günzburg (Bayern) an der A8, gedacht für Familien mit Kindern zwischen 2 und 12 Jahren.', 'Das LEGOLAND Deutschland Resort liegt in Günzburg in Bayern direkt an der A8 zwischen Stuttgart und München. Der Park ist laut Anbieter für Familien mit Kindern zwischen zwei und zwölf Jahren gedacht.

### Für wen passt LEGOLAND?

Wer Kinder im Kindergarten- und Grundschulalter hat, ist hier richtig. Der Park richtet sich bewusst an diese Altersgruppe. Mit Jugendlichen wird es schwieriger, weil der Park laut Anbieter auf Kinder bis 12 Jahre ausgerichtet ist – bei großem Altersunterschied lohnt sich ein Blick auf die Attraktionen vor dem Kauf.

### Was kostet der Eintritt?

Laut Startseite gibt es die Tageskarte online ab 35 € pro Person (Stand 28.10.2026). Zum Halloween-Event stand ein Angebot „Family & Friends“ ab 35 € statt 39 € pro Person, wenn mindestens drei Tickets gekauft werden – das ist ein Mengenangebot unter Vorbehalt der Verfügbarkeit, kein Familienrabatt. Eine Jahreskarte startet laut Seite ab 79 €. Preise für Kinder und Erwachsene mit Altersgrenzen stehen nicht auf der Startseite, ebenso wenig ein Freialter für kleine Kinder – diese Angaben findet ihr beim Ticketkauf.

Ein Parkplatzticket lässt sich vorab online buchen und ist dort günstiger als vor Ort.

### Tipps für Familien mit 3 oder mehr Kindern

- Tageskarten online buchen und die Angebote ab drei Tickets prüfen.
- Parkplatz vorab buchen.
- Bei sehr unterschiedlichen Altersgruppen früh klären, welche Attraktionen für alle passen.
- Pausen und Verpflegung einplanen.

### Öffnungszeiten und Events

Die Öffnungszeiten hängen vom Wochentag und der Saison ab, die genauen Zeiten stehen auf der Seite „Öffnungszeiten“. Das Halloween-Event lief 2026 vom 3. Oktober bis 8. November. Im Winter öffnet der Park an ausgewählten Terminen (28. November bis 10. Januar) als „WinterWonder LEGOLAND“, Frühbuchertickets kosteten 22 € pro Person (bis 15. November).

### Gibt es Übernachtungsangebote?
Ja, laut Seite Übernachtungspakete inklusive Parkeintritt ab 87 € pro Person.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), 'Günzburg', false, true, false, null, null, false, false, false, date '2026-10-28', 'https://www.legoland.de', 'LEGOLAND Günzburg mit Kindern: Tipps für Familien', 'LEGOLAND Deutschland mit mehreren Kindern: für Kinder von 2 bis 12 Jahren gemacht, Tageskarte ab 35 € online, Jahreskarte ab 79 € – Tipps für Familien.', array['Gedacht für Familien mit Kindern zwischen 2 und 12 Jahren', 'Tageskarte online ab 35 € pro Person (Stand 28.10.2026)'], array['Für Jugendliche weniger passend, da der Park auf Kinder bis 12 Jahre ausgerichtet ist', 'Preise für Kinder und Erwachsene stehen nicht getrennt auf der Startseite'], 'draft', false),
  ('HANSA-PARK (Sierksdorf)', 'hansa-park-sierksdorf', 'Freizeitpark in Sierksdorf an der Ostsee bei Lübeck – ein Ausflugsziel für Familien an der Küste.', 'Der HANSA-PARK liegt im Ostseebad Sierksdorf bei Lübeck und ist ein Freizeitpark an der Küste. Wer an der Ostsee Urlaub macht oder die Region besucht, kann hier einen Familientag verbringen.

### Für wen passt der HANSA-PARK?

Der Park richtet sich an Familien, die einen Tag mit Fahrgeschäften und Attraktionen verbringen möchten, gerne verbunden mit einem Ostsee-Urlaub. Wie bei jedem Freizeitpark mit Kindern unterschiedlichen Alters lohnt es sich, vorab die Mindestgrößen und Altersempfehlungen der Attraktionen anzusehen.

### Tickets und Preise

Tickets verkauft der Park über seinen Online-Ticketshop. Für die Saison 2027 gibt es laut Startseite eine Saisonkarte zu einem Aktionspreis, mit ermäßigtem Parken für Karteninhaber ab 18 Jahren bei Kauf bis 24.03.2027. Eintrittspreise, Altersgrenzen und Rabatte für Kinder nennt die Startseite nicht – diese findet ihr im Ticketshop. Wir tragen hier bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets vorab im Online-Shop kaufen und Preise für alle Altersgruppen vergleichen.
- Bei häufigeren Besuchen die Saisonkarte prüfen.
- Wetterfeste Kleidung und Verpflegung einplanen – an der Küste kann es windig sein.
- Einen festen Treffpunkt vereinbaren.

### Öffnungszeiten und Saison

Der Park ist saisonal geöffnet. Laut Startseite endet die Saison 2026, die Öffnungstage für 2027 sind dort noch nicht genannt (Stand 28.10.2026). Bitte vor dem Besuch auf der Seite des Parks nachsehen.

### Kann ich vor Ort Tickets kaufen?
Die Startseite verweist auf den Online-Ticketshop; Hinweise zu einer Tageskasse nennt sie nicht.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), 'Sierksdorf', false, true, false, null, null, false, false, false, null, 'https://www.hansapark.de', 'HANSA-PARK Sierksdorf: Infos für Familien', 'HANSA-PARK an der Ostsee mit mehreren Kindern: Lage bei Lübeck, Online-Ticketshop, Saisonkarte und Tipps für Großfamilien – was ihr vorab prüfen solltet.', array['Lage direkt an der Ostsee bei Lübeck', 'Online-Ticketshop und Saisonkarte'], array['Saison 2026 ist beendet, die Termine für 2027 sind auf der Startseite noch nicht angegeben (Stand 28.10.2026)'], 'draft', false),
  ('Serengeti-Park Hodenhagen', 'serengeti-park-hodenhagen', 'Safaripark in Hodenhagen in der Lüneburger Heide – Tiere erleben, mit Sommersaison und Winteröffnung.', 'Der Serengeti-Park liegt in Hodenhagen (Am Safaripark 1) in der Lüneburger Heide. Er ist ein Safaripark, in dem Tiere in weitläufigen Anlagen leben und Besucher die Tierwelt aus nächster Nähe erleben können.

### Für wen passt der Serengeti-Park?

Der Park eignet sich für Familien, die Tiere beobachten möchten – bei Kindern jeden Alters. Weil der Besuch zu großen Teilen unterwegs und im Freien stattfindet, ist wetterfeste Kleidung sinnvoll. Der Park nennt auf seiner Startseite außerdem geführte Safari-Events und VIP-Safaris für Gruppen.

### Tickets und Preise

Tickets gibt es im Ticketshop des Parks. Die Startseite verlinkt eine Preisübersicht, nennt aber selbst keine Eintrittspreise, Altersgrenzen oder Freialter. Allgemeine Gruppenermäßigungen beim Eintritt erwähnt der Park, Familienrabatte nicht. Wir tragen deshalb keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten – die aktuelle Preisliste findet ihr beim Anbieter.

### Tipps für Familien mit 3 oder mehr Kindern

- Preisübersicht und Ticketshop vorab ansehen, Preise für jedes Alter vergleichen.
- Auf die Öffnungszeiten achten, die der Park nach Saison ändert.
- Ersatzkleidung und Verpflegung einplanen.
- Mit den Kindern vorher besprechen, wie man sich bei Tieren verhält.

### Öffnungszeiten und Saison

Die Sommersaison 2026 läuft laut Startseite vom 21. März bis 1. November, täglich geöffnet. Die Winteröffnung mit dem Lichterfestival ist vom 6. November 2026 bis 28. Februar 2027. Tageszeiten nennt die Seite nicht.

### Ist der Park im Winter offen?
Ja, laut Startseite mit Winteröffnung und Lichterfestival vom 6. November 2026 bis 28. Februar 2027.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), 'Hodenhagen', false, true, true, null, null, false, false, false, null, 'https://www.serengeti-park.de', 'Serengeti-Park Hodenhagen: Safari mit Kindern', 'Serengeti-Park Hodenhagen mit mehreren Kindern: Sommersaison bis 1. November, Winteröffnung mit Lichterfestival, Tickets im Online-Shop und Tipps für Familien.', array['Sommersaison und Winteröffnung mit Lichterfestival', 'Online-Ticketshop'], array['Eintrittspreise stehen nicht auf der Startseite, bitte im Ticketshop prüfen'], 'draft', false),
  ('Erlebnis-Zoo Hannover', 'erlebnis-zoo-hannover', 'Zoo in Hannover mit mehreren Themenwelten – ein Tagesausflug in Niedersachsen für Familien.', 'Der Erlebnis-Zoo Hannover liegt in der niedersächsischen Landeshauptstadt und ist als Zoo mit mehreren Themenwelten angelegt. Für Familien in Niedersachsen und der Region ist er ein erreichbares Ziel für einen Tagesausflug.

### Für wen passt der Zoo?

Ein Zoobesuch passt für Kinder fast jeden Alters: Kleinere Kinder schauen und staunen, ältere entdecken Zusammenhänge, etwa bei Lebensräumen und Tierarten. In einem Zoo mit mehreren Themenwelten lässt sich der Tag gut in Etappen teilen.

### Preise und Öffnungszeiten

Wir konnten die Preis- und Öffnungszeitenseite des Zoos bei der Recherche nicht abrufen und tragen deshalb keine Preise oder Zeiten ein. Bitte prüft vor dem Besuch auf der Seite des Zoos, was Erwachsene und Kinder kosten, ab welchem Alter Kinder frei sind und ob es Familienkarten oder Jahreskarten gibt.

### Tipps für Familien mit 3 oder mehr Kindern

- Vorab auf der Zoo-Seite die Preise für alle Altersgruppen vergleichen.
- Prüfen, ob eine Jahreskarte bei mehreren Besuchen günstiger ist.
- Mit den Kindern vorher Lieblingstiere aussuchen und eine kleine Route planen.
- Pausen, Verpflegung und wetterfeste Kleidung einplanen.

### Ist der Zoo bei Regen sinnvoll?
Die meisten Wege führen im Freien, ob und welche Bereiche überdacht sind, zeigt der Zoo auf seiner Seite.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), 'Hannover', false, true, true, null, null, false, false, false, null, 'https://www.zoo-hannover.de', 'Erlebnis-Zoo Hannover: Tipps für Familien', 'Erlebnis-Zoo Hannover mit mehreren Kindern: Themenwelten, Tipps für Großfamilien und was ihr vor dem Besuch zu Preisen und Öffnungszeiten prüfen solltet.', array['Mehrere Themenwelten an einem Ort'], array['Preise und Öffnungszeiten haben wir nicht belegt, bitte auf der Zoo-Seite prüfen'], 'draft', false),
  ('Tierpark Hagenbeck (Hamburg)', 'tierpark-hagenbeck-hamburg', 'Tierpark in Hamburg-Lokstedt mit Tropen-Aquarium – Einzelpreise für Tierpark und Aquarium im Überblick.', 'Der Tierpark Hagenbeck liegt in Hamburg-Lokstedt (Lokstedter Grenzstraße 2). Zum Gelände gehört auch das Tropen-Aquarium. Der Tierpark ist ein Ausflugsziel in Hamburg, das Eintritt für beide Bereiche getrennt verlangt.

### Für wen passt der Tierpark?

Kinder jeden Alters entdecken hier Tiere aus aller Welt. Mit mehreren Kindern lässt sich der Besuch gut in Abschnitte teilen, etwa Tierpark am Vormittag und Tropen-Aquarium danach, wenn die Energie noch reicht.

### Was kostet der Eintritt?

Die offizielle Seite nennt diese Einzelpreise (Stand 28.10.2026):

- Tierpark: Erwachsene 29,00 €, Kinder (4 bis 16 Jahre) 19,00 €
- Tropen-Aquarium: Erwachsene 25,00 €, Kinder (4 bis 16 Jahre) 17,00 €

Ein Rechenbeispiel für eine Familie mit zwei Erwachsenen und drei Kindern im Alter von 4 bis 16 Jahren: Der Tierpark kostet allein 115,00 € (2 × 29 € + 3 × 19 €), das Tropen-Aquarium 101,00 € (2 × 25 € + 3 × 17 €), beides zusammen 216,00 €. Ab welchem Alter Kinder frei sind, nennt die Seite nicht, ebenso keinen Familienrabatt oder ein Familienticket.

### Tipps für Familien mit 3 oder mehr Kindern

- Überlegen, ob ihr nur Tierpark oder nur Tropen-Aquarium besucht, statt beides am selben Tag.
- Auf der Seite prüfen, ob es Familien- oder Jahreskarten gibt.
- Rechtzeitig kommen: Die Kassen schließen eine Stunde vor Betriebsende.
- Verpflegung, Regenschutz und feste Treffpunkte einplanen.

### Öffnungszeiten

Laut Seite öffnet der Tierpark von 9 bis 16:30 Uhr, das Tropen-Aquarium von 9 bis 18 Uhr. Die Kassen schließen eine Stunde vor Schluss, der letzte Einlass ist um 17 Uhr (am Eingang Gazellenkamp um 16:30 Uhr). Die Zeiten können sich saisonal ändern.

### Muss ich online buchen?
Die Seite verlinkt zum Online-Shop, sagt aber nicht, dass ein Online-Ticket Pflicht ist.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), 'Hamburg', false, true, true, 29.00, 19.00, false, false, false, date '2026-10-28', 'https://www.hagenbeck.de', 'Tierpark Hagenbeck mit Kindern: Preise & Tipps', 'Tierpark Hagenbeck in Hamburg: Eintritt für Tierpark und Tropen-Aquarium, Rechenbeispiel für eine Familie mit 3 Kindern und Tipps für den Besuch.', array['Tierpark und Tropen-Aquarium an einem Standort', 'Kinder von 4 bis 16 Jahren zahlen den Kinderpreis, also auch Jugendliche'], array['Tierpark und Tropen-Aquarium kosten getrennt Eintritt – bei mehreren Kindern summiert sich das', 'Kein Familienticket auf der Startseite genannt'], 'draft', false),
  ('Tropical Islands (Krausnick)', 'tropical-islands-krausnick', 'Tropisches Erlebnisbad und Freizeitwelt in Brandenburg – ein wetterunabhängiges Ziel mit Online-Familienticket.', 'Tropical Islands liegt in Krausnick in Brandenburg und ist eine tropische Badewelt unter einem Dach. Weil alles drinnen stattfindet, ist das Ziel bei jedem Wetter möglich – gerade im Herbst und Winter ein Vorteil.

### Für wen passt Tropical Islands?

Für Familien, die einen Tag im Warmen verbringen wollen: Kinder können baden und toben, Eltern entspannen. Die Altersgruppen sind laut Seite Kleinkinder (0–3), Kinder (4–12), Jugendliche (13–17) und Erwachsene (ab 18).

### Was kostet der Eintritt?

Die Startseite nennt Tageskarten ab 34,90 € (Stand 28.10.2026). Preise je Altersgruppe sind dort nicht aufgeführt, ebenso kein Freialter. Die Seite erwähnt außerdem ein Online-Familienticket zum Sparpreis, nennt dazu aber keine Details – die Bedingungen und den Preis zeigt der Ticketshop. Reduzierte Tarife gibt es unter anderem für Studierende, Menschen mit Behinderung ab einem bestimmten Grad und Senioren ab 65, sie lassen sich nicht mit anderen Rabatten kombinieren.

### Tipps für Familien mit 3 oder mehr Kindern

- Das Online-Familienticket prüfen, ob es für eure Familienkonstellation gilt.
- Online buchen, weil die Seite ausdrücklich Online-Preise bewirbt.
- Zeit für Pausen, Verpflegung und Umziehen einplanen.
- Wechselkleidung, Handtücher und Badekleidung für alle mitbringen.

### Öffnungszeiten

Die Startseite nennt keine Öffnungszeiten, sondern verweist auf eine eigene Seite. Bitte vor dem Besuch prüfen, ob an eurem Wunschtag geöffnet ist.

### Ab wann gilt der Kinderpreis?
Kinder zählen laut Seite von 4 bis 12 Jahren, Jugendliche von 13 bis 17 Jahren.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'erlebnisbaeder'), (select id from countries where code = 'DE'), 'Krausnick', true, false, true, null, null, true, false, false, date '2026-10-28', 'https://www.tropical-islands.de', 'Tropical Islands: Tickets & Familienticket', 'Tropical Islands mit mehreren Kindern: Tageskarten ab 34,90 €, Online-Familienticket, Altersgruppen und Tipps für Großfamilien – wetterunabhängig.', array['Wetterunabhängig, weil drinnen', 'Online-Familienticket zum Sparpreis (laut Seite)', 'Kleinkinder von 0 bis 3 Jahren bilden eine eigene Preisgruppe'], array['Preise je Altersgruppe sind auf der Startseite nicht aufgeführt', 'Ermäßigungen lassen sich nicht kombinieren'], 'draft', false),
  ('Therme Erding', 'therme-erding', 'Thermen- und Badelandschaft in Erding bei München – ein Ziel für Familien, wenn das Wetter nicht mitspielt.', 'Die Therme Erding liegt in Erding bei München und ist eine Thermen- und Badelandschaft. Für Familien ist sie ein Ziel bei Regen und kaltem Wetter.

### Für wen passt die Therme Erding?

Für Familien, die einen Tag im Warmen verbringen wollen: Kinder können sich im Wasser austoben, Erwachsene entspannen. Bei Kindern unterschiedlichen Alters lohnt sich der Blick auf die Hinweise zu Altersgrenzen und Aufsicht, die die Therme auf ihrer Seite nennt.

### Preise und Öffnungszeiten

Die Startseite der Therme nennt keine Preise nach Altersgruppen und keine Öffnungszeiten, sondern verweist auf eine eigene Seite mit „Preisen, Öffnungszeiten & Revisionen“. Im Online-Shop gibt es laut Startseite Eintrittsgutscheine ab 25,00 €, außerdem ist eine Online-Reservierung möglich. Gruppentarife erwähnt die Seite, Familientarife nicht. Wir tragen deshalb bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten.

### Tipps für Familien mit 3 oder mehr Kindern

- Vorab auf der Seite „Preise, Öffnungszeiten & Revisionen“ die Tarife für alle Altersgruppen ansehen.
- Prüfen, ob eine Online-Reservierung für euren Tag nötig oder sinnvoll ist.
- Revisionszeiten beachten, in denen Bereiche geschlossen sein können.
- Wechselkleidung, Handtücher und Verpflegung einplanen.

### Kann ich online reservieren?
Ja, laut Startseite gibt es eine Online-Reservierung.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'erlebnisbaeder'), (select id from countries where code = 'DE'), 'Erding', true, false, true, null, null, false, false, false, null, 'https://www.therme-erding.de', 'Therme Erding mit Kindern: Infos für Familien', 'Therme Erding mit mehreren Kindern: Online-Reservierung, Online-Shop mit Eintrittsgutscheinen und Tipps für Großfamilien – was ihr vorab prüfen solltet.', array['Online-Reservierung und Online-Shop'], array['Preise nach Altersgruppe und Öffnungszeiten haben wir nicht belegt, bitte beim Anbieter prüfen'], 'draft', false)
on conflict (slug) do nothing;
