-- FamVaya: Ergänzung der 10 Aktivitäten aus Batch 1 um die fehlenden Felder
-- (Region, Dauer, Wetter-Häkchen, Familienscore, Merkmale, Altersgruppen, Tags).
--
-- Voraussetzung: aktivitaeten-batch-1.sql ist ausgeführt. Idempotent. Der Familienscore
-- wird nur gesetzt, wo er noch leer ist (coalesce), nie überschrieben.
-- Korrektur gegenüber Batch 1: "Bei jedem Wetter geeignet" ist bei reinen
-- Outdoor-Zielen (Zoos, Freizeitparks) abgewählt.
-- Familienscore: Summe aus fünf Kriterien à 0-20, siehe aktivitaeten-batch-2.sql.

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

update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'baden-wuerttemberg'), duration_min = 420, duration_max = 600, indoor = false, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 67), booking_required = booking_required or false where slug = 'europa-park-rust';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'niedersachsen'), duration_min = 360, duration_max = 540, indoor = false, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 65), booking_required = booking_required or false where slug = 'heide-park-resort-soltau';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'nordrhein-westfalen'), duration_min = 360, duration_max = 540, indoor = false, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 62), booking_required = booking_required or true where slug = 'phantasialand-bruehl';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'bayern'), duration_min = 360, duration_max = 540, indoor = false, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 70), booking_required = booking_required or false where slug = 'legoland-deutschland-guenzburg';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'schleswig-holstein'), duration_min = 360, duration_max = 540, indoor = false, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 60), booking_required = booking_required or false where slug = 'hansa-park-sierksdorf';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'niedersachsen'), duration_min = 240, duration_max = 420, indoor = false, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 66), booking_required = booking_required or false where slug = 'serengeti-park-hodenhagen';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'niedersachsen'), duration_min = 240, duration_max = 420, indoor = false, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 67), booking_required = booking_required or false where slug = 'erlebnis-zoo-hannover';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'hamburg'), duration_min = 240, duration_max = 420, indoor = true, outdoor = true, weather_suitable = false, family_rating = coalesce(family_rating, 69), example_total_price = 115.00, booking_required = booking_required or false where slug = 'tierpark-hagenbeck-hamburg';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'brandenburg'), duration_min = 300, duration_max = 600, indoor = true, outdoor = false, weather_suitable = true, family_rating = coalesce(family_rating, 78), booking_required = booking_required or false where slug = 'tropical-islands-krausnick';
update activities set region_id = (select r.id from regions r join countries c on c.id = r.country_id where c.code = 'DE' and r.slug = 'bayern'), duration_min = 240, duration_max = 480, indoor = true, outdoor = false, weather_suitable = true, family_rating = coalesce(family_rating, 69), booking_required = booking_required or false where slug = 'therme-erding';

-- Verknüpfungen: Merkmale, Altersgruppen, Tags (idempotent)
insert into activity_feature_links (activity_id, feature_id)
select a.id, f.id
from (values
    ('europa-park-rust', 'parkplatz'),
    ('europa-park-rust', 'gastronomie-vor-ort'),
    ('europa-park-rust', 'kinderwagengeeignet-activity'),
    ('heide-park-resort-soltau', 'parkplatz'),
    ('heide-park-resort-soltau', 'gastronomie-vor-ort'),
    ('heide-park-resort-soltau', 'kinderwagengeeignet-activity'),
    ('phantasialand-bruehl', 'parkplatz'),
    ('phantasialand-bruehl', 'gastronomie-vor-ort'),
    ('phantasialand-bruehl', 'kinderwagengeeignet-activity'),
    ('phantasialand-bruehl', 'buchung-erforderlich'),
    ('legoland-deutschland-guenzburg', 'parkplatz'),
    ('legoland-deutschland-guenzburg', 'gastronomie-vor-ort'),
    ('legoland-deutschland-guenzburg', 'kinderwagengeeignet-activity'),
    ('hansa-park-sierksdorf', 'parkplatz'),
    ('hansa-park-sierksdorf', 'gastronomie-vor-ort'),
    ('hansa-park-sierksdorf', 'kinderwagengeeignet-activity'),
    ('serengeti-park-hodenhagen', 'parkplatz'),
    ('serengeti-park-hodenhagen', 'gastronomie-vor-ort'),
    ('serengeti-park-hodenhagen', 'kinderwagengeeignet-activity'),
    ('erlebnis-zoo-hannover', 'parkplatz'),
    ('erlebnis-zoo-hannover', 'gastronomie-vor-ort'),
    ('erlebnis-zoo-hannover', 'kinderwagengeeignet-activity'),
    ('tierpark-hagenbeck-hamburg', 'parkplatz'),
    ('tierpark-hagenbeck-hamburg', 'gastronomie-vor-ort'),
    ('tierpark-hagenbeck-hamburg', 'kinderwagengeeignet-activity'),
    ('tropical-islands-krausnick', 'parkplatz'),
    ('tropical-islands-krausnick', 'gastronomie-vor-ort'),
    ('therme-erding', 'parkplatz'),
    ('therme-erding', 'gastronomie-vor-ort')
  ) as v(slug, feature)
  join activities a on a.slug = v.slug
  join activity_features f on f.slug = v.feature
on conflict do nothing;

insert into content_age_groups (content_type, content_id, age_group_id)
select 'activity', a.id, g.id
from (values
    ('europa-park-rust', '2-3 Jahre'),
    ('europa-park-rust', '4-5 Jahre'),
    ('europa-park-rust', '6-9 Jahre'),
    ('europa-park-rust', '10-13 Jahre'),
    ('europa-park-rust', '14-17 Jahre'),
    ('heide-park-resort-soltau', '2-3 Jahre'),
    ('heide-park-resort-soltau', '4-5 Jahre'),
    ('heide-park-resort-soltau', '6-9 Jahre'),
    ('heide-park-resort-soltau', '10-13 Jahre'),
    ('heide-park-resort-soltau', '14-17 Jahre'),
    ('phantasialand-bruehl', '2-3 Jahre'),
    ('phantasialand-bruehl', '4-5 Jahre'),
    ('phantasialand-bruehl', '6-9 Jahre'),
    ('phantasialand-bruehl', '10-13 Jahre'),
    ('phantasialand-bruehl', '14-17 Jahre'),
    ('legoland-deutschland-guenzburg', '2-3 Jahre'),
    ('legoland-deutschland-guenzburg', '4-5 Jahre'),
    ('legoland-deutschland-guenzburg', '6-9 Jahre'),
    ('legoland-deutschland-guenzburg', '10-13 Jahre'),
    ('hansa-park-sierksdorf', '2-3 Jahre'),
    ('hansa-park-sierksdorf', '4-5 Jahre'),
    ('hansa-park-sierksdorf', '6-9 Jahre'),
    ('hansa-park-sierksdorf', '10-13 Jahre'),
    ('hansa-park-sierksdorf', '14-17 Jahre'),
    ('serengeti-park-hodenhagen', '0-1 Jahre'),
    ('serengeti-park-hodenhagen', '2-3 Jahre'),
    ('serengeti-park-hodenhagen', '4-5 Jahre'),
    ('serengeti-park-hodenhagen', '6-9 Jahre'),
    ('serengeti-park-hodenhagen', '10-13 Jahre'),
    ('serengeti-park-hodenhagen', '14-17 Jahre'),
    ('erlebnis-zoo-hannover', '0-1 Jahre'),
    ('erlebnis-zoo-hannover', '2-3 Jahre'),
    ('erlebnis-zoo-hannover', '4-5 Jahre'),
    ('erlebnis-zoo-hannover', '6-9 Jahre'),
    ('erlebnis-zoo-hannover', '10-13 Jahre'),
    ('erlebnis-zoo-hannover', '14-17 Jahre'),
    ('tierpark-hagenbeck-hamburg', '0-1 Jahre'),
    ('tierpark-hagenbeck-hamburg', '2-3 Jahre'),
    ('tierpark-hagenbeck-hamburg', '4-5 Jahre'),
    ('tierpark-hagenbeck-hamburg', '6-9 Jahre'),
    ('tierpark-hagenbeck-hamburg', '10-13 Jahre'),
    ('tierpark-hagenbeck-hamburg', '14-17 Jahre'),
    ('tropical-islands-krausnick', '0-1 Jahre'),
    ('tropical-islands-krausnick', '2-3 Jahre'),
    ('tropical-islands-krausnick', '4-5 Jahre'),
    ('tropical-islands-krausnick', '6-9 Jahre'),
    ('tropical-islands-krausnick', '10-13 Jahre'),
    ('tropical-islands-krausnick', '14-17 Jahre'),
    ('therme-erding', '2-3 Jahre'),
    ('therme-erding', '4-5 Jahre'),
    ('therme-erding', '6-9 Jahre'),
    ('therme-erding', '10-13 Jahre'),
    ('therme-erding', '14-17 Jahre')
  ) as v(slug, age)
  join activities a on a.slug = v.slug
  join age_groups g on g.name = v.age
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id)
select 'activity', a.id, t.id
from (values
    ('europa-park-rust', 'familienfreundlich'),
    ('europa-park-rust', 'outdoor'),
    ('heide-park-resort-soltau', 'familienfreundlich'),
    ('heide-park-resort-soltau', 'outdoor'),
    ('phantasialand-bruehl', 'familienfreundlich'),
    ('phantasialand-bruehl', 'outdoor'),
    ('legoland-deutschland-guenzburg', 'familienfreundlich'),
    ('legoland-deutschland-guenzburg', 'outdoor'),
    ('hansa-park-sierksdorf', 'familienfreundlich'),
    ('hansa-park-sierksdorf', 'outdoor'),
    ('serengeti-park-hodenhagen', 'familienfreundlich'),
    ('serengeti-park-hodenhagen', 'outdoor'),
    ('erlebnis-zoo-hannover', 'familienfreundlich'),
    ('erlebnis-zoo-hannover', 'outdoor'),
    ('tierpark-hagenbeck-hamburg', 'familienfreundlich'),
    ('tierpark-hagenbeck-hamburg', 'outdoor'),
    ('tropical-islands-krausnick', 'familienfreundlich'),
    ('tropical-islands-krausnick', 'grossfamilie'),
    ('tropical-islands-krausnick', 'schlechtwetter-geeignet'),
    ('therme-erding', 'familienfreundlich'),
    ('therme-erding', 'schlechtwetter-geeignet')
  ) as v(slug, tag)
  join activities a on a.slug = v.slug
  join tags t on t.slug = v.tag
on conflict do nothing;
