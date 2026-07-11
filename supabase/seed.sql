-- FamVaya Phase 0 — Seed-Daten (Demo-Inhalte)
--
-- Reduzierter Phase-0-Umfang (siehe FamVaya_Phase0_Prompt.md Punkt 6), NICHT
-- der volle Umfang aus Spec §29. Alle Titel sind mit "[Demo]" gekennzeichnet
-- und behaupten an keiner Stelle reale Verfügbarkeit oder Prüfung.
--
-- UUIDs sind deterministisch und nach Entity-Typ präfigiert, damit
-- Fremdschlüssel-Referenzen unten lesbar bleiben (siehe DECISIONS.md).
-- Format: <entity-prefix>-0000-0000-0000-<lfd. Nummer>
--   a0 countries   a1 regions   a2 accommodation_types  a3 categories
--   a4 tags        a5 amenities a6 activity_features    a7 age_groups
--   a8 providers   a9 accommodations  aa activities  ab micro_adventures
--   ac media
--
-- Kein Insert für users/family_profiles/favorites/reviews: die benötigen
-- echte auth.users-Zeilen, die es ohne einen laufenden Auth-Flow nicht gibt.

-- === Länder & Regionen ======================================================

insert into countries (id, name, code, slug) values
  ('a0000000-0000-0000-0000-000000000001', 'Deutschland', 'DE', 'deutschland'),
  ('a0000000-0000-0000-0000-000000000002', 'Österreich', 'AT', 'oesterreich')
on conflict (id) do nothing;

insert into regions (id, country_id, name, slug) values
  ('a1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Nordsee', 'nordsee'),
  ('a1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Bayern', 'bayern'),
  ('a1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Tirol', 'tirol'),
  ('a1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Salzburger Land', 'salzburger-land')
on conflict (id) do nothing;

-- === Unterkunftstypen ========================================================

insert into accommodation_types (id, name, slug, sort_order) values
  ('a2000000-0000-0000-0000-000000000001', 'Ferienhaus', 'ferienhaus', 1),
  ('a2000000-0000-0000-0000-000000000002', 'Familienhotel', 'familienhotel', 2),
  ('a2000000-0000-0000-0000-000000000003', 'Bauernhof', 'bauernhof', 3)
on conflict (id) do nothing;

-- === Kategorien ==============================================================
-- Hinweis: content_type='accommodation' wird in Phase 0 nicht befüllt, da
-- Unterkünfte über accommodation_type_id kategorisiert werden, nicht über
-- categories (siehe DECISIONS.md).

insert into categories (id, name, slug, content_type, sort_order) values
  ('a3000000-0000-0000-0000-000000000001', 'Freizeitparks', 'freizeitparks', 'activity', 1),
  ('a3000000-0000-0000-0000-000000000002', 'Zoos & Tierparks', 'zoos-tierparks', 'activity', 2),
  ('a3000000-0000-0000-0000-000000000003', 'Erlebnisbäder', 'erlebnisbaeder', 'activity', 3),
  ('a3000000-0000-0000-0000-000000000004', 'Natur & Wald', 'natur-wald', 'micro_adventure', 1),
  ('a3000000-0000-0000-0000-000000000005', 'Wasser & Strand', 'wasser-strand', 'micro_adventure', 2),
  ('a3000000-0000-0000-0000-000000000006', 'Kreativ & Entdecken', 'kreativ-entdecken', 'micro_adventure', 3),
  ('a3000000-0000-0000-0000-000000000007', 'Reiseziele', 'reiseziele', 'article', 1),
  ('a3000000-0000-0000-0000-000000000008', 'Großfamilien-Tipps', 'grossfamilien-tipps', 'article', 2),
  ('a3000000-0000-0000-0000-000000000009', 'Sparen', 'sparen', 'article', 3)
on conflict (id) do nothing;

-- === Tags ====================================================================

insert into tags (id, name, slug) values
  ('a4000000-0000-0000-0000-000000000001', 'Familienfreundlich', 'familienfreundlich'),
  ('a4000000-0000-0000-0000-000000000002', 'Großfamilie', 'grossfamilie'),
  ('a4000000-0000-0000-0000-000000000003', 'Schlechtwetter-geeignet', 'schlechtwetter-geeignet'),
  ('a4000000-0000-0000-0000-000000000004', 'Outdoor', 'outdoor'),
  ('a4000000-0000-0000-0000-000000000005', 'Budgetfreundlich', 'budgetfreundlich')
on conflict (id) do nothing;

-- === Ausstattungsmerkmale (Unterkünfte) =====================================

insert into amenities (id, name, slug, group_name) values
  ('a5000000-0000-0000-0000-000000000001', 'Küche', 'kueche', 'Küche'),
  ('a5000000-0000-0000-0000-000000000002', 'Waschmaschine', 'waschmaschine', 'Küche'),
  ('a5000000-0000-0000-0000-000000000003', 'Babybett', 'babybett', 'Kinder'),
  ('a5000000-0000-0000-0000-000000000004', 'Hochstuhl', 'hochstuhl', 'Kinder'),
  ('a5000000-0000-0000-0000-000000000005', 'Spielplatz', 'spielplatz', 'Freizeit'),
  ('a5000000-0000-0000-0000-000000000006', 'Kinderbetreuung', 'kinderbetreuung', 'Freizeit'),
  ('a5000000-0000-0000-0000-000000000007', 'Pool', 'pool', 'Freizeit'),
  ('a5000000-0000-0000-0000-000000000008', 'Eingezäuntes Grundstück', 'eingezaeuntes-grundstueck', 'Außenbereich'),
  ('a5000000-0000-0000-0000-000000000009', 'Kinderwagengeeignet', 'kinderwagengeeignet', 'Mobilität'),
  ('a5000000-0000-0000-0000-000000000010', 'Haustiere erlaubt', 'haustiere-erlaubt', 'Service')
on conflict (id) do nothing;

-- === Ausstattungsmerkmale (Aktivitäten) =====================================

insert into activity_features (id, name, slug, group_name) values
  ('a6000000-0000-0000-0000-000000000001', 'Parkplatz', 'parkplatz', 'Mobilität'),
  ('a6000000-0000-0000-0000-000000000002', 'Eigenes Essen erlaubt', 'eigenes-essen-erlaubt', 'Verpflegung'),
  ('a6000000-0000-0000-0000-000000000003', 'Barrierefrei', 'barrierefrei', 'Zugänglichkeit'),
  ('a6000000-0000-0000-0000-000000000004', 'Gastronomie vor Ort', 'gastronomie-vor-ort', 'Verpflegung'),
  ('a6000000-0000-0000-0000-000000000005', 'Buchung erforderlich', 'buchung-erforderlich', 'Organisation'),
  ('a6000000-0000-0000-0000-000000000006', 'Kinderwagengeeignet', 'kinderwagengeeignet-activity', 'Zugänglichkeit')
on conflict (id) do nothing;

-- === Altersgruppen ===========================================================
-- ASSUMPTION: Bänder frei gewählt, da Spec keine festen Werte vorgibt (siehe DECISIONS.md).

insert into age_groups (id, name, min_age, max_age, sort_order) values
  ('a7000000-0000-0000-0000-000000000001', '0-1 Jahre', 0, 1, 1),
  ('a7000000-0000-0000-0000-000000000002', '2-3 Jahre', 2, 3, 2),
  ('a7000000-0000-0000-0000-000000000003', '4-5 Jahre', 4, 5, 3),
  ('a7000000-0000-0000-0000-000000000004', '6-9 Jahre', 6, 9, 4),
  ('a7000000-0000-0000-0000-000000000005', '10-13 Jahre', 10, 13, 5),
  ('a7000000-0000-0000-0000-000000000006', '14-17 Jahre', 14, 17, 6)
on conflict (id) do nothing;

-- === Anbieter ================================================================

insert into providers (id, name, slug, description, website, status) values
  ('a8000000-0000-0000-0000-000000000001', '[Demo] Nordsee Feriendörfer GmbH', 'demo-nordsee-feriendoerfer', 'Demo-Anbieter für Seed-Daten, kein echtes Unternehmen.', 'https://example.com', 'active')
on conflict (id) do nothing;

-- === Familienunterkünfte =====================================================

insert into accommodations (
  id, title, slug, short_description, full_description, accommodation_type_id,
  provider_id, country_id, region_id, city, max_guests, max_adults, max_children,
  bedrooms, bathrooms, beds, living_area, price_from, price_type, currency,
  example_family_size, example_total_price, status, featured, family_rating, published_at
) values
  (
    'a9000000-0000-0000-0000-000000000001',
    '[Demo] Ferienhaus Nordseeblick für 7 Personen',
    'demo-ferienhaus-nordseeblick-fuer-7-personen',
    'Geräumiges Ferienhaus direkt an der Nordseeküste, Platz für die ganze Familie.',
    'Demo-Inhalt: Dieses fiktive Ferienhaus zeigt beispielhaft, wie FamVaya Unterkünfte für große Familien darstellt. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000001',
    'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'St. Peter-Ording',
    7, 2, 5, 4, 2, 6, 145.5, 189.00, 'per_night', 'EUR',
    '2 Erwachsene + 5 Kinder', 1323.00, 'published', true, 88, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000002',
    '[Demo] Familienhotel Alpenkönig',
    'demo-familienhotel-alpenkoenig',
    'Familienhotel in den Tiroler Alpen mit verbindbaren Familienzimmern.',
    'Demo-Inhalt: Fiktives Familienhotel zur Veranschaulichung der FamVaya-Familiencheck-Darstellung.',
    'a2000000-0000-0000-0000-000000000002',
    'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000003',
    'Kitzbühel',
    8, 2, 6, 3, 3, 8, 180.0, 259.00, 'per_night', 'EUR',
    '2 Erwachsene + 4 Kinder', 1554.00, 'published', true, 82, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000003',
    '[Demo] Bauernhof Sonnenhof',
    'demo-bauernhof-sonnenhof',
    'Erlebnisbauernhof in Bayern mit Tieren, Spielplatz und eingezäuntem Grundstück.',
    'Demo-Inhalt: Fiktiver Bauernhof zur Veranschaulichung der FamVaya-Darstellung für naturnahe Familienunterkünfte.',
    'a2000000-0000-0000-0000-000000000003',
    'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'Oberstdorf',
    9, 2, 7, 4, 2, 9, 210.0, 149.00, 'per_night', 'EUR',
    '2 Erwachsene + 6 Kinder', 1043.00, 'published', false, 79, now()
  )
on conflict (id) do nothing;

insert into accommodation_amenities (accommodation_id, amenity_id) values
  ('a9000000-0000-0000-0000-000000000001', 'a5000000-0000-0000-0000-000000000001'),
  ('a9000000-0000-0000-0000-000000000001', 'a5000000-0000-0000-0000-000000000002'),
  ('a9000000-0000-0000-0000-000000000001', 'a5000000-0000-0000-0000-000000000003'),
  ('a9000000-0000-0000-0000-000000000001', 'a5000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000002', 'a5000000-0000-0000-0000-000000000004'),
  ('a9000000-0000-0000-0000-000000000002', 'a5000000-0000-0000-0000-000000000006'),
  ('a9000000-0000-0000-0000-000000000002', 'a5000000-0000-0000-0000-000000000007'),
  ('a9000000-0000-0000-0000-000000000003', 'a5000000-0000-0000-0000-000000000001'),
  ('a9000000-0000-0000-0000-000000000003', 'a5000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000003', 'a5000000-0000-0000-0000-000000000008'),
  ('a9000000-0000-0000-0000-000000000003', 'a5000000-0000-0000-0000-000000000010')
on conflict do nothing;

insert into content_age_groups (content_type, content_id, age_group_id) values
  ('accommodation', 'a9000000-0000-0000-0000-000000000001', 'a7000000-0000-0000-0000-000000000003'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000001', 'a7000000-0000-0000-0000-000000000004'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000002', 'a7000000-0000-0000-0000-000000000004'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000002', 'a7000000-0000-0000-0000-000000000005'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000003', 'a7000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000003', 'a7000000-0000-0000-0000-000000000003')
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id) values
  ('accommodation', 'a9000000-0000-0000-0000-000000000001', 'a4000000-0000-0000-0000-000000000001'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000001', 'a4000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000002', 'a4000000-0000-0000-0000-000000000001'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000003', 'a4000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000003', 'a4000000-0000-0000-0000-000000000004')
on conflict do nothing;

-- === Familienaktivitäten =====================================================

insert into activities (
  id, title, slug, short_description, full_description, category_id, provider_id,
  country_id, region_id, city, duration_min, duration_max, indoor, outdoor,
  weather_suitable, adult_price, child_price, example_total_price, family_ticket,
  large_family_discount, booking_required, status, featured, family_rating, published_at
) values
  (
    'aa000000-0000-0000-0000-000000000001',
    '[Demo] Freizeitpark Abenteuerland',
    'demo-freizeitpark-abenteuerland',
    'Großer Freizeitpark mit Achterbahnen und Kinderbereich in Bayern.',
    'Demo-Inhalt: Fiktiver Freizeitpark zur Veranschaulichung der Aktivitäten-Darstellung mit Großfamilienrabatt.',
    'a3000000-0000-0000-0000-000000000001',
    'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'München',
    240, 480, false, true, false, 39.00, 29.00, 234.00, true, true, false,
    'published', true, 85, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000002',
    '[Demo] Tierpark Wildwald',
    'demo-tierpark-wildwald',
    'Naturnaher Tierpark mit heimischen Wildtieren, ideal bei jedem Wetter.',
    'Demo-Inhalt: Fiktiver Tierpark zur Veranschaulichung der FamVaya-Aktivitäten-Detailseite.',
    'a3000000-0000-0000-0000-000000000002',
    'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000004',
    'Salzburg',
    120, 240, false, true, true, 14.00, 8.00, 76.00, true, false, false,
    'published', false, 74, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000003',
    '[Demo] Erlebnisbad AquaFamilia',
    'demo-erlebnisbad-aquafamilia',
    'Indoor-Erlebnisbad mit Rutschen und Babybecken, ideal bei Regenwetter.',
    'Demo-Inhalt: Fiktives Erlebnisbad zur Veranschaulichung der Schlechtwetter-Kategorie.',
    'a3000000-0000-0000-0000-000000000003',
    'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Husum',
    180, 360, true, false, true, 18.00, 12.00, 96.00, true, true, false,
    'published', true, 80, now()
  )
on conflict (id) do nothing;

insert into activity_feature_links (activity_id, feature_id) values
  ('aa000000-0000-0000-0000-000000000001', 'a6000000-0000-0000-0000-000000000001'),
  ('aa000000-0000-0000-0000-000000000001', 'a6000000-0000-0000-0000-000000000002'),
  ('aa000000-0000-0000-0000-000000000002', 'a6000000-0000-0000-0000-000000000001'),
  ('aa000000-0000-0000-0000-000000000002', 'a6000000-0000-0000-0000-000000000003'),
  ('aa000000-0000-0000-0000-000000000003', 'a6000000-0000-0000-0000-000000000004'),
  ('aa000000-0000-0000-0000-000000000003', 'a6000000-0000-0000-0000-000000000006')
on conflict do nothing;

insert into content_age_groups (content_type, content_id, age_group_id) values
  ('activity', 'aa000000-0000-0000-0000-000000000001', 'a7000000-0000-0000-0000-000000000004'),
  ('activity', 'aa000000-0000-0000-0000-000000000001', 'a7000000-0000-0000-0000-000000000005'),
  ('activity', 'aa000000-0000-0000-0000-000000000002', 'a7000000-0000-0000-0000-000000000002'),
  ('activity', 'aa000000-0000-0000-0000-000000000002', 'a7000000-0000-0000-0000-000000000003'),
  ('activity', 'aa000000-0000-0000-0000-000000000003', 'a7000000-0000-0000-0000-000000000001'),
  ('activity', 'aa000000-0000-0000-0000-000000000003', 'a7000000-0000-0000-0000-000000000004')
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id) values
  ('activity', 'aa000000-0000-0000-0000-000000000001', 'a4000000-0000-0000-0000-000000000002'),
  ('activity', 'aa000000-0000-0000-0000-000000000002', 'a4000000-0000-0000-0000-000000000004'),
  ('activity', 'aa000000-0000-0000-0000-000000000003', 'a4000000-0000-0000-0000-000000000003')
on conflict do nothing;

-- === Mikro-Familienabenteuer =================================================

insert into micro_adventures (
  id, title, slug, short_description, full_description, category_id,
  duration_min, duration_max, cost_level, estimated_total_cost, preparation_level,
  difficulty_level, indoor, outdoor, seasonal_tags, weather_tags, materials,
  instructions, location_optional, status, featured, published_at
) values
  (
    'ab000000-0000-0000-0000-000000000001',
    '[Demo] Nachtwanderung mit Taschenlampen',
    'demo-nachtwanderung-mit-taschenlampen',
    'Spontanes Abenteuer im Dunkeln: mit Taschenlampen durch den nahen Wald.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000004',
    60, 90, 'free', 0.00, 'light', 'easy', false, true,
    array['sommer','herbst'], array['trocken'],
    array['Taschenlampen', 'wetterfeste Kleidung'],
    '1. Route bei Tageslicht kurz abgehen. 2. Bei Dämmerung starten. 3. Ruhig gehen und Nachtgeräusche entdecken.',
    true, 'published', true, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000002',
    '[Demo] Schatzsuche im Garten',
    'demo-schatzsuche-im-garten',
    'Selbstgebaute Schatzsuche für einen spontanen Nachmittag zuhause.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee, komplett ohne externen Buchungslink.',
    'a3000000-0000-0000-0000-000000000006',
    45, 60, 'free', 0.00, 'moderate', 'easy', false, true,
    array['fruehling','sommer'], array['trocken','bewoelkt'],
    array['Papier', 'Stift', 'kleine Preise'],
    '1. Hinweiszettel im Garten verstecken. 2. Route als Rätselkette aufbauen. 3. Schatz am Ende platzieren.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000003',
    '[Demo] Picknick am Fluss',
    'demo-picknick-am-fluss',
    'Gemeinsames Picknick an einem nahegelegenen Fluss oder See.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee für einen entspannten Familiennachmittag.',
    'a3000000-0000-0000-0000-000000000005',
    90, 180, 'low', 15.00, 'light', 'easy', false, true,
    array['fruehling','sommer','herbst'], array['sonnig','bewoelkt'],
    array['Picknickdecke', 'Essen und Getränke'],
    '1. Geeigneten Platz am Wasser suchen. 2. Decke ausbreiten. 3. Zeit ohne festen Plan genießen.',
    true, 'published', true, now()
  )
on conflict (id) do nothing;

insert into content_age_groups (content_type, content_id, age_group_id) values
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000001', 'a7000000-0000-0000-0000-000000000004'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000001', 'a7000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000002', 'a7000000-0000-0000-0000-000000000002'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000002', 'a7000000-0000-0000-0000-000000000003'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000003', 'a7000000-0000-0000-0000-000000000001'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000003', 'a7000000-0000-0000-0000-000000000006')
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id) values
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000001', 'a4000000-0000-0000-0000-000000000004'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000002', 'a4000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000003', 'a4000000-0000-0000-0000-000000000005')
on conflict do nothing;

-- === Medien (Platzhalter) ====================================================
-- storage_path zeigt auf einen fiktiven Pfad, es wurde noch nichts in Supabase
-- Storage hochgeladen. Dient nur dazu, das content_media-Muster zu zeigen.

insert into media (id, storage_path, alt_text) values
  ('ac000000-0000-0000-0000-000000000001', 'demo/accommodations/ferienhaus-nordseeblick.jpg', '[Demo] Ferienhaus Nordseeblick, Außenansicht'),
  ('ac000000-0000-0000-0000-000000000002', 'demo/accommodations/familienhotel-alpenkoenig.jpg', '[Demo] Familienhotel Alpenkönig, Außenansicht'),
  ('ac000000-0000-0000-0000-000000000003', 'demo/accommodations/bauernhof-sonnenhof.jpg', '[Demo] Bauernhof Sonnenhof, Hofansicht'),
  ('ac000000-0000-0000-0000-000000000004', 'demo/activities/freizeitpark-abenteuerland.jpg', '[Demo] Freizeitpark Abenteuerland'),
  ('ac000000-0000-0000-0000-000000000005', 'demo/activities/tierpark-wildwald.jpg', '[Demo] Tierpark Wildwald'),
  ('ac000000-0000-0000-0000-000000000006', 'demo/activities/erlebnisbad-aquafamilia.jpg', '[Demo] Erlebnisbad AquaFamilia'),
  ('ac000000-0000-0000-0000-000000000007', 'demo/micro-adventures/nachtwanderung.jpg', '[Demo] Nachtwanderung mit Taschenlampen'),
  ('ac000000-0000-0000-0000-000000000008', 'demo/micro-adventures/schatzsuche-garten.jpg', '[Demo] Schatzsuche im Garten'),
  ('ac000000-0000-0000-0000-000000000009', 'demo/micro-adventures/picknick-am-fluss.jpg', '[Demo] Picknick am Fluss')
on conflict (id) do nothing;

insert into content_media (content_type, content_id, media_id, sort_order, is_cover) values
  ('accommodation', 'a9000000-0000-0000-0000-000000000001', 'ac000000-0000-0000-0000-000000000001', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000002', 'ac000000-0000-0000-0000-000000000002', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000003', 'ac000000-0000-0000-0000-000000000003', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000001', 'ac000000-0000-0000-0000-000000000004', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000002', 'ac000000-0000-0000-0000-000000000005', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000003', 'ac000000-0000-0000-0000-000000000006', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000001', 'ac000000-0000-0000-0000-000000000007', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000002', 'ac000000-0000-0000-0000-000000000008', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000003', 'ac000000-0000-0000-0000-000000000009', 0, true)
on conflict do nothing;
