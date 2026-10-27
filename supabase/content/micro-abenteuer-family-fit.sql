-- FamVaya: Family-Fit-Score für die 50 Mikro-Abenteuer aus Batch 1/2.
--
-- Methode (redaktionelle Einschätzung, siehe DECISIONS.md): Summe aus fünf
-- Kriterien à 0-20 Punkte:
--   1. Eignung für mehrere Kinder (Teams/Rollen, skaliert gut)
--   2. Altersmischung (jüngere und ältere Kinder gleichzeitig)
--   3. Einfachheit (wenig Vorbereitung und Kosten)
--   4. Wetter- und Jahreszeit-Flexibilität
--   5. Sicherheit / geringer Aufsichtsbedarf
-- Überschreibt NICHT: Einträge, die schon einen Score haben, bleiben unverändert.
-- Einzelne Scores können jederzeit im Admin angepasst werden.

update micro_adventures m
set family_rating = v.score
from (values
  ('spurensuche-im-wald', 84),
  ('blaetter-bestimmungsrallye', 82),
  ('tipi-aus-totholz-bauen', 72),
  ('barfusspfad-selbst-bauen', 72),
  ('krabbeltier-safari', 78),
  ('pilze-fotografieren', 65),
  ('geocaching-fuer-anfaenger', 67),
  ('blinde-karawane', 69),
  ('stockbrot-am-grillplatz', 64),
  ('nachtspaziergang-mit-taschenlampe', 70),
  ('klangkarte-erstellen', 80),
  ('steine-flitschen', 74),
  ('wasserrad-aus-naturmaterial', 66),
  ('mini-staudamm', 67),
  ('strandolympiade', 71),
  ('schwammbomben-schlacht', 73),
  ('eisskulpturen-im-frost', 66),
  ('schneeburg-bauwerkstatt', 73),
  ('schatzsuche-mit-selbstgemalter-karte', 75),
  ('familien-zeitkapsel', 80),
  ('naturfarben-herstellen', 71),
  ('schattentheater', 84),
  ('hoehlenbau-im-wohnzimmer', 91),
  ('pizza-duell', 76),
  ('mini-olympiade-im-garten', 80),
  ('papierflieger-wettbewerb', 87),
  ('familien-podcast', 83),
  ('lichtmalerei', 73),
  ('regenmesser-wetter-tagebuch', 71),
  ('wolken-detektive', 85),
  ('baumrinden-abdruecke', 85),
  ('waldbaden-mit-kindern', 84),
  ('flugsamen-experiment', 75),
  ('naturmandala-legen', 82),
  ('natur-bingo', 86),
  ('insektenhotel-bauen', 64),
  ('schwimmen-oder-sinken', 87),
  ('sandskulpturen-wettbewerb', 74),
  ('wasserstaffel-im-garten', 76),
  ('bachforscher', 58),
  ('familien-kochbuch', 78),
  ('detektivspiel-zuhause', 74),
  ('brettspiel-selber-bauen', 73),
  ('lesenacht-mit-taschenlampe', 90),
  ('stop-motion-film', 71),
  ('familienwappen-gestalten', 88),
  ('kuechenexperimente-fuer-kinder', 67),
  ('stadtrallye-im-eigenen-viertel', 63),
  ('kinderflohmarkt', 60),
  ('kresse-igel-ziehen', 87)
) as v(slug, score)
where m.slug = v.slug
  and m.family_rating is null;
