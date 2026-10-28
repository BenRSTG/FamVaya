-- FamVaya: Familienaktivitäten, Batch 2 (20 echte Ziele, alle als ENTWURF).
--
-- Voraussetzung: Migration 0030 und aktivitaeten-batch-1.sql sind ausgeführt.
-- Idempotent: vorhandene Slugs werden übersprungen (on conflict (slug) do nothing).
--
-- ALLE Felder sind gefüllt, soweit sie belegt oder redaktionell begründbar sind:
-- Region, Kategorie, Dauer (redaktioneller Richtwert), Indoor/Outdoor/Wetter,
-- Merkmale, Altersgruppen, Tags, Pros/Cons, SEO, Familienscore. Preise nur, wenn
-- auf der offiziellen Anbieter-Seite belegt (Stand 28.10.2026), sonst leer.
-- Familienscore = Summe aus fünf Kriterien à 0-20 (Eignung für mehrere Kinder und
-- Altersmischung, Kosten für Großfamilien, Praktikabilität, Wetter-/Saison-
-- Flexibilität, Übersichtlichkeit/Aufsicht) — eine redaktionelle Ersteinschätzung,
-- im Admin jederzeit anpassbar. "Persönlich getestet" und Titelbild bleiben leer.

-- Referenzdaten (idempotent): Bundesländer und zwei neue Aktivitäts-Kategorien.
insert into regions (country_id, name, slug)
select c.id, v.name, v.slug
from countries c,
  (values
    ('Baden-Württemberg', 'baden-wuerttemberg'),
    ('Bayern', 'bayern'),
    ('Berlin', 'berlin'),
    ('Brandenburg', 'brandenburg'),
    ('Bremen', 'bremen'),
    ('Hamburg', 'hamburg'),
    ('Mecklenburg-Vorpommern', 'mecklenburg-vorpommern'),
    ('Niedersachsen', 'niedersachsen'),
    ('Nordrhein-Westfalen', 'nordrhein-westfalen'),
    ('Sachsen', 'sachsen'),
    ('Schleswig-Holstein', 'schleswig-holstein')
  ) as v(name, slug)
where c.code = 'DE'
on conflict (country_id, slug) do nothing;

insert into categories (name, slug, content_type, sort_order)
values
  ('Museen & Erlebniswelten', 'museen-erlebniswelten', 'activity', 4),
  ('Natur & Abenteuer', 'natur-abenteuer', 'activity', 5)
on conflict (content_type, slug) do nothing;

insert into activities (
  title, slug, short_description, full_description, category_id, country_id, region_id, city,
  duration_min, duration_max, indoor, outdoor, weather_suitable, adult_price, child_price,
  example_total_price, family_ticket, large_family_discount, booking_required, price_checked_at,
  external_url, seo_title, meta_description, family_rating, pros, cons, status, featured
) values
  ('Movie Park Germany (Bottrop)', 'movie-park-germany-bottrop', 'Freizeitpark in Bottrop in Nordrhein-Westfalen mit Film-Themenbereichen, Events wie Halloween und einer Regenregelung.', 'Der Movie Park Germany liegt in Bottrop in Nordrhein-Westfalen und ist ein Freizeitpark mit Film-Themenbereichen. Das Jahr über gibt es Events wie das Halloween Horror Festival und Movie Park''s Hollywood Christmas.

### Für wen passt der Movie Park?

Der Park spricht Familien mit Kindern und Jugendlichen an. Für die Jüngsten gibt es Familienangebote und Kindergeburtstage, zum Beispiel mit PAW Patrol. Wie bei jedem Park lohnt es sich, vor dem Besuch die Mindestgrößen der Attraktionen zu prüfen.

### Was kostet der Eintritt?

Laut Ticketübersicht kostet die Tageskarte 59,90 € (die Altersgruppe nennt die Übersicht nicht). Kinder von 4 bis 11 Jahren haben eine eigene Tageskarte, der Preis steht nicht im Text der Startseite. Kinder unter 4 Jahren brauchen kein Ticket. Ermäßigt reisen Gäste ab 65 Jahren, Schwangere und Gäste mit einem Grad der Behinderung unter 100 (mit Nachweis). Zeitlich begrenzt waren Halloween-Tickets ab 41,90 € und ein Verkaufsangebot ab 38,90 € zu finden. Eine Saisonkarte 2027 gibt es ab 89,90 €. Eine Familienkarte nennt die Startseite nur als Link, ohne Details.

Tickets gibt es mit festem Termin oder ohne Termin. Für Saisonpässe und Tageskarten ohne Termin ist laut Park eine Reservierung erforderlich, besonders wegen des Halloween-Festivals. Übernachtung mit Frühstück und einem Tag Eintritt gibt es ab 59 € pro Person.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets mit festem Termin buchen und die Kinderpreise aller Altersstufen vergleichen.
- Die Regenregelung im Kopf behalten: Bei mindestens 2 Stunden durchgehendem Regen am Besuchstag gibt es laut Park freien Eintritt – die genauen Bedingungen vorher beim Park prüfen.
- Parkplatztickets vorab buchen, es gibt auch ein bevorzugtes Ticket.
- Für Kinder unter 4 Jahren ist kein Ticket nötig, trotzdem Altersnachweis mitnehmen.

### Öffnungszeiten und Saison

Die Öffnungszeiten stehen auf einer eigenen Unterseite des Parks. Flexible Tageskarten sind laut Startseite bis zum 05.01.2027 einlösbar. Aktuelle Events und Zeiten findet ihr beim Park.

### Gibt es einen Rabatt bei Regen?
Laut Startseite gibt es freien Eintritt, wenn es am Besuchstag mindestens zwei Stunden durchgehend regnet. Die Bedingungen solltet ihr vorher beim Park nachlesen.

### Ab wann brauchen Kinder ein Ticket?
Kinder unter 4 Jahren benötigen kein Ticket, ab 4 Jahren gilt die Tageskarte für Kinder von 4 bis 11 Jahren.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'nordrhein-westfalen'), 'Bottrop', 360, 540, false, true, false, null, null, null, false, false, false, date '2026-10-28', 'https://www.movieparkgermany.de', 'Movie Park Germany mit Kindern: Preise & Tipps', 'Movie Park Germany mit mehreren Kindern: Tageskarte 59,90 €, Kinder bis 3 frei, Regenregelung und Tipps für Familien – so plant ihr den Besuch.', 62, array['Kinder unter 4 Jahren brauchen kein Ticket', 'Bei mindestens 2 Stunden durchgehendem Regen am Besuchstag gibt es laut Park freien Eintritt'], array['Tageskarte laut Ticketübersicht 59,90 € pro Person, mehrere Kinder summieren sich', 'Ohne festen Termin ist eine Reservierung nötig, besonders zu Events wie Halloween'], 'draft', false),
  ('Ravensburger Spieleland (Meckenbeuren)', 'ravensburger-spieleland-meckenbeuren', 'Freizeitpark am Bodensee, der sich an Familien mit Kindern richtet – mit Saisonkarte und Feriendorf.', 'Das Ravensburger Spieleland liegt in Meckenbeuren am Bodensee und ist ein Freizeitpark für Familien. Neben dem Park gibt es ein Feriendorf mit Ferienhäusern, Zeltplätzen und Wohnmobilstellplätzen, so dass sich ein Besuch gut mit Urlaub verbinden lässt.

### Für wen passt das Spieleland?

Der Park richtet sich an Familien mit Kindern. Wer mit jüngeren Kindern kommt, findet hier einen Ausflugstag in überschaubarem Rahmen. Welche Attraktion ab welchem Alter oder welcher Größe erlaubt ist, steht im Park und beim Anbieter.

### Preise und Tickets

Die Startseite nennt keine Tageskarten-Preise und keine Altersgrenzen und verlinkt nur auf die Preisseite. Eine Saisonkarte 2027 war dort zum Zeitpunkt der Recherche bis zum 1. November für 103 € erhältlich. Wir tragen bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten.

### Tipps für Familien mit 3 oder mehr Kindern

- Vorab die Preise für alle Altersstufen auf der Preisseite vergleichen.
- Wenn ihr öfter kommt, die Saisonkarte prüfen.
- Einen Tag im Feriendorf einplanen, wenn ihr länger bleibt.
- Pausen und Verpflegung einplanen, ein Tag im Park ist für Kleinkinder lang.

### Öffnungszeiten und Saison

Zum Zeitpunkt der Recherche zeigte die Startseite „Heute: 10–16 Uhr“, die letzte Öffnungswoche der Saison 2026 stand im Zeichen von Halloween. Die vollständigen Zeiten stehen auf einer eigenen Seite des Parks.

### Kann ich im Feriendorf übernachten?
Ja, laut Startseite gibt es ein Feriendorf mit Ferienhäusern, Zeltplätzen und Wohnmobilstellplätzen.

### Gibt es eine Saisonkarte?
Ja, die Saisonkarte 2027 wurde bei der Recherche mit einem Frühbucher-Preis angeboten.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'baden-wuerttemberg'), 'Meckenbeuren', 300, 480, false, true, false, null, null, null, false, false, false, null, 'https://www.spieleland.de', 'Ravensburger Spieleland: Infos für Familien', 'Ravensburger Spieleland am Bodensee mit mehreren Kindern: Saisonkarte 2027, Feriendorf mit Ferienhäusern und Hinweise, was ihr vor dem Besuch prüfen solltet.', 69, array['Feriendorf mit Ferienhäusern, Zeltplätzen und Wohnmobilstellplätzen', 'Saisonkarte 2027 mit Frühbucher-Preis'], array['Eintrittspreise und Kinderpreise stehen nicht auf der Startseite', 'Die Saison 2026 endet, Termine für 2027 bitte beim Park prüfen'], 'draft', false),
  ('Playmobil-FunPark (Zirndorf)', 'playmobil-funpark-zirndorf', 'Spielpark in Zirndorf bei Nürnberg für Kinder und Familien – Eintritt nur mit gültigem Online-Ticket, ganzjährig geöffnet.', 'Der Playmobil-FunPark liegt in Zirndorf bei Nürnberg und ist ein Spielpark, der sich erkennbar an Kinder und Familien richtet. Es gibt einen KidsClub und Angebote für Kindergeburtstage.

### Für wen passt der FunPark?

Für Familien mit Kindern im Spielalter, die einen Tag lang draußen und drinnen spielen wollen. Weil der Park auch im Winter öffnet, ist er nicht nur ein Sommerziel.

### Tickets und Preise

Wichtig: Der Eintritt in den FunPark ist laut Park nur mit gültigem Online-Ticket möglich. Preise nennt die Startseite nicht, sie stehen auf der Seite „Öffnungszeiten & Preise“. Ein Übernachtungsangebot mit Hotel und Parkeintritt gibt es ab 59 € pro Person.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets vorab online für einen festen Tag buchen, ohne Online-Ticket kommt ihr nicht hinein.
- Die Preise für alle Kinder vor dem Kauf vergleichen.
- Für Familien mit Anreise von weiter weg das Angebot mit Übernachtung prüfen.
- Verpflegung und Wechselkleidung einplanen.

### Öffnungszeiten

Laut Startseite gilt: Hauptsaison 23.03.2026 bis 08.11.2026 von 9 bis 18 Uhr, Schlummertage 09.11. bis 27.11.2026 von 10 bis 18 Uhr, Wintersaison 28.11.2026 bis 14.02.2027 von 10 bis 18 Uhr.

### Kann ich vor Ort Tickets kaufen?
Laut Park ist der Eintritt nur mit gültigem Online-Ticket möglich.

### Gibt es Kindergeburtstage?
Ja, der Park bietet Kindergeburtstage an, Details stehen bei Anbieter.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'bayern'), 'Zirndorf', 240, 420, true, true, false, null, null, null, false, false, true, null, 'https://www.playmobil-funpark.de', 'Playmobil-FunPark Zirndorf: Tickets & Zeiten', 'Playmobil-FunPark in Zirndorf mit mehreren Kindern: Eintritt nur mit Online-Ticket, Öffnungszeiten im Jahresverlauf und Tipps für Familien mit mehreren Kindern.', 70, array['Ganzjährig geöffnet, auch in der Wintersaison', 'Hotel plus Parkeintritt ab 59 € pro Person'], array['Eintritt nur mit gültigem Online-Ticket', 'Eintrittspreise stehen nicht auf der Startseite'], 'draft', false),
  ('Erlebnispark Tripsdrill (Cleebronn)', 'erlebnispark-tripsdrill-cleebronn', 'Erlebnispark in Cleebronn (Baden-Württemberg) mit Wildparadies – im Parkticket ist der Eintritt ins Wildparadies enthalten.', 'Der Erlebnispark Tripsdrill liegt in Cleebronn in Baden-Württemberg. Zum Gelände gehört das Wildparadies, ein Wildpark mit über 60 Tierarten, begehbaren Freigehegen mit Fütterungsmöglichkeit, Abenteuerspielplatz, Walderlebnispfad und Barfußpfad.

### Für wen passt Tripsdrill?

Für Familien, die einen Tag mit Fahrgeschäften und Tieren verbinden wollen: Das Wildparadies bietet ruhigere Abschnitte für die Kleinen, der Erlebnispark Fahrgeschäfte für ältere Kinder. Das Wildparadies ist im Ticket für den Erlebnispark enthalten.

### Tickets und Preise

Die Startseite nennt keine Eintrittspreise, Altersgrenzen oder ein Freialter für Kinder und verlinkt nur auf die Preisseite. Der Park weist darauf hin, dass Online-Tickets Geld sparen. Ermäßigte Tickets, zum Beispiel für Menschen mit Behinderung und für Geburtstagskinder, gibt es nur an der Kasse. Ein Jahres-Pass gilt 12 Monate im Erlebnispark und im Wildparadies. Eine Online-Buchung ist nicht zwingend.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets online kaufen und die Preise für alle Altersstufen vergleichen.
- Wildparadies und Erlebnispark auf zwei Tage verteilen, wenn ihr übernachtet: Übernachtungsgäste erhalten Park-Tickets zu Sonderkonditionen.
- Fütterungszeiten im Wildparadies vorab nachsehen.
- Wechselkleidung und Regenschutz einplanen.

### Öffnungszeiten und Saison

Der Erlebnispark ist laut Startseite täglich bis zum 8. November 2026 geöffnet (an dem Tag 10 bis 20 Uhr). Das Wildparadies ist 365 Tage im Jahr geöffnet (an dem Tag 9 bis 17 Uhr). Zeiten ändern sich, bitte beim Park prüfen.

### Ist das Wildparadies im Eintritt enthalten?
Ja, laut Startseite enthalten Tickets für den Erlebnispark den Eintritt ins Wildparadies.

### Kann ich vor Ort kaufen?
Ja, eine Online-Buchung ist nicht zwingend, aber günstiger.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'baden-wuerttemberg'), 'Cleebronn', 300, 480, false, true, false, null, null, null, false, false, false, null, 'https://www.tripsdrill.de', 'Erlebnispark Tripsdrill mit Kindern: Tipps', 'Erlebnispark Tripsdrill mit mehreren Kindern: Eintritt ins Wildparadies im Ticket enthalten, Saison bis 8. November, Online-Ticket spart Geld – Tipps für Familien.', 69, array['Im Ticket für den Erlebnispark ist der Eintritt ins Wildparadies enthalten', 'Das Wildparadies ist 365 Tage im Jahr geöffnet'], array['Eintrittspreise stehen nicht auf der Startseite', 'Ermäßigte Tickets (z. B. für Geburtstagskinder) gibt es nur an der Kasse'], 'draft', false),
  ('Fort Fun Abenteuerland (Bestwig)', 'fort-fun-abenteuerland-bestwig', 'Freizeitpark in Bestwig im Sauerland mit Saison von März bis Anfang November und günstigem Ticket ab 14 Uhr.', 'Das Fort Fun Abenteuerland liegt in Bestwig (Aurorastraße 50) im Sauerland und ist ein Freizeitpark mit Wildwest-Flair. Familien erreichen ihn gut aus Nordrhein-Westfalen und angrenzenden Regionen.

### Für wen passt Fort Fun?

Für Familien, die einen Tag im Freizeitpark verbringen möchten. Mit Kindern unterschiedlichen Alters lohnt sich vorab der Blick auf die Mindestgrößen der Attraktionen. Der Park bietet außerdem Kindergeburtstage und Ferienfreizeiten als Gruppenangebote.

### Preise und Tickets

Die Startseite nennt keine Preise nach Altersgruppen und keine Regel, ab wann Kinder kostenlos sind. Genannt werden nur ein Ab-14-Uhr-Ticket ab 15 € im Ticketshop und Gruppenpreise für private Gruppen ab 18,40 € pro Person. Der Park weist darauf hin, dass Online-Tickets günstiger sind, und fordert auf, im Ticketshop einen Besuchstag zu wählen.

### Tipps für Familien mit 3 oder mehr Kindern

- Das Ab-14-Uhr-Ticket prüfen, wenn ihr spät startet oder mit kleinen Kindern kürzer bleiben wollt.
- Online-Tickets für einen festen Besuchstag kaufen.
- Bei schlechtem Wetter an der Tageskasse nach der aktuellen Lage fragen: Der Park kann früher schließen.
- Regenschutz und Verpflegung einplanen.

### Öffnungszeiten und Saison

Die Saison 2026 lief vom 28. März bis 1. November. Der Park ist in der Regel von 10 bis 17 Uhr geöffnet, im Juli und August sowie an besonderen Tagen länger. Aktuelle Zeiten und ein Kalender stehen beim Park.

### Kann ich online Geld sparen?
Ja, laut Park sind Online-Tickets günstiger als die Tageskasse.

### Gibt es Übernachtungsangebote?
Der Park nennt ein Abenteuercamp; Jahreskarteninhaber zahlen dort laut Startseite nur Übernachtung und Frühstück.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'freizeitparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'nordrhein-westfalen'), 'Bestwig', 300, 480, false, true, false, null, null, null, false, false, false, null, 'https://www.fortfun.de', 'Fort Fun Abenteuerland: Infos für Familien', 'Fort Fun Abenteuerland im Sauerland mit mehreren Kindern: Saison 28. März bis 1. November 2026, Ab-14-Uhr-Ticket ab 15 €, Online-Tickets sind günstiger – Tipps.', 61, array['Ab-14-Uhr-Ticket ab 15 € im Ticketshop (Stand 28.10.2026)', 'Online-Tickets sind laut Park günstiger'], array['Saisonbetrieb, bei schlechtem Wetter kann der Park früher schließen', 'Preise nach Altersgruppen und Freialter stehen nicht auf der Startseite'], 'draft', false),
  ('Zoo Leipzig', 'zoo-leipzig', 'Zoo in Leipzig, an 365 Tagen im Jahr geöffnet, mit der Tropenerlebniswelt Gondwanaland.', 'Der Zoo Leipzig liegt an der Pfaffendorfer Straße 29 in Leipzig und ist laut eigener Angabe an 365 Tagen im Jahr geöffnet. Bekannt ist er für die Tropenerlebniswelt Gondwanaland.

### Für wen passt der Zoo?

Ein Zoo passt für Kinder fast jeden Alters: Kleinere schauen und staunen, ältere entdecken Lebensräume und Tierarten. Weil der Zoo das ganze Jahr geöffnet ist, ist er auch an kühleren Tagen ein Ziel, besonders wegen der überdachten Tropenwelt.

### Preise und Tickets

Die Startseite nennt keine Eintrittspreise, Altersgrenzen oder Familienkarten und verlinkt nur auf die Seite „Preise & Tickets“. Einen Online-Shop gibt es, eine Pflicht nennt die Startseite nicht. Wir tragen bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten.

### Tipps für Familien mit 3 oder mehr Kindern

- Die Preise für alle Altersstufen auf der Seite „Preise & Tickets“ vergleichen und prüfen, ob eine Jahreskarte lohnt.
- Hunde bleiben zuhause, sie dürfen laut Zoo nicht mit hinein.
- Fütterungen und Gondwanaland in den Tagesplan aufnehmen.
- Pausen und Verpflegung einplanen.

### Öffnungszeiten

Der Zoo ist laut Startseite 365 Tage im Jahr geöffnet, am Tag der Recherche von 9 bis 18 Uhr. Die Zeiten ändern sich mit der Jahreszeit.

### Dürfen Hunde mit?
Nein, laut Zoo dürfen Hunde nicht in den Zoo.

### Ist der Zoo auch im Winter geöffnet?
Ja, laut Startseite 365 Tage im Jahr.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'sachsen'), 'Leipzig', 240, 420, true, true, false, null, null, null, false, false, false, null, 'https://www.zoo-leipzig.de', 'Zoo Leipzig mit Kindern: Tipps für Familien', 'Zoo Leipzig mit mehreren Kindern: 365 Tage im Jahr geöffnet, Gondwanaland, keine Hunde erlaubt – was ihr zu Preisen und Zeiten vorab prüfen solltet.', 74, array['365 Tage im Jahr geöffnet', 'Tropenerlebniswelt Gondwanaland auch bei schlechtem Wetter'], array['Hunde dürfen nicht in den Zoo', 'Preise und Altersgrenzen nicht auf der Startseite, bitte im Ticketshop prüfen'], 'draft', false),
  ('Zoo Berlin', 'zoo-berlin', 'Zoologischer Garten in Berlin mit Großen Pandas, Fütterungen und Aquarium – laut Zoo der älteste und meistbesuchte in Deutschland.', 'Der Zoo Berlin (Hardenbergplatz 8) beschreibt sich als ältester und meistbesuchter Zoo Deutschlands. Er hat nach eigener Angabe die einzigen Großen Pandas in Deutschland und feierte 2026 sein 180-jähriges Bestehen.

### Für wen passt der Zoo Berlin?

Für Familien, die einen Tag in der Stadt mit Tieren verbringen wollen. Kinder jedes Alters finden etwas: Fütterungen, Tierhäuser und ein Aquarium, dessen Wiedereröffnung die Seite erwähnt.

### Preise und Tickets

Die Startseite bewirbt den Online-Kauf, um Zeit und Geld zu sparen, und verlinkt auf Preise für Tageskarten und Jahreskarten. Die Preise selbst, Altersgrenzen für Kinder und Familienpreise stehen nicht auf der Startseite. Wir tragen bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets online kaufen und die Preise für alle Altersstufen vergleichen.
- Fütterungszeiten am Besuchstag auf der Startseite nachsehen und den Tag danach planen.
- Im Winter früh kommen: Der Zoo schloss am Tag der Recherche um 16:30 Uhr, letzter Einlass 15:30 Uhr.
- Pausen und Verpflegung einplanen.

### Öffnungszeiten

Am 28. Oktober 2026 war der Zoo von 9 bis 16:30 Uhr geöffnet (letzter Einlass 15:30 Uhr). Die Zeiten ändern sich mit der Jahreszeit.

### Gibt es Fütterungszeiten?
Ja, die Startseite nannte am Tag der Recherche Elefanten um 11:30 Uhr, Flusspferde um 12:15 Uhr und Bonobos um 13:30 Uhr.

### Sind Online-Tickets nötig?
Die Startseite bewirbt den Online-Kauf, eine Pflicht nennt sie nicht.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'berlin'), 'Berlin', 240, 420, true, true, false, null, null, null, false, false, false, null, 'https://www.zoo-berlin.de', 'Zoo Berlin mit Kindern: Infos für Familien', 'Zoo Berlin mit mehreren Kindern: Pandas, Fütterungszeiten, Aquarium und Online-Tickets – was ihr zu Preisen und Öffnungszeiten vorab prüfen solltet.', 68, array['Fütterungszeiten, etwa bei Elefanten, Flusspferden und Bonobos', 'Online-Tickets werden vom Zoo empfohlen'], array['Preise, Altersgrenzen und Familienpreise stehen nicht auf der Startseite', 'Im Winter schließt der Zoo früher (am Tag der Recherche 16:30 Uhr)'], 'draft', false),
  ('Wilhelma Stuttgart', 'wilhelma-stuttgart', 'Zoologisch-botanischer Garten in Stuttgart – ein Ausflugsziel für Familien in Baden-Württemberg.', 'Die Wilhelma liegt in Stuttgart und ist ein zoologisch-botanischer Garten, also eine Verbindung aus Zoo und Garten. Für Familien in Baden-Württemberg ist sie ein Ziel für einen Tagesausflug.

### Für wen passt die Wilhelma?

Für Familien mit Kindern jedes Alters, die Tiere und Pflanzen entdecken möchten. Der Besuch lässt sich gut in Etappen teilen.

### Preise und Öffnungszeiten

Die Seite der Wilhelma war bei der Recherche für uns nicht abrufbar (Zugriff verweigert). Deshalb tragen wir keine Preise oder Zeiten ein. Bitte prüft vor dem Besuch auf der Seite der Wilhelma, was Erwachsene und Kinder kosten, ab welchem Alter Kinder frei sind und ob es Familien- oder Jahreskarten gibt.

### Tipps für Familien mit 3 oder mehr Kindern

- Vorab auf der Seite die Preise für alle Altersgruppen vergleichen und eine Jahreskarte prüfen, wenn ihr mehrmals kommt.
- Mit den Kindern vorher Lieblingstiere aussuchen und eine kleine Route planen.
- Pausen, Verpflegung und wetterfeste Kleidung einplanen.

### Öffnungszeiten

Haben wir nicht belegt. Bitte beim Anbieter nachsehen.

### Ist die Wilhelma bei Regen sinnvoll?
Wie viel überdacht ist, zeigt die Wilhelma auf ihrer Seite; ein Teil des Geländes sind Gewächshäuser.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'baden-wuerttemberg'), 'Stuttgart', 240, 420, true, true, false, null, null, null, false, false, false, null, 'https://www.wilhelma.de', 'Wilhelma Stuttgart mit Kindern: Infos', 'Wilhelma Stuttgart mit mehreren Kindern: zoologisch-botanischer Garten, Tipps für Familien und was ihr vor dem Besuch zu Preisen und Öffnungszeiten prüfen solltet.', 71, array['Zoo und botanischer Garten an einem Ort'], array['Preise und Öffnungszeiten haben wir nicht belegt, bitte auf der Seite der Wilhelma prüfen'], 'draft', false),
  ('Zoo Osnabrück', 'zoo-osnabrueck', 'Zoo in Osnabrück mit Dinoversum, Fütterungen und Online-Tickets ab 19,90 € für Erwachsene und 12,90 € für Kinder von 3 bis 16 Jahren.', 'Der Zoo Osnabrück liegt am Klaus-Strick-Weg 12 in Osnabrück. Neben Tieren bietet er ein Dinoversum mit über 20 lebensgroßen Sauriern und einem Programm mit Virtual-Reality-Erlebnis.

### Für wen passt der Zoo Osnabrück?

Für Familien in Niedersachsen und der Region, die einen Tagesausflug mit Tieren und Erlebnissen planen. Fütterungen gibt es an Wochenenden und täglich in den Ferien (Niedersachsen und NRW), mit wechselnden Tieren und Zeiten.

### Was kostet der Eintritt für eine große Familie?

Laut Startseite kosten Online-Tagestickets ab 19,90 € für Erwachsene und 12,90 € für Kinder von 3 bis 16 Jahren. Die Preise sind dynamisch, an der Zookasse sind sie meist teurer. Ein Rechenbeispiel mit diesen „ab“-Preisen: Zwei Erwachsene und drei Kinder zahlen mindestens 78,50 € (2 × 19,90 € + 3 × 12,90 €). Jahreskarten gibt es ab 149 € für Familien, 129 € für Partner, 65 € für Erwachsene und 35 € für Kinder. Ein am selben Tag gekauftes Tagesticket kann an der Zookasse auf eine Jahreskarte angerechnet werden. Das Feierabendticket gilt montags bis freitags ab 16:30 Uhr.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets online kaufen: Die Preise sind dynamisch und an der Kasse meist höher.
- Bei mehreren Besuchen im Jahr die Familien-Jahreskarte rechnen.
- Im Jubiläumsjahr 2026 (90 Jahre Zoo) gab es freien Eintritt am eigenen Geburtstag mit Lichtbildausweis.
- Fütterungszeiten am Besuchstag nachsehen.

### Öffnungszeiten

Die Startseite nennt keine allgemeinen Öffnungszeiten. Der WissensStand ist am Wochenende und an Feiertagen von 10 bis 16:45 Uhr besetzt.

### Ab welchem Alter zahlen Kinder?
Der Kinderpreis gilt laut Startseite für Kinder von 3 bis 16 Jahren.

### Lohnt sich die Jahreskarte?
Eine Familien-Jahreskarte startet laut Startseite bei 149 €. Ob sie sich lohnt, hängt davon ab, wie oft ihr kommt.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'niedersachsen'), 'Osnabrück', 240, 420, false, true, false, 19.90, 12.90, 78.50, false, false, false, date '2026-10-28', 'https://www.zoo-osnabrueck.de', 'Zoo Osnabrück mit Kindern: Preise & Tipps', 'Zoo Osnabrück mit mehreren Kindern: Online-Tickets ab 19,90 € (Kinder ab 12,90 €), Familien-Jahreskarte ab 149 €, Dinoversum – ein Rechenbeispiel für Großfamilien.', 73, array['Familien-Jahreskarte ab 149 €', 'Im Jubiläumsjahr 2026 freier Eintritt am eigenen Geburtstag (Lichtbildausweis)'], array['Online-Preise sind dynamisch, an der Zookasse meist teurer', 'Das Feierabendticket gilt nur montags bis freitags ab 16:30 Uhr'], 'draft', false),
  ('ZOOM Erlebniswelt (Gelsenkirchen)', 'zoom-erlebniswelt-gelsenkirchen', 'Zoo in Gelsenkirchen im Ruhrgebiet, aufgebaut in den Erlebniswelten Alaska, Afrika und Asien.', 'Die ZOOM Erlebniswelt liegt in Gelsenkirchen im Ruhrgebiet und ist ein Zoo, der in die Erlebniswelten Alaska, Afrika und Asien gegliedert ist.

### Für wen passt die ZOOM Erlebniswelt?

Für Familien im Ruhrgebiet und Umgebung, die einen Tag mit Tieren verbringen wollen. Durch die Gliederung in Erlebniswelten lässt sich der Besuch gut in Etappen teilen.

### Preise und Öffnungszeiten

Die Startseite des Zoos enthielt bei der Recherche für uns nur Menüpunkte, aber weder Preise noch Öffnungszeiten. Deshalb tragen wir keine Preise oder Zeiten ein. Bitte prüft vor dem Besuch auf der Seite des Zoos, was Erwachsene und Kinder kosten, ab welchem Alter Kinder frei sind und ob es Familien- oder Jahreskarten gibt.

### Tipps für Familien mit 3 oder mehr Kindern

- Vorab Preise für alle Altersgruppen vergleichen und eine Jahreskarte prüfen, wenn ihr mehrmals kommt.
- Eine kleine Route planen: eine Erlebniswelt pro Etappe.
- Pausen, Verpflegung und wetterfeste Kleidung einplanen.

### Öffnungszeiten

Haben wir nicht belegt. Bitte beim Anbieter nachsehen.

### Ist der Zoo bei Regen sinnvoll?
Wie viel überdacht ist, zeigt der Zoo auf seiner Seite.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'nordrhein-westfalen'), 'Gelsenkirchen', 240, 420, false, true, false, null, null, null, false, false, false, null, 'https://www.zoom-erlebniswelt.de', 'ZOOM Erlebniswelt Gelsenkirchen: Infos', 'ZOOM Erlebniswelt in Gelsenkirchen mit mehreren Kindern: Tipps für Familien im Ruhrgebiet und was ihr vor dem Besuch zu Preisen und Öffnungszeiten prüfen solltet.', 65, array['Mehrere Erlebniswelten an einem Ort'], array['Preise und Öffnungszeiten haben wir nicht belegt, bitte auf der Seite des Zoos prüfen'], 'draft', false),
  ('Allwetterzoo Münster', 'allwetterzoo-muenster', 'Zoo in Münster, dessen Wege größtenteils überdacht sind – ein Tierpark-Besuch auch bei Regen.', 'Der Allwetterzoo Münster liegt an der Sentruper Straße 315 in Münster. Laut Startseite sind die Wege größtenteils überdacht, was den Zoo zu einem Ziel auch bei wechselhaftem Wetter macht. Neue Fahrzeuge sollen den Zoo außerdem für Menschen mit Einschränkungen erlebbar machen.

### Für wen passt der Allwetterzoo?

Für Familien, die einen Zoobesuch auch bei Regen planen wollen. Kinder jedes Alters finden Tiere zum Schauen; Pausen im Trockenen sind leichter.

### Preise und Tickets

Die regulären Eintrittspreise, ein Freialter für Kinder und Familienpreise nennt die Startseite nicht, sie verweist auf „Tickets und Preise“. Tickets gibt es im Online-Shop. In den Herbstferien (19. bis 30. Oktober 2026) gab es Aktionstage: ein Familien-Montag (2 Erwachsene und 2 Kinder 50 €), ein Senioren-Mittwoch (ein Kind kostenlos) und ein Pärchen-Freitag (2 Erwachsene 40 €); die Angebote am Montag und Freitag galten nur an der Tageskasse. Regelmäßige Aktionen solltet ihr auf der Seite nachsehen.

### Tipps für Familien mit 3 oder mehr Kindern

- Auf der Seite nach Aktionstagen für Familien schauen.
- Die Preise für alle Altersstufen vor dem Besuch vergleichen.
- Regenschutz trotzdem einpacken, nicht alle Wege sind überdacht.
- Pausen und Verpflegung einplanen.

### Öffnungszeiten

Haben wir nicht belegt, die Startseite verweist auf „Öffnungszeiten und Anfahrt“.

### Ist der Zoo bei Regen sinnvoll?
Laut Startseite sind die Wege größtenteils überdacht.

### Gibt es Familienangebote?
In den Herbstferien 2026 gab es einen Familien-Montag für 2 Erwachsene und 2 Kinder zu 50 €; aktuelle Aktionen stehen auf der Seite.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'zoos-tierparks'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'nordrhein-westfalen'), 'Münster', 240, 420, true, true, true, null, null, null, false, false, false, null, 'https://www.allwetterzoo.de', 'Allwetterzoo Münster mit Kindern: Tipps', 'Allwetterzoo Münster mit mehreren Kindern: überdachte Wege, Aktionstage für Familien und Tipps, wie ihr bei Preisen und Öffnungszeiten vorab prüft.', 79, array['Wege größtenteils überdacht, daher auch bei Regen gut', 'Aktionstage für Familien, z. B. ein Familien-Montag in den Herbstferien'], array['Reguläre Eintrittspreise und Öffnungszeiten stehen nicht auf der Startseite', 'Aktionsangebote galten teils nur an der Tageskasse'], 'draft', false),
  ('Rulantica (Europa-Park, Rust)', 'rulantica-rust', 'Wasserwelt des Europa-Park in Rust – geöffnet von 9:30 bis 22 Uhr, mit Bereich für Kleinkinder (Trølldal).', 'Rulantica ist die Wasserwelt des Europa-Park in Rust (Roland-Mack-Ring 1). Sie ist ein Erlebnisbad, das bei jedem Wetter funktioniert, mit Becken, Attraktionen und mehreren Poolbars.

### Für wen passt Rulantica?

Für Familien mit Kindern unterschiedlichen Alters: Für Kleinkinder und Familien gibt es den Bereich Trølldal, ältere Kinder und Jugendliche nutzen die übrigen Attraktionen. Welche Attraktion ab welcher Größe oder welchem Alter erlaubt ist, nennt die Seite nicht auf der Startseite.

### Was kostet der Eintritt?

Laut Park (Besuche bis 19.03.2027, Preise je nach Tag): Tagesticket 38,00 € bis 54,00 €, Abendticket (17 bis 22 Uhr) 35,00 € bis 46,50 €, Moonlight-Ticket (19 bis 22 Uhr) 28,00 € bis 34,00 €. Die Ticketkategorien sind Erwachsene ab 12 Jahren, Kinder von 4 bis 11 Jahren und Senioren ab 60 Jahren. Ab welchem Alter Kinder frei sind, steht nicht auf der Seite. Eine Online-Buchung ist nicht vorgeschrieben, wird aber empfohlen und garantiert den Einlass. Die Tageskasse gibt es nur nach Verfügbarkeit und mit Aufpreis.

### Tipps für Familien mit 3 oder mehr Kindern

- Online buchen: Der Einlass ist so garantiert.
- Das Abend- oder Moonlight-Ticket prüfen, wenn ihr später kommen könnt: Es ist günstiger.
- Wechselkleidung, Handtücher und Verpflegung einplanen.
- Parkplatz-Tickets für den Besucherparkplatz Rulantica vorab buchen.

### Öffnungszeiten

Laut Seite ist Rulantica von 9:30 bis 22 Uhr geöffnet; das Tagesticket gilt in dieser Zeit.

### Gibt es einen Bereich für Kleinkinder?
Ja, laut Seite gibt es Attraktionen für Familien und Kleinkinder im Bereich Trølldal.

### Muss ich online buchen?
Nicht vorgeschrieben, aber empfohlen: Mit Online-Ticket ist der Einlass garantiert.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'erlebnisbaeder'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'baden-wuerttemberg'), 'Rust', 240, 420, true, false, true, null, null, null, false, false, false, date '2026-10-28', 'https://www.europapark.de/de/rulantica', 'Rulantica Rust mit Kindern: Preise & Tipps', 'Rulantica in Rust mit mehreren Kindern: Tagesticket 38 bis 54 €, Altersgruppen, Bereich für Kleinkinder und Tipps für Großfamilien bei jedem Wetter.', 77, array['Wetterunabhängig, weil drinnen', 'Bereich für Kleinkinder (Trølldal)', 'Online-Tickets garantieren den Einlass'], array['Preise je nach Tag 38 bis 54 € für das Tagesticket', 'Tageskasse nur nach Verfügbarkeit und mit Aufpreis'], 'draft', false),
  ('Badeparadies Schwarzwald (Titisee-Neustadt)', 'badeparadies-schwarzwald-titisee-neustadt', 'Erlebnisbad im Schwarzwald mit Rutschenwelt Galaxy und Palmenoase – Familientage am Wochenende, Online-Ticket empfohlen.', 'Das Badeparadies Schwarzwald liegt in Titisee-Neustadt (Am Badeparadies 1). Es ist ein Erlebnisbad mit mehreren Bereichen, darunter die Rutschenwelt Galaxy, die Palmenoase und das Palais Vital.

### Für wen passt das Badeparadies?

Für Familien, die einen Tag im Warmen verbringen wollen. Wichtig bei Kindern: Nicht alle Bereiche sind für alle Altersgruppen gedacht. Die Palmenoase ist laut Seite ab 16 Jahren (Kinder bis einschließlich 3 Jahre frei), das Palais Vital ab 16 Jahren textilfrei. An Familientagen (samstags und sonntags in der Palmenoase) gibt es keine Altersbeschränkung.

### Preise und Tickets

Preise nennt die Startseite nicht, sie wirbt aber mit einem Bestpreis beim Online-Ticket. Die Online-Buchung wird empfohlen, um den Eintritt zu garantieren. Für Massagen ist ein gültiges Online-Ticket für den Besuchstag erforderlich.

### Tipps für Familien mit 3 oder mehr Kindern

- Vor dem Besuch klären, welche Bereiche für eure Kinder zugänglich sind.
- An Wochenenden den Familientag in der Palmenoase nutzen.
- Online-Ticket buchen und Preise für alle Altersstufen vergleichen.
- Wechselkleidung, Handtücher und Verpflegung einplanen.

### Öffnungszeiten

Die Startseite nennt keine Zeiten, sondern verweist auf eine eigene Seite. Bitte vor dem Besuch prüfen.

### Dürfen kleine Kinder in die Palmenoase?
Laut Seite ist die Palmenoase ab 16 Jahren, Kinder bis einschließlich 3 Jahre sind frei; an Familientagen gibt es keine Altersbeschränkung.

### Gibt es Gastronomie?
Ja, laut Seite eine Poolbar und ein Restaurant in der Palmenoase.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'erlebnisbaeder'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'baden-wuerttemberg'), 'Titisee-Neustadt', 240, 480, true, false, true, null, null, null, false, false, false, null, 'https://www.badeparadies-schwarzwald.de', 'Badeparadies Schwarzwald: Infos für Familien', 'Badeparadies Schwarzwald mit Kindern: Familientag am Wochenende, Bereiche mit Altersgrenzen, Kinder bis 3 Jahre frei in Galaxy und Palmenoase und Tipps für Familien.', 72, array['Kleinkinder bis einschließlich 3 Jahre haben in Galaxy und Palmenoase freien Eintritt', 'Samstags und sonntags Familientag in der Palmenoase ohne Altersbeschränkung'], array['Palmenoase und Palais Vital sind erst ab 16 Jahren (Palais Vital textilfrei)', 'Eintrittspreise stehen nicht auf der Startseite'], 'draft', false),
  ('Miniatur Wunderland (Hamburg)', 'miniatur-wunderland-hamburg', 'Modelleisenbahn-Welt in der Hamburger Speicherstadt mit zwölf gebauten Welten – meist gut besucht, früh oder spät kommen.', 'Das Miniatur Wunderland liegt in der Hamburger Speicherstadt (Kehrwieder 2, Block D) und zeigt auf etwa 1.694 m² zwölf gebaute Welten, zuletzt wurde im April 2024 Monaco eröffnet. Weitere sind bis 2028 geplant.

### Für wen passt das Miniatur Wunderland?

Für Familien mit Kindern, die gerne schauen und entdecken: Es gibt unzählig Details, Züge und Szenen. Weil alles drinnen stattfindet, ist es ein Ziel bei jedem Wetter.

### Preise und Tickets

Standardpreise für Erwachsene und Kinder, ein Familienticket und Hinweise zu Zeitfenstern nennt die Startseite nicht. Wir tragen deshalb bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten. Die Seite nennt Gruppenangebote ab 15 Personen und Sonderveranstaltungen wie „Nachts im Wunderland“.

### Tipps für Familien mit 3 oder mehr Kindern

- Tickets und Zeitfenster vor dem Besuch prüfen.
- Früh morgens oder spät abends kommen: Laut Seite ist der Besuch oft stark besucht, an vollen Tagen bleibt das Wunderland bis 1 Uhr geöffnet.
- Pausen einplanen: Ein Besuch ist für die Jüngsten anstrengend.
- Treffpunkte vereinbaren, falls ihr euch im Gedränge verliert.

### Öffnungszeiten

Haben wir nicht belegt, die Startseite verweist auf eine eigene Seite. Bei großem Andrang kann das Wunderland laut Seite bis 1 Uhr nachts geöffnet bleiben.

### Wann ist es leerer?
Laut Seite sind früher Morgen und später Abend ruhiger.

### Gibt es Sonderveranstaltungen?
Ja, zum Beispiel „Nachts im Wunderland“ und eine Hafenrundfahrt mit Besuch („Große Pötte & kleine Züge“).

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'museen-erlebniswelten'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'hamburg'), 'Hamburg', 120, 240, true, false, true, null, null, null, false, false, false, null, 'https://www.miniatur-wunderland.de', 'Miniatur Wunderland Hamburg mit Kindern: Tipps', 'Miniatur Wunderland Hamburg mit mehreren Kindern: zwölf Welten in der Speicherstadt, wann es leerer ist und was ihr zu Tickets und Preisen vorab prüfen solltet.', 70, array['Bei jedem Wetter möglich, weil drinnen', 'Lange Öffnungszeiten an starken Tagen (laut Seite bis 1 Uhr)'], array['Meist gut besucht, früh morgens oder spät abends ist es ruhiger', 'Eintrittspreise stehen nicht auf der Startseite'], 'draft', false),
  ('phaeno (Wolfsburg)', 'phaeno-wolfsburg', 'Science Center in Wolfsburg zum Experimentieren für Jung und Alt – bei jedem Wetter, mit Bistro und Familientarifen.', 'Das phaeno in Wolfsburg ist ein Science Center, das die Seite als Ort „für Jung & Alt“ beschreibt. Es richtet sich an Familien, Schulen, Kitas und Gruppen. Experimentieren steht im Mittelpunkt.

### Für wen passt das phaeno?

Für Familien mit Kindern, die gerne ausprobieren und forschen. Weil das Angebot drinnen stattfindet, ist es unabhängig vom Wetter. Ein empfohlenes Alter nennt die Seite nicht.

### Preise und Tickets

Die Startseite nennt keine Eintrittspreise und verweist auf „Tickets & Preise“. Erwähnt werden „Gruppen- und Familien-Tarife“ sowie ein Ticketshop. Wir tragen deshalb bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten.

### Tipps für Familien mit 3 oder mehr Kindern

- Auf der Seite „Tickets & Preise“ die Familientarife prüfen: Wie viele Kinder sind enthalten?
- Mit den Kindern vorher überlegen, was sie ausprobieren wollen.
- Das Bistro für eine Pause nutzen.
- Pausen einplanen: Experimentieren ist anstrengend.

### Öffnungszeiten

Haben wir nicht belegt, die Startseite verweist auf eine eigene Seite.

### Gibt es Familientarife?
Ja, die Startseite erwähnt Gruppen- und Familien-Tarife; die Bedingungen stehen auf der Seite „Tickets & Preise“.

### Gibt es Gastronomie?
Ja, das „Charlys BISTRO“.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'museen-erlebniswelten'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'niedersachsen'), 'Wolfsburg', 180, 300, true, false, true, null, null, null, true, false, false, null, 'https://www.phaeno.de', 'phaeno Wolfsburg mit Kindern: Tipps', 'phaeno in Wolfsburg mit mehreren Kindern: Science Center zum Experimentieren für Jung und Alt, Familientarife, Bistro – was ihr zu Preisen vorab prüfen solltet.', 79, array['Bei jedem Wetter, weil drinnen', 'Familien- und Gruppentarife werden genannt', 'Bistro im Haus (Charlys BISTRO)'], array['Preise und Öffnungszeiten stehen nicht auf der Startseite', 'Empfohlenes Alter nennt die Seite nicht'], 'draft', false),
  ('Autostadt (Wolfsburg)', 'autostadt-wolfsburg', 'Erlebniswelt in Wolfsburg (Stadtbrücke) mit Kids-Touren, House of Gaming und Spielgeräten im Freien.', 'Die Autostadt liegt in Wolfsburg an der Stadtbrücke (38440 Wolfsburg) und ist eine Erlebniswelt rund um das Thema Auto. Zu den Bereichen gehören die Autotürme, die California Welt, Fahrerlebnisse und Markenpavillons.

### Für wen passt die Autostadt?

Für Familien mit Kindern, die Fahrzeuge, Technik und Spielen verbinden möchten. Die Seite bewirbt „Kids Touren“, das House of Gaming und Spielgeräte im Freien.

### Preise und Tickets

Die Startseite nennt keine Eintrittspreise und keine Öffnungszeiten, sie verlinkt auf einen Ticketshop (über Regiondo) und nennt eine Jahreskarte („Autostadt Key“). Wir tragen deshalb bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten. Zum Zeitpunkt der Recherche lief laut Startseite der „Winterzauber“ vom 4. bis 30. Dezember.

### Tipps für Familien mit 3 oder mehr Kindern

- Vorab im Ticketshop die Preise für alle Altersstufen und die Jahreskarte vergleichen.
- Das Kinderprogramm (Kids Touren) und Veranstaltungen im Kalender prüfen.
- Wetterfeste Kleidung einplanen, ein Teil des Angebots ist im Freien.
- Pausen und Verpflegung einplanen, es gibt Restaurants.

### Öffnungszeiten

Haben wir nicht belegt, die Startseite verweist auf eine eigene Seite.

### Gibt es Programm für Kinder?
Ja, die Startseite nennt Kids Touren, das House of Gaming und Spielgeräte im Freien.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'museen-erlebniswelten'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'niedersachsen'), 'Wolfsburg', 180, 360, true, true, false, null, null, null, false, false, false, null, 'https://www.autostadt.de', 'Autostadt Wolfsburg mit Kindern: Infos', 'Autostadt Wolfsburg mit mehreren Kindern: Kids-Touren, House of Gaming, Spielgeräte im Freien und Jahreskarte – was ihr zu Preisen vorab prüfen solltet.', 71, array['Kids-Touren und House of Gaming für Kinder', 'Spielgeräte im Freien'], array['Eintrittspreise und Öffnungszeiten stehen nicht auf der Startseite', 'Programm und Events wechseln'], 'draft', false),
  ('Universum Bremen', 'universum-bremen', 'Science Center in Bremen (Wiener Straße 1a) mit Familienpreis 42 € und Erwachsenenpreis 18 € – bei jedem Wetter.', 'Das Universum Bremen liegt an der Wiener Straße 1a in Bremen und ist ein Science Center. Für Familien ist es ein Ziel bei jedem Wetter.

### Für wen passt das Universum?

Für Familien mit Kindern im Schulalter, die gerne ausprobieren und forschen. Ein empfohlenes Alter nennt die Startseite nicht.

### Was kostet der Eintritt?

Laut Startseite kostet der Eintritt für Erwachsene 18,00 €, ermäßigt 12,00 €. Es gibt einen Familienpreis von 42,00 €. Kinderpreise, Altersgrenzen und ein Freialter nennt die Startseite nicht, ebenso wenig, wie viele Personen der Familienpreis abdeckt. Das müsst ihr beim Anbieter klären, besonders wenn ihr mit drei oder mehr Kindern kommt.

### Tipps für Familien mit 3 oder mehr Kindern

- Beim Anbieter klären, welche Familienzusammensetzung der Familienpreis abdeckt.
- Online buchen ist möglich, eine Pflicht nennt die Seite nicht.
- Mit den Kindern vorher überlegen, was sie ausprobieren wollen.
- Restaurant und Café für eine Pause nutzen.

### Öffnungszeiten

Montag bis Freitag 9 bis 18 Uhr, Samstag, Sonntag und an Feiertagen 10 bis 18 Uhr.

### Gibt es einen Familienpreis?
Ja, laut Startseite 42,00 €; für wen genau er gilt, steht dort nicht.

### Muss ich online buchen?
Nein, die Seite nennt eine Online-Buchung als Möglichkeit, aber keine Pflicht.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'museen-erlebniswelten'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'bremen'), 'Bremen', 180, 300, true, false, true, 18.00, null, null, true, false, false, date '2026-10-28', 'https://www.universum-bremen.de', 'Universum Bremen mit Kindern: Preise & Tipps', 'Universum Bremen mit mehreren Kindern: Erwachsene 18 €, Familienpreis 42 €, Öffnungszeiten und Tipps für Großfamilien – ein Science Center bei jedem Wetter.', 83, array['Familienpreis 42 € (Stand 28.10.2026)', 'Bei jedem Wetter, weil drinnen', 'Restaurant und Café im Haus'], array['Kinderpreise und Altersgrenzen stehen nicht auf der Startseite', 'Wie viele Personen der Familienpreis abdeckt, bitte beim Anbieter prüfen'], 'draft', false),
  ('Deutsches Museum (München)', 'deutsches-museum-muenchen', 'Technik- und Naturwissenschaftsmuseum auf der Münchner Museumsinsel, täglich 9 bis 17 Uhr geöffnet, mit eigenem Kinderreich.', 'Das Deutsche Museum liegt auf der Museumsinsel 1 in München und ist ein Museum für Naturwissenschaft und Technik. Auf der Startseite wird ein „Kinderreich“ als eigene Ausstellung genannt.

### Für wen passt das Deutsche Museum?

Für Familien mit neugierigen Kindern. Weil das Museum sehr groß ist, lohnt es sich, vorher ein oder zwei Bereiche auszuwählen. Für die Jüngeren gibt es das Kinderreich; ein empfohlenes Alter nennt die Seite nicht.

### Preise und Tickets

Die Startseite nennt keine Eintrittspreise, Kinderpreise oder Familientarife und verweist auf „Preise und Tickets“. Ein Ticketshop ist verlinkt, eine Pflicht nennt die Seite nicht. Wir tragen deshalb bewusst keine Preise ein, die wir nicht auf der offiziellen Seite belegen konnten.

### Tipps für Familien mit 3 oder mehr Kindern

- Preise für alle Altersstufen und Familientarife auf der Seite prüfen.
- Zwei bis drei Bereiche auswählen statt alles sehen zu wollen.
- Das Kinderreich für die Jüngeren einplanen.
- Pausen einplanen, im Haus gibt es Gastronomie.

### Öffnungszeiten

Laut Startseite täglich 9 bis 17 Uhr.

### Gibt es einen Bereich für Kinder?
Ja, die Startseite nennt das „Kinderreich“ als Ausstellung.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'museen-erlebniswelten'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'bayern'), 'München', 180, 360, true, false, true, null, null, null, false, false, false, null, 'https://www.deutsches-museum.de', 'Deutsches Museum München mit Kindern: Tipps', 'Deutsches Museum München mit mehreren Kindern: täglich 9 bis 17 Uhr geöffnet, Kinderreich und Tipps für Familien – was ihr zu Preisen vorab prüfen solltet.', 72, array['Täglich von 9 bis 17 Uhr geöffnet', 'Eigenes Kinderreich in der Ausstellung'], array['Eintrittspreise und Familienpreise stehen nicht auf der Startseite', 'Ein großes Museum, ein Tag reicht kaum für alles'], 'draft', false),
  ('Ozeaneum Stralsund', 'ozeaneum-stralsund', 'Meeresmuseum und Aquarium in der Hansestadt Stralsund an der Ostsee – bei jedem Wetter möglich.', 'Das Ozeaneum liegt in der Hansestadt Stralsund an der Ostsee und ist ein Meeresmuseum mit Aquarien. Für Familien im Urlaub an der Ostsee ist es ein Ziel bei Regen und kühlem Wetter.

### Für wen passt das Ozeaneum?

Für Familien mit Kindern, die sich für Meerestiere interessieren. Weil das Angebot drinnen stattfindet, ist der Besuch unabhängig vom Wetter.

### Preise und Öffnungszeiten

Wir konnten die Preis- und Öffnungszeitenseite des Ozeaneums bei der Recherche nicht auswerten und tragen deshalb keine Preise oder Zeiten ein. Bitte prüft vor dem Besuch auf der Seite des Ozeaneums, was Erwachsene und Kinder kosten, ab welchem Alter Kinder frei sind und ob es Familienkarten gibt.

### Tipps für Familien mit 3 oder mehr Kindern

- Vorab Preise für alle Altersgruppen und Familienangebote vergleichen.
- Mit den Kindern vorher Lieblingstiere aussuchen und eine kleine Route planen.
- Pausen einplanen.

### Öffnungszeiten

Haben wir nicht belegt. Bitte beim Anbieter nachsehen.

### Ist das Ozeaneum bei Regen sinnvoll?
Ja, es ist ein Ziel in Räumen, unabhängig vom Wetter.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'museen-erlebniswelten'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'mecklenburg-vorpommern'), 'Stralsund', 120, 240, true, false, true, null, null, null, false, false, false, null, 'https://www.ozeaneum.de', 'Ozeaneum Stralsund mit Kindern: Infos', 'Ozeaneum Stralsund mit mehreren Kindern: Meeresmuseum und Aquarium an der Ostsee, Tipps für Familien und was ihr zu Preisen und Öffnungszeiten vorab prüfen solltet.', 73, array['Bei jedem Wetter, weil drinnen'], array['Preise und Öffnungszeiten haben wir nicht belegt, bitte auf der Seite des Ozeaneums prüfen'], 'draft', false),
  ('Baumwipfelpfad Bad Harzburg', 'baumwipfelpfad-bad-harzburg', 'Baumwipfelpfad im Harz bei Bad Harzburg – Erwachsene 10 €, Kinder 4 bis 14 Jahre 8,50 €, bis 3 Jahre frei, kinderwagenfreundlich.', 'Der Baumwipfelpfad Bad Harzburg liegt im Harz am BurgBergCenter bei der Burgberg-Seilbahn (Nordhäuser Str. 4). Auf einem Pfad in den Baumwipfeln erlebt ihr den Wald aus einer anderen Perspektive.

### Für wen passt der Baumwipfelpfad?

Für Familien mit Kindern jeden Alters: Der Pfad ist laut Betreiber barrierearm und lässt sich mit Kinderwagen, Rollstuhl und Rollator nutzen. Das macht ihn auch für Familien mit einem Baby oder einem Großelternteil im Rollstuhl geeignet.

### Was kostet der Eintritt für eine große Familie?

Laut Betreiber (Stand 28.10.2026): Erwachsene 10,00 €, Kinder von 4 bis 14 Jahren 8,50 €, Kinder bis 3 Jahre frei, Senioren ab 65 Jahren 9,50 €. Das Familienticket kostet 26,00 € für 2 Erwachsene und 1 Kind. Ein Rechenbeispiel: Zwei Erwachsene und drei Kinder zwischen 4 und 14 Jahren zahlen mit den Einzelpreisen 45,50 € (2 × 10 € + 3 × 8,50 €). Bei mehreren Kindern lohnen deshalb die Einzelpreise, weil das Familienticket nur ein Kind enthält. Ein Online-Ticket ist nicht zwingend, Tickets gibt es im BurgBergCenter (Nordhäuser Str. 2c).

### Tipps für Familien mit 3 oder mehr Kindern

- Mit Kinderwagen ist der Pfad nutzbar.
- Zeit für den Weg zum Eingang und die Seilbahn einplanen, wenn ihr sie nutzt.
- Bei Regen oder Wind den Betreiber nach der aktuellen Lage fragen: Wetterbedingte Änderungen sind möglich.
- Wer über den hinteren Eingang kommt, braucht ein vorher am BurgBergCenter gekauftes Ticket.

### Öffnungszeiten

01.01. bis 20.03.: 10 bis 16 Uhr. 21.03. bis 30.06.: 9:30 bis 18 Uhr. 01.07. bis 31.08.: 9:30 bis 19 Uhr. 01.09. bis 01.11.: 9:30 bis 18 Uhr. 02.11. bis 31.12.: 10 bis 16 Uhr. Letzter Einlass jeweils eine Stunde vor Schließung.

### Wo kann ich parken?
Laut Betreiber gibt es Parkplätze in der Nordhäuser Str. 4 und in der Nordhäuser Str. 12.

### Muss ich online buchen?
Nein, Tickets gibt es online oder vor Ort.

Alle Angaben stammen von den offiziellen Seiten der Anbieter (Stand 28.10.2026) und können sich ändern. Aktuelle Preise, Öffnungszeiten und Bedingungen findet ihr vor dem Besuch beim Anbieter.', (select id from categories where content_type = 'activity' and slug = 'natur-abenteuer'), (select id from countries where code = 'DE'), (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'niedersachsen'), 'Bad Harzburg', 60, 120, false, true, false, 10.00, 8.50, 45.50, true, false, false, date '2026-10-28', 'https://harzventure.de/baumwipfelpfad', 'Baumwipfelpfad Bad Harzburg mit Kindern', 'Baumwipfelpfad Bad Harzburg mit mehreren Kindern: Erwachsene 10 €, Kinder 4–14 Jahre 8,50 €, Familienticket 26 € – Rechenbeispiel, Öffnungszeiten und Tipps.', 79, array['Kinder bis 3 Jahre haben freien Eintritt', 'Der Pfad ist barrierearm und für Kinderwagen, Rollstuhl und Rollator nutzbar', 'Günstig: Erwachsene 10 €, Kinder 4–14 Jahre 8,50 €'], array['Das Familienticket (26 €) gilt für 2 Erwachsene und 1 Kind, bei mehr Kindern lohnen die Einzelpreise', 'Wetterbedingte Änderungen der Öffnungszeiten sind möglich'], 'draft', false)
on conflict (slug) do nothing;

-- Verknüpfungen: Merkmale, Altersgruppen, Tags (idempotent)
insert into activity_feature_links (activity_id, feature_id)
select a.id, f.id
from (values
    ('movie-park-germany-bottrop', 'parkplatz'),
    ('movie-park-germany-bottrop', 'gastronomie-vor-ort'),
    ('movie-park-germany-bottrop', 'kinderwagengeeignet-activity'),
    ('ravensburger-spieleland-meckenbeuren', 'parkplatz'),
    ('ravensburger-spieleland-meckenbeuren', 'gastronomie-vor-ort'),
    ('ravensburger-spieleland-meckenbeuren', 'kinderwagengeeignet-activity'),
    ('playmobil-funpark-zirndorf', 'parkplatz'),
    ('playmobil-funpark-zirndorf', 'gastronomie-vor-ort'),
    ('playmobil-funpark-zirndorf', 'kinderwagengeeignet-activity'),
    ('playmobil-funpark-zirndorf', 'buchung-erforderlich'),
    ('erlebnispark-tripsdrill-cleebronn', 'parkplatz'),
    ('erlebnispark-tripsdrill-cleebronn', 'gastronomie-vor-ort'),
    ('erlebnispark-tripsdrill-cleebronn', 'kinderwagengeeignet-activity'),
    ('fort-fun-abenteuerland-bestwig', 'parkplatz'),
    ('fort-fun-abenteuerland-bestwig', 'gastronomie-vor-ort'),
    ('fort-fun-abenteuerland-bestwig', 'kinderwagengeeignet-activity'),
    ('zoo-leipzig', 'parkplatz'),
    ('zoo-leipzig', 'gastronomie-vor-ort'),
    ('zoo-leipzig', 'kinderwagengeeignet-activity'),
    ('zoo-berlin', 'gastronomie-vor-ort'),
    ('zoo-berlin', 'kinderwagengeeignet-activity'),
    ('wilhelma-stuttgart', 'parkplatz'),
    ('wilhelma-stuttgart', 'gastronomie-vor-ort'),
    ('wilhelma-stuttgart', 'kinderwagengeeignet-activity'),
    ('zoo-osnabrueck', 'parkplatz'),
    ('zoo-osnabrueck', 'gastronomie-vor-ort'),
    ('zoo-osnabrueck', 'kinderwagengeeignet-activity'),
    ('zoom-erlebniswelt-gelsenkirchen', 'parkplatz'),
    ('zoom-erlebniswelt-gelsenkirchen', 'gastronomie-vor-ort'),
    ('zoom-erlebniswelt-gelsenkirchen', 'kinderwagengeeignet-activity'),
    ('allwetterzoo-muenster', 'parkplatz'),
    ('allwetterzoo-muenster', 'gastronomie-vor-ort'),
    ('allwetterzoo-muenster', 'kinderwagengeeignet-activity'),
    ('rulantica-rust', 'parkplatz'),
    ('rulantica-rust', 'gastronomie-vor-ort'),
    ('badeparadies-schwarzwald-titisee-neustadt', 'parkplatz'),
    ('badeparadies-schwarzwald-titisee-neustadt', 'gastronomie-vor-ort'),
    ('miniatur-wunderland-hamburg', 'gastronomie-vor-ort'),
    ('miniatur-wunderland-hamburg', 'kinderwagengeeignet-activity'),
    ('phaeno-wolfsburg', 'gastronomie-vor-ort'),
    ('phaeno-wolfsburg', 'kinderwagengeeignet-activity'),
    ('autostadt-wolfsburg', 'parkplatz'),
    ('autostadt-wolfsburg', 'gastronomie-vor-ort'),
    ('autostadt-wolfsburg', 'kinderwagengeeignet-activity'),
    ('universum-bremen', 'parkplatz'),
    ('universum-bremen', 'gastronomie-vor-ort'),
    ('universum-bremen', 'kinderwagengeeignet-activity'),
    ('deutsches-museum-muenchen', 'gastronomie-vor-ort'),
    ('deutsches-museum-muenchen', 'kinderwagengeeignet-activity'),
    ('ozeaneum-stralsund', 'gastronomie-vor-ort'),
    ('baumwipfelpfad-bad-harzburg', 'parkplatz'),
    ('baumwipfelpfad-bad-harzburg', 'barrierefrei'),
    ('baumwipfelpfad-bad-harzburg', 'kinderwagengeeignet-activity')
  ) as v(slug, feature)
  join activities a on a.slug = v.slug
  join activity_features f on f.slug = v.feature
on conflict do nothing;

insert into content_age_groups (content_type, content_id, age_group_id)
select 'activity', a.id, g.id
from (values
    ('movie-park-germany-bottrop', '2-3 Jahre'),
    ('movie-park-germany-bottrop', '4-5 Jahre'),
    ('movie-park-germany-bottrop', '6-9 Jahre'),
    ('movie-park-germany-bottrop', '10-13 Jahre'),
    ('movie-park-germany-bottrop', '14-17 Jahre'),
    ('ravensburger-spieleland-meckenbeuren', '2-3 Jahre'),
    ('ravensburger-spieleland-meckenbeuren', '4-5 Jahre'),
    ('ravensburger-spieleland-meckenbeuren', '6-9 Jahre'),
    ('ravensburger-spieleland-meckenbeuren', '10-13 Jahre'),
    ('playmobil-funpark-zirndorf', '2-3 Jahre'),
    ('playmobil-funpark-zirndorf', '4-5 Jahre'),
    ('playmobil-funpark-zirndorf', '6-9 Jahre'),
    ('playmobil-funpark-zirndorf', '10-13 Jahre'),
    ('erlebnispark-tripsdrill-cleebronn', '2-3 Jahre'),
    ('erlebnispark-tripsdrill-cleebronn', '4-5 Jahre'),
    ('erlebnispark-tripsdrill-cleebronn', '6-9 Jahre'),
    ('erlebnispark-tripsdrill-cleebronn', '10-13 Jahre'),
    ('erlebnispark-tripsdrill-cleebronn', '14-17 Jahre'),
    ('fort-fun-abenteuerland-bestwig', '4-5 Jahre'),
    ('fort-fun-abenteuerland-bestwig', '6-9 Jahre'),
    ('fort-fun-abenteuerland-bestwig', '10-13 Jahre'),
    ('fort-fun-abenteuerland-bestwig', '14-17 Jahre'),
    ('zoo-leipzig', '0-1 Jahre'),
    ('zoo-leipzig', '2-3 Jahre'),
    ('zoo-leipzig', '4-5 Jahre'),
    ('zoo-leipzig', '6-9 Jahre'),
    ('zoo-leipzig', '10-13 Jahre'),
    ('zoo-leipzig', '14-17 Jahre'),
    ('zoo-berlin', '0-1 Jahre'),
    ('zoo-berlin', '2-3 Jahre'),
    ('zoo-berlin', '4-5 Jahre'),
    ('zoo-berlin', '6-9 Jahre'),
    ('zoo-berlin', '10-13 Jahre'),
    ('zoo-berlin', '14-17 Jahre'),
    ('wilhelma-stuttgart', '0-1 Jahre'),
    ('wilhelma-stuttgart', '2-3 Jahre'),
    ('wilhelma-stuttgart', '4-5 Jahre'),
    ('wilhelma-stuttgart', '6-9 Jahre'),
    ('wilhelma-stuttgart', '10-13 Jahre'),
    ('wilhelma-stuttgart', '14-17 Jahre'),
    ('zoo-osnabrueck', '0-1 Jahre'),
    ('zoo-osnabrueck', '2-3 Jahre'),
    ('zoo-osnabrueck', '4-5 Jahre'),
    ('zoo-osnabrueck', '6-9 Jahre'),
    ('zoo-osnabrueck', '10-13 Jahre'),
    ('zoo-osnabrueck', '14-17 Jahre'),
    ('zoom-erlebniswelt-gelsenkirchen', '0-1 Jahre'),
    ('zoom-erlebniswelt-gelsenkirchen', '2-3 Jahre'),
    ('zoom-erlebniswelt-gelsenkirchen', '4-5 Jahre'),
    ('zoom-erlebniswelt-gelsenkirchen', '6-9 Jahre'),
    ('zoom-erlebniswelt-gelsenkirchen', '10-13 Jahre'),
    ('zoom-erlebniswelt-gelsenkirchen', '14-17 Jahre'),
    ('allwetterzoo-muenster', '0-1 Jahre'),
    ('allwetterzoo-muenster', '2-3 Jahre'),
    ('allwetterzoo-muenster', '4-5 Jahre'),
    ('allwetterzoo-muenster', '6-9 Jahre'),
    ('allwetterzoo-muenster', '10-13 Jahre'),
    ('allwetterzoo-muenster', '14-17 Jahre'),
    ('rulantica-rust', '0-1 Jahre'),
    ('rulantica-rust', '2-3 Jahre'),
    ('rulantica-rust', '4-5 Jahre'),
    ('rulantica-rust', '6-9 Jahre'),
    ('rulantica-rust', '10-13 Jahre'),
    ('rulantica-rust', '14-17 Jahre'),
    ('badeparadies-schwarzwald-titisee-neustadt', '0-1 Jahre'),
    ('badeparadies-schwarzwald-titisee-neustadt', '2-3 Jahre'),
    ('badeparadies-schwarzwald-titisee-neustadt', '4-5 Jahre'),
    ('badeparadies-schwarzwald-titisee-neustadt', '6-9 Jahre'),
    ('badeparadies-schwarzwald-titisee-neustadt', '10-13 Jahre'),
    ('badeparadies-schwarzwald-titisee-neustadt', '14-17 Jahre'),
    ('miniatur-wunderland-hamburg', '4-5 Jahre'),
    ('miniatur-wunderland-hamburg', '6-9 Jahre'),
    ('miniatur-wunderland-hamburg', '10-13 Jahre'),
    ('miniatur-wunderland-hamburg', '14-17 Jahre'),
    ('phaeno-wolfsburg', '4-5 Jahre'),
    ('phaeno-wolfsburg', '6-9 Jahre'),
    ('phaeno-wolfsburg', '10-13 Jahre'),
    ('phaeno-wolfsburg', '14-17 Jahre'),
    ('autostadt-wolfsburg', '4-5 Jahre'),
    ('autostadt-wolfsburg', '6-9 Jahre'),
    ('autostadt-wolfsburg', '10-13 Jahre'),
    ('autostadt-wolfsburg', '14-17 Jahre'),
    ('universum-bremen', '4-5 Jahre'),
    ('universum-bremen', '6-9 Jahre'),
    ('universum-bremen', '10-13 Jahre'),
    ('universum-bremen', '14-17 Jahre'),
    ('deutsches-museum-muenchen', '4-5 Jahre'),
    ('deutsches-museum-muenchen', '6-9 Jahre'),
    ('deutsches-museum-muenchen', '10-13 Jahre'),
    ('deutsches-museum-muenchen', '14-17 Jahre'),
    ('ozeaneum-stralsund', '2-3 Jahre'),
    ('ozeaneum-stralsund', '4-5 Jahre'),
    ('ozeaneum-stralsund', '6-9 Jahre'),
    ('ozeaneum-stralsund', '10-13 Jahre'),
    ('ozeaneum-stralsund', '14-17 Jahre'),
    ('baumwipfelpfad-bad-harzburg', '2-3 Jahre'),
    ('baumwipfelpfad-bad-harzburg', '4-5 Jahre'),
    ('baumwipfelpfad-bad-harzburg', '6-9 Jahre'),
    ('baumwipfelpfad-bad-harzburg', '10-13 Jahre'),
    ('baumwipfelpfad-bad-harzburg', '14-17 Jahre')
  ) as v(slug, age)
  join activities a on a.slug = v.slug
  join age_groups g on g.name = v.age
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id)
select 'activity', a.id, t.id
from (values
    ('movie-park-germany-bottrop', 'familienfreundlich'),
    ('movie-park-germany-bottrop', 'outdoor'),
    ('ravensburger-spieleland-meckenbeuren', 'familienfreundlich'),
    ('ravensburger-spieleland-meckenbeuren', 'outdoor'),
    ('playmobil-funpark-zirndorf', 'familienfreundlich'),
    ('playmobil-funpark-zirndorf', 'outdoor'),
    ('erlebnispark-tripsdrill-cleebronn', 'familienfreundlich'),
    ('erlebnispark-tripsdrill-cleebronn', 'outdoor'),
    ('fort-fun-abenteuerland-bestwig', 'familienfreundlich'),
    ('fort-fun-abenteuerland-bestwig', 'outdoor'),
    ('zoo-leipzig', 'familienfreundlich'),
    ('zoo-leipzig', 'outdoor'),
    ('zoo-berlin', 'familienfreundlich'),
    ('zoo-berlin', 'outdoor'),
    ('wilhelma-stuttgart', 'familienfreundlich'),
    ('wilhelma-stuttgart', 'outdoor'),
    ('zoo-osnabrueck', 'familienfreundlich'),
    ('zoo-osnabrueck', 'outdoor'),
    ('zoom-erlebniswelt-gelsenkirchen', 'familienfreundlich'),
    ('zoom-erlebniswelt-gelsenkirchen', 'outdoor'),
    ('allwetterzoo-muenster', 'familienfreundlich'),
    ('allwetterzoo-muenster', 'schlechtwetter-geeignet'),
    ('allwetterzoo-muenster', 'outdoor'),
    ('rulantica-rust', 'familienfreundlich'),
    ('rulantica-rust', 'grossfamilie'),
    ('rulantica-rust', 'schlechtwetter-geeignet'),
    ('badeparadies-schwarzwald-titisee-neustadt', 'familienfreundlich'),
    ('badeparadies-schwarzwald-titisee-neustadt', 'schlechtwetter-geeignet'),
    ('miniatur-wunderland-hamburg', 'familienfreundlich'),
    ('miniatur-wunderland-hamburg', 'schlechtwetter-geeignet'),
    ('phaeno-wolfsburg', 'familienfreundlich'),
    ('phaeno-wolfsburg', 'grossfamilie'),
    ('phaeno-wolfsburg', 'schlechtwetter-geeignet'),
    ('autostadt-wolfsburg', 'familienfreundlich'),
    ('autostadt-wolfsburg', 'outdoor'),
    ('universum-bremen', 'familienfreundlich'),
    ('universum-bremen', 'grossfamilie'),
    ('universum-bremen', 'schlechtwetter-geeignet'),
    ('deutsches-museum-muenchen', 'familienfreundlich'),
    ('deutsches-museum-muenchen', 'schlechtwetter-geeignet'),
    ('ozeaneum-stralsund', 'familienfreundlich'),
    ('ozeaneum-stralsund', 'schlechtwetter-geeignet'),
    ('baumwipfelpfad-bad-harzburg', 'familienfreundlich'),
    ('baumwipfelpfad-bad-harzburg', 'grossfamilie'),
    ('baumwipfelpfad-bad-harzburg', 'outdoor'),
    ('baumwipfelpfad-bad-harzburg', 'budgetfreundlich')
  ) as v(slug, tag)
  join activities a on a.slug = v.slug
  join tags t on t.slug = v.tag
on conflict do nothing;
