-- FamVaya Phase 0 — Seed-Daten (Demo-Inhalte)
--
-- Ursprünglich reduzierter Phase-0-Umfang (siehe FamVaya_Phase0_Prompt.md
-- Punkt 6); seit Phase 6 auf die Mindestmengen aus Spec §29 aufgefüllt
-- (12/12/15/6, siehe Block "FamVaya Phase 6" weiter unten). Alle Titel sind
-- mit "[Demo]" gekennzeichnet und behaupten an keiner Stelle reale
-- Verfügbarkeit oder Prüfung.
--
-- UUIDs sind deterministisch und nach Entity-Typ präfigiert, damit
-- Fremdschlüssel-Referenzen unten lesbar bleiben (siehe DECISIONS.md).
-- Format: <entity-prefix>-0000-0000-0000-<lfd. Nummer>
--   a0 countries   a1 regions   a2 accommodation_types  a3 categories
--   a4 tags        a5 amenities a6 activity_features    a7 age_groups
--   a8 providers   a9 accommodations  aa activities  ab micro_adventures
--   ac media        ad articles (seit Phase 6)
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

-- =============================================================================
-- FamVaya Phase 6 — Seed-Daten auf die Mindestmengen aus Spec §29 auffüllen
-- (12 Unterkünfte, 12 Aktivitäten, 15 Mikro-Abenteuer, 6 Magazinartikel).
-- Reiht sich in dieselben Referenzdaten (Länder/Regionen/Typen/Kategorien)
-- ein statt neue Geografie/Taxonomie zu erfinden — Ziel ist Content-Menge für
-- die neu gebaute Pagination, nicht neue Vielfalt an Referenzdaten.
-- Neuer Präfix: ad articles.

-- === Weitere Magazin-Kategorien (Spec §17 nennt 10 Kategorien, bisher 3) ===

insert into categories (id, name, slug, content_type, sort_order) values
  ('a3000000-0000-0000-0000-000000000010', 'Wochenendideen', 'wochenendideen', 'article', 4),
  ('a3000000-0000-0000-0000-000000000011', 'Schlechtwetter', 'schlechtwetter', 'article', 5),
  ('a3000000-0000-0000-0000-000000000012', 'Familienunterkünfte', 'familienunterkuenfte-magazin', 'article', 6),
  ('a3000000-0000-0000-0000-000000000013', 'Familienaktivitäten', 'familienaktivitaeten-magazin', 'article', 7),
  ('a3000000-0000-0000-0000-000000000014', 'Mikro-Abenteuer', 'mikro-abenteuer-magazin', 'article', 8),
  ('a3000000-0000-0000-0000-000000000015', 'Packlisten', 'packlisten', 'article', 9),
  ('a3000000-0000-0000-0000-000000000016', 'Reiseplanung', 'reiseplanung', 'article', 10)
on conflict (id) do nothing;

-- === Medien für neue Inhalte (Platzhalter, wie oben) =========================

insert into media (id, storage_path, alt_text) values
  ('ac000000-0000-0000-0000-000000000010', 'demo/accommodations/ferienwohnung-strandkorb.jpg', '[Demo] Ferienwohnung Strandkorb'),
  ('ac000000-0000-0000-0000-000000000011', 'demo/accommodations/familienhotel-bergsonne.jpg', '[Demo] Familienhotel Bergsonne'),
  ('ac000000-0000-0000-0000-000000000012', 'demo/accommodations/reiterhof-wiesengrund.jpg', '[Demo] Reiterhof Wiesengrund'),
  ('ac000000-0000-0000-0000-000000000013', 'demo/accommodations/chalet-tirolerhof.jpg', '[Demo] Chalet Tirolerhof'),
  ('ac000000-0000-0000-0000-000000000014', 'demo/accommodations/familienhotel-nordseestrand.jpg', '[Demo] Familienhotel Nordseestrand'),
  ('ac000000-0000-0000-0000-000000000015', 'demo/accommodations/ferienhof-apfelgarten.jpg', '[Demo] Ferienhof Apfelgarten'),
  ('ac000000-0000-0000-0000-000000000016', 'demo/accommodations/ferienhaus-waldlichtung.jpg', '[Demo] Ferienhaus Waldlichtung'),
  ('ac000000-0000-0000-0000-000000000017', 'demo/accommodations/familienhotel-alpenblick.jpg', '[Demo] Familienhotel Alpenblick'),
  ('ac000000-0000-0000-0000-000000000018', 'demo/accommodations/gutshof-sonnenwiese.jpg', '[Demo] Gutshof Sonnenwiese'),
  ('ac000000-0000-0000-0000-000000000019', 'demo/activities/kletterpark-hoehenrausch.jpg', '[Demo] Kletterpark Höhenrausch'),
  ('ac000000-0000-0000-0000-000000000020', 'demo/activities/streichelzoo-tierparadies.jpg', '[Demo] Streichelzoo Tierparadies'),
  ('ac000000-0000-0000-0000-000000000021', 'demo/activities/spassbad-wasserwelt.jpg', '[Demo] Spaßbad Wasserwelt'),
  ('ac000000-0000-0000-0000-000000000022', 'demo/activities/freizeitpark-dino-land.jpg', '[Demo] Freizeitpark Dino-Land'),
  ('ac000000-0000-0000-0000-000000000023', 'demo/activities/wildpark-luchsberg.jpg', '[Demo] Wildpark Luchsberg'),
  ('ac000000-0000-0000-0000-000000000024', 'demo/activities/therme-familienoase.jpg', '[Demo] Therme Familienoase'),
  ('ac000000-0000-0000-0000-000000000025', 'demo/activities/erlebnispark-ritterburg.jpg', '[Demo] Erlebnispark Ritterburg'),
  ('ac000000-0000-0000-0000-000000000026', 'demo/activities/aquarium-unterwasserwelt.jpg', '[Demo] Aquarium Unterwasserwelt'),
  ('ac000000-0000-0000-0000-000000000027', 'demo/activities/hallenbad-rutschenparadies.jpg', '[Demo] Hallenbad Rutschenparadies'),
  ('ac000000-0000-0000-0000-000000000028', 'demo/micro-adventures/barfusspfad-im-park.jpg', '[Demo] Barfußpfad im Park'),
  ('ac000000-0000-0000-0000-000000000029', 'demo/micro-adventures/muschelsuche-am-strand.jpg', '[Demo] Muschelsuche am Strand'),
  ('ac000000-0000-0000-0000-000000000030', 'demo/micro-adventures/kreidemalerei-auf-dem-gehweg.jpg', '[Demo] Kreidemalerei auf dem Gehweg'),
  ('ac000000-0000-0000-0000-000000000031', 'demo/micro-adventures/vogelbeobachtung-im-garten.jpg', '[Demo] Vogelbeobachtung im Garten'),
  ('ac000000-0000-0000-0000-000000000032', 'demo/micro-adventures/papierboote-schwimmen-lassen.jpg', '[Demo] Papierboote schwimmen lassen'),
  ('ac000000-0000-0000-0000-000000000033', 'demo/micro-adventures/familien-fotorallye.jpg', '[Demo] Familien-Fotorallye'),
  ('ac000000-0000-0000-0000-000000000034', 'demo/micro-adventures/baumklettern-im-wald.jpg', '[Demo] Baumklettern im Wald'),
  ('ac000000-0000-0000-0000-000000000035', 'demo/micro-adventures/kneippen-im-bach.jpg', '[Demo] Kneippen im Bach'),
  ('ac000000-0000-0000-0000-000000000036', 'demo/micro-adventures/sterne-beobachten-im-garten.jpg', '[Demo] Sterne beobachten im Garten'),
  ('ac000000-0000-0000-0000-000000000037', 'demo/micro-adventures/waldmemory-sammeln.jpg', '[Demo] Waldmemory sammeln'),
  ('ac000000-0000-0000-0000-000000000038', 'demo/micro-adventures/seifenblasen-werkstatt.jpg', '[Demo] Seifenblasen-Werkstatt'),
  ('ac000000-0000-0000-0000-000000000039', 'demo/micro-adventures/regenpfuetzen-expedition.jpg', '[Demo] Regenpfützen-Expedition'),
  ('ac000000-0000-0000-0000-000000000040', 'demo/articles/beste-ferienhaeuser-drei-kinder.jpg', 'Titelbild: Die besten Ferienhäuser für Familien mit drei Kindern'),
  ('ac000000-0000-0000-0000-000000000041', 'demo/articles/familienhotels-fuenf-personen.jpg', 'Titelbild: Familienhotels mit Zimmern für fünf oder mehr Personen'),
  ('ac000000-0000-0000-0000-000000000042', 'demo/articles/urlaub-mit-vier-kindern.jpg', 'Titelbild: Urlaub mit vier Kindern'),
  ('ac000000-0000-0000-0000-000000000043', 'demo/articles/ausfluege-unter-100-euro.jpg', 'Titelbild: Ausflüge unter 100 Euro für eine fünfköpfige Familie'),
  ('ac000000-0000-0000-0000-000000000044', 'demo/articles/beste-aktivitaeten-bei-regen.jpg', 'Titelbild: Die besten Aktivitäten bei Regen'),
  ('ac000000-0000-0000-0000-000000000045', 'demo/articles/mikro-abenteuer-jedes-wochenende.jpg', 'Titelbild: Mikro-Abenteuer für jedes Wochenende')
on conflict (id) do nothing;

-- === Weitere Familienunterkünfte (+9, Spec-Minimum: 12) =====================

insert into accommodations (
  id, title, slug, short_description, full_description, accommodation_type_id,
  provider_id, country_id, region_id, city, max_guests, max_adults, max_children,
  bedrooms, bathrooms, beds, living_area, price_from, price_type, currency,
  example_family_size, example_total_price, status, featured, family_rating, published_at
) values
  (
    'a9000000-0000-0000-0000-000000000004', '[Demo] Ferienwohnung Strandkorb', 'demo-ferienwohnung-strandkorb',
    'Helle Ferienwohnung nur wenige Gehminuten vom Nordseestrand entfernt.',
    'Demo-Inhalt: Fiktive Ferienwohnung zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000001', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Wremen',
    6, 2, 4, 3, 1, 5, 95.0, 119.00, 'per_night', 'EUR', '2 Erwachsene + 4 Kinder', 833.00,
    'published', false, 75, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000005', '[Demo] Familienhotel Bergsonne', 'demo-familienhotel-bergsonne',
    'Familienhotel mit Panoramablick auf die Salzburger Berge und Kinderclub.',
    'Demo-Inhalt: Fiktives Familienhotel zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000002', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'Zell am See',
    9, 2, 7, 4, 3, 10, 150.0, 229.00, 'per_night', 'EUR', '2 Erwachsene + 5 Kinder', 1487.00,
    'published', true, 90, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000006', '[Demo] Reiterhof Wiesengrund', 'demo-reiterhof-wiesengrund',
    'Bauernhof mit eigenem Reiterhof und viel Platz zum Toben in Bayern.',
    'Demo-Inhalt: Fiktiver Reiterhof zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000003', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Rosenheim',
    10, 2, 8, 5, 2, 11, 220.0, 169.00, 'per_night', 'EUR', '2 Erwachsene + 6 Kinder', 1183.00,
    'published', false, 81, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000007', '[Demo] Chalet Tirolerhof', 'demo-chalet-tirolerhof',
    'Gemütliches Chalet in Seefeld mit Kamin und eigenem Garten.',
    'Demo-Inhalt: Fiktives Chalet zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000001', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Seefeld',
    9, 2, 7, 4, 2, 10, 160.0, 199.00, 'per_night', 'EUR', '2 Erwachsene + 5 Kinder', 1393.00,
    'published', true, 86, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000008', '[Demo] Familienhotel Nordseestrand', 'demo-familienhotel-nordseestrand',
    'Familienhotel direkt am Deich mit Indoor-Spielbereich für Regentage.',
    'Demo-Inhalt: Fiktives Familienhotel zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000002', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Büsum',
    7, 2, 5, 3, 2, 8, 130.0, 179.00, 'per_night', 'EUR', '2 Erwachsene + 3 Kinder', 895.00,
    'published', false, 77, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000009', '[Demo] Ferienhof Apfelgarten', 'demo-ferienhof-apfelgarten',
    'Bauernhof mit eigenem Apfelgarten und Tieren zum Streicheln.',
    'Demo-Inhalt: Fiktiver Ferienhof zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000003', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'Saalfelden',
    8, 2, 6, 4, 2, 9, 175.0, 139.00, 'per_night', 'EUR', '2 Erwachsene + 4 Kinder', 973.00,
    'published', false, 78, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000010', '[Demo] Ferienhaus Waldlichtung', 'demo-ferienhaus-waldlichtung',
    'Ruhiges Ferienhaus am Waldrand nahe Berchtesgaden, ideal für Wanderfamilien.',
    'Demo-Inhalt: Fiktives Ferienhaus zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000001', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Berchtesgaden',
    6, 2, 4, 3, 1, 6, 110.0, 159.00, 'per_night', 'EUR', '2 Erwachsene + 3 Kinder', 795.00,
    'published', true, 83, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000011', '[Demo] Familienhotel Alpenblick', 'demo-familienhotel-alpenblick',
    'Familienhotel in Innsbruck mit Ausflügen in die Berge direkt ab Haus.',
    'Demo-Inhalt: Fiktives Familienhotel zur Veranschaulichung der FamVaya-Darstellung. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000002', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Innsbruck',
    9, 2, 7, 4, 3, 10, 145.0, 249.00, 'per_night', 'EUR', '2 Erwachsene + 5 Kinder', 1618.00,
    'published', false, 89, now()
  ),
  (
    'a9000000-0000-0000-0000-000000000012', '[Demo] Gutshof Sonnenwiese', 'demo-gutshof-sonnenwiese',
    'Großzügiger Gutshof nahe Cuxhaven, besonders geeignet für sehr große Familien.',
    'Demo-Inhalt: Fiktiver Gutshof zur Veranschaulichung der FamVaya-Darstellung für sehr große Familien. Keine reale Verfügbarkeit.',
    'a2000000-0000-0000-0000-000000000003', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Cuxhaven',
    11, 2, 9, 5, 3, 12, 250.0, 189.00, 'per_night', 'EUR', '2 Erwachsene + 7 Kinder', 1323.00,
    'published', true, 92, now()
  )
on conflict (id) do nothing;

insert into content_media (content_type, content_id, media_id, sort_order, is_cover) values
  ('accommodation', 'a9000000-0000-0000-0000-000000000004', 'ac000000-0000-0000-0000-000000000010', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000005', 'ac000000-0000-0000-0000-000000000011', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000006', 'ac000000-0000-0000-0000-000000000012', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000007', 'ac000000-0000-0000-0000-000000000013', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000008', 'ac000000-0000-0000-0000-000000000014', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000009', 'ac000000-0000-0000-0000-000000000015', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000010', 'ac000000-0000-0000-0000-000000000016', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000011', 'ac000000-0000-0000-0000-000000000017', 0, true),
  ('accommodation', 'a9000000-0000-0000-0000-000000000012', 'ac000000-0000-0000-0000-000000000018', 0, true)
on conflict do nothing;

insert into accommodation_amenities (accommodation_id, amenity_id) values
  ('a9000000-0000-0000-0000-000000000004', 'a5000000-0000-0000-0000-000000000001'),
  ('a9000000-0000-0000-0000-000000000004', 'a5000000-0000-0000-0000-000000000009'),
  ('a9000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000004'),
  ('a9000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000006'),
  ('a9000000-0000-0000-0000-000000000006', 'a5000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000006', 'a5000000-0000-0000-0000-000000000008'),
  ('a9000000-0000-0000-0000-000000000006', 'a5000000-0000-0000-0000-000000000010'),
  ('a9000000-0000-0000-0000-000000000007', 'a5000000-0000-0000-0000-000000000001'),
  ('a9000000-0000-0000-0000-000000000007', 'a5000000-0000-0000-0000-000000000003'),
  ('a9000000-0000-0000-0000-000000000008', 'a5000000-0000-0000-0000-000000000006'),
  ('a9000000-0000-0000-0000-000000000008', 'a5000000-0000-0000-0000-000000000007'),
  ('a9000000-0000-0000-0000-000000000009', 'a5000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000009', 'a5000000-0000-0000-0000-000000000008'),
  ('a9000000-0000-0000-0000-000000000009', 'a5000000-0000-0000-0000-000000000010'),
  ('a9000000-0000-0000-0000-000000000010', 'a5000000-0000-0000-0000-000000000001'),
  ('a9000000-0000-0000-0000-000000000010', 'a5000000-0000-0000-0000-000000000002'),
  ('a9000000-0000-0000-0000-000000000011', 'a5000000-0000-0000-0000-000000000004'),
  ('a9000000-0000-0000-0000-000000000011', 'a5000000-0000-0000-0000-000000000006'),
  ('a9000000-0000-0000-0000-000000000012', 'a5000000-0000-0000-0000-000000000001'),
  ('a9000000-0000-0000-0000-000000000012', 'a5000000-0000-0000-0000-000000000005'),
  ('a9000000-0000-0000-0000-000000000012', 'a5000000-0000-0000-0000-000000000008'),
  ('a9000000-0000-0000-0000-000000000012', 'a5000000-0000-0000-0000-000000000010')
on conflict do nothing;

insert into content_age_groups (content_type, content_id, age_group_id) values
  ('accommodation', 'a9000000-0000-0000-0000-000000000004', 'a7000000-0000-0000-0000-000000000003'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000005', 'a7000000-0000-0000-0000-000000000004'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000005', 'a7000000-0000-0000-0000-000000000005'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000006', 'a7000000-0000-0000-0000-000000000004'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000006', 'a7000000-0000-0000-0000-000000000006'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000007', 'a7000000-0000-0000-0000-000000000003'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000007', 'a7000000-0000-0000-0000-000000000005'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000008', 'a7000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000009', 'a7000000-0000-0000-0000-000000000001'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000009', 'a7000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000010', 'a7000000-0000-0000-0000-000000000004'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000011', 'a7000000-0000-0000-0000-000000000005'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000011', 'a7000000-0000-0000-0000-000000000006'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000012', 'a7000000-0000-0000-0000-000000000001'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000012', 'a7000000-0000-0000-0000-000000000003'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000012', 'a7000000-0000-0000-0000-000000000006')
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id) values
  ('accommodation', 'a9000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000005'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000005', 'a4000000-0000-0000-0000-000000000001'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000006', 'a4000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000006', 'a4000000-0000-0000-0000-000000000004'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000007', 'a4000000-0000-0000-0000-000000000001'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000008', 'a4000000-0000-0000-0000-000000000005'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000009', 'a4000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000010', 'a4000000-0000-0000-0000-000000000004'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000011', 'a4000000-0000-0000-0000-000000000001'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000012', 'a4000000-0000-0000-0000-000000000002'),
  ('accommodation', 'a9000000-0000-0000-0000-000000000012', 'a4000000-0000-0000-0000-000000000004')
on conflict do nothing;

-- === Weitere Familienaktivitäten (+9, Spec-Minimum: 12) ======================

insert into activities (
  id, title, slug, short_description, full_description, category_id, provider_id,
  country_id, region_id, city, duration_min, duration_max, indoor, outdoor,
  weather_suitable, adult_price, child_price, example_total_price, family_ticket,
  large_family_discount, booking_required, status, featured, family_rating, published_at
) values
  (
    'aa000000-0000-0000-0000-000000000004', '[Demo] Kletterpark Höhenrausch', 'demo-kletterpark-hoehenrausch',
    'Kletterparcours mit mehreren Schwierigkeitsstufen für die ganze Familie.',
    'Demo-Inhalt: Fiktiver Kletterpark zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000001', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Garmisch-Partenkirchen',
    120, 180, false, true, false, 29.00, 19.00, 145.00, true, false, true, 'published', true, 80, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000005', '[Demo] Streichelzoo Tierparadies', 'demo-streichelzoo-tierparadies',
    'Kleiner Streichelzoo mit heimischen Tieren, entspannt für kleine Kinder.',
    'Demo-Inhalt: Fiktiver Streichelzoo zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000002', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Bremerhaven',
    60, 120, false, true, true, 8.00, 5.00, 41.00, true, true, false, 'published', false, 70, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000006', '[Demo] Spaßbad Wasserwelt', 'demo-spassbad-wasserwelt',
    'Indoor-Spaßbad mit Rutschen und separatem Kleinkindbereich.',
    'Demo-Inhalt: Fiktives Spaßbad zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000003', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Kufstein',
    120, 240, true, false, true, 16.00, 10.00, 92.00, true, false, false, 'published', true, 84, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000007', '[Demo] Freizeitpark Dino-Land', 'demo-freizeitpark-dino-land',
    'Freizeitpark mit Dinosaurier-Themenbereich und Fahrgeschäften für alle Altersgruppen.',
    'Demo-Inhalt: Fiktiver Freizeitpark zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000001', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'Salzburg',
    180, 360, false, true, false, 32.00, 22.00, 208.00, true, true, false, 'published', false, 76, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000008', '[Demo] Wildpark Luchsberg', 'demo-wildpark-luchsberg',
    'Wildpark mit heimischen Waldtieren und ausgeschildertem Rundweg.',
    'Demo-Inhalt: Fiktiver Wildpark zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000002', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Landshut',
    90, 150, false, true, true, 10.00, 6.00, 52.00, true, false, false, 'published', false, 72, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000009', '[Demo] Therme Familienoase', 'demo-therme-familienoase',
    'Therme mit großzügigem Familienbereich und Außenbecken.',
    'Demo-Inhalt: Fiktive Therme zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000003', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Cuxhaven',
    120, 300, true, false, true, 19.00, 13.00, 115.00, true, true, true, 'published', true, 88, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000010', '[Demo] Erlebnispark Ritterburg', 'demo-erlebnispark-ritterburg',
    'Mittelalterlich gestalteter Erlebnispark mit Bogenschießen und Turmklettern.',
    'Demo-Inhalt: Fiktiver Erlebnispark zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000001', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Rattenberg',
    90, 180, false, true, false, 22.00, 15.00, 132.00, true, false, false, 'published', false, 75, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000011', '[Demo] Aquarium Unterwasserwelt', 'demo-aquarium-unterwasserwelt',
    'Indoor-Aquarium mit begehbarem Unterwassertunnel, ideal bei jedem Wetter.',
    'Demo-Inhalt: Fiktives Aquarium zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000002', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'Zell am See',
    60, 120, true, false, true, 13.00, 8.00, 68.00, true, false, false, 'published', false, 73, now()
  ),
  (
    'aa000000-0000-0000-0000-000000000012', '[Demo] Hallenbad Rutschenparadies', 'demo-hallenbad-rutschenparadies',
    'Hallenbad mit mehreren Rutschen und Wellenbecken.',
    'Demo-Inhalt: Fiktives Hallenbad zur Veranschaulichung der Aktivitäten-Darstellung.',
    'a3000000-0000-0000-0000-000000000003', 'a8000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Augsburg',
    90, 180, true, false, true, 15.00, 9.00, 78.00, true, true, false, 'published', true, 81, now()
  )
on conflict (id) do nothing;

insert into content_media (content_type, content_id, media_id, sort_order, is_cover) values
  ('activity', 'aa000000-0000-0000-0000-000000000004', 'ac000000-0000-0000-0000-000000000019', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000005', 'ac000000-0000-0000-0000-000000000020', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000006', 'ac000000-0000-0000-0000-000000000021', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000007', 'ac000000-0000-0000-0000-000000000022', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000008', 'ac000000-0000-0000-0000-000000000023', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000009', 'ac000000-0000-0000-0000-000000000024', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000010', 'ac000000-0000-0000-0000-000000000025', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000011', 'ac000000-0000-0000-0000-000000000026', 0, true),
  ('activity', 'aa000000-0000-0000-0000-000000000012', 'ac000000-0000-0000-0000-000000000027', 0, true)
on conflict do nothing;

insert into activity_feature_links (activity_id, feature_id) values
  ('aa000000-0000-0000-0000-000000000004', 'a6000000-0000-0000-0000-000000000001'),
  ('aa000000-0000-0000-0000-000000000004', 'a6000000-0000-0000-0000-000000000005'),
  ('aa000000-0000-0000-0000-000000000005', 'a6000000-0000-0000-0000-000000000001'),
  ('aa000000-0000-0000-0000-000000000005', 'a6000000-0000-0000-0000-000000000006'),
  ('aa000000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000004'),
  ('aa000000-0000-0000-0000-000000000007', 'a6000000-0000-0000-0000-000000000001'),
  ('aa000000-0000-0000-0000-000000000007', 'a6000000-0000-0000-0000-000000000004'),
  ('aa000000-0000-0000-0000-000000000008', 'a6000000-0000-0000-0000-000000000003'),
  ('aa000000-0000-0000-0000-000000000009', 'a6000000-0000-0000-0000-000000000005'),
  ('aa000000-0000-0000-0000-000000000010', 'a6000000-0000-0000-0000-000000000001'),
  ('aa000000-0000-0000-0000-000000000011', 'a6000000-0000-0000-0000-000000000003'),
  ('aa000000-0000-0000-0000-000000000012', 'a6000000-0000-0000-0000-000000000006')
on conflict do nothing;

insert into content_age_groups (content_type, content_id, age_group_id) values
  ('activity', 'aa000000-0000-0000-0000-000000000004', 'a7000000-0000-0000-0000-000000000005'),
  ('activity', 'aa000000-0000-0000-0000-000000000004', 'a7000000-0000-0000-0000-000000000006'),
  ('activity', 'aa000000-0000-0000-0000-000000000005', 'a7000000-0000-0000-0000-000000000001'),
  ('activity', 'aa000000-0000-0000-0000-000000000005', 'a7000000-0000-0000-0000-000000000002'),
  ('activity', 'aa000000-0000-0000-0000-000000000006', 'a7000000-0000-0000-0000-000000000003'),
  ('activity', 'aa000000-0000-0000-0000-000000000007', 'a7000000-0000-0000-0000-000000000004'),
  ('activity', 'aa000000-0000-0000-0000-000000000008', 'a7000000-0000-0000-0000-000000000002'),
  ('activity', 'aa000000-0000-0000-0000-000000000009', 'a7000000-0000-0000-0000-000000000001'),
  ('activity', 'aa000000-0000-0000-0000-000000000009', 'a7000000-0000-0000-0000-000000000003'),
  ('activity', 'aa000000-0000-0000-0000-000000000010', 'a7000000-0000-0000-0000-000000000005'),
  ('activity', 'aa000000-0000-0000-0000-000000000011', 'a7000000-0000-0000-0000-000000000003'),
  ('activity', 'aa000000-0000-0000-0000-000000000012', 'a7000000-0000-0000-0000-000000000004')
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id) values
  ('activity', 'aa000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000004'),
  ('activity', 'aa000000-0000-0000-0000-000000000005', 'a4000000-0000-0000-0000-000000000001'),
  ('activity', 'aa000000-0000-0000-0000-000000000006', 'a4000000-0000-0000-0000-000000000003'),
  ('activity', 'aa000000-0000-0000-0000-000000000007', 'a4000000-0000-0000-0000-000000000002'),
  ('activity', 'aa000000-0000-0000-0000-000000000008', 'a4000000-0000-0000-0000-000000000004'),
  ('activity', 'aa000000-0000-0000-0000-000000000009', 'a4000000-0000-0000-0000-000000000003'),
  ('activity', 'aa000000-0000-0000-0000-000000000010', 'a4000000-0000-0000-0000-000000000002'),
  ('activity', 'aa000000-0000-0000-0000-000000000011', 'a4000000-0000-0000-0000-000000000003'),
  ('activity', 'aa000000-0000-0000-0000-000000000012', 'a4000000-0000-0000-0000-000000000005')
on conflict do nothing;

-- === Weitere Mikro-Familienabenteuer (+12, Spec-Minimum: 15) =================

insert into micro_adventures (
  id, title, slug, short_description, full_description, category_id,
  duration_min, duration_max, cost_level, estimated_total_cost, preparation_level,
  difficulty_level, indoor, outdoor, seasonal_tags, weather_tags, materials,
  instructions, location_optional, status, featured, published_at
) values
  (
    'ab000000-0000-0000-0000-000000000004', '[Demo] Barfußpfad im Park', 'demo-barfusspfad-im-park',
    'Verschiedene Untergründe barfuß erkunden — spontan im nächsten Park.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000004', 30, 60, 'free', 0.00, 'none', 'easy', false, true,
    array['fruehling','sommer','herbst'], array['trocken'], array[]::text[],
    '1. Geeigneten Weg mit unterschiedlichen Untergründen finden. 2. Schuhe ausziehen. 3. Gemeinsam die Empfindungen besprechen.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000005', '[Demo] Muschelsuche am Strand', 'demo-muschelsuche-am-strand',
    'Muscheln und Fundstücke am Strand sammeln und sortieren.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000005', 45, 90, 'free', 0.00, 'light', 'easy', false, true,
    array['sommer'], array['sonnig','bewoelkt'], array['Eimer'],
    '1. Zum Strand aufbrechen. 2. Muscheln sammeln. 3. Zuhause nach Farbe oder Form sortieren.',
    true, 'published', true, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000006', '[Demo] Kreidemalerei auf dem Gehweg', 'demo-kreidemalerei-auf-dem-gehweg',
    'Den Gehweg vor der Tür in eine bunte Leinwand verwandeln.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000006', 30, 45, 'low', 5.00, 'light', 'easy', false, true,
    array['fruehling','sommer','herbst'], array['trocken'], array['Straßenkreide'],
    '1. Straßenkreide besorgen. 2. Motive gemeinsam ausdenken. 3. Gehweg oder Einfahrt bemalen.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000007', '[Demo] Vogelbeobachtung im Garten', 'demo-vogelbeobachtung-im-garten',
    'Heimische Vögel im eigenen Garten oder Park entdecken und bestimmen.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000004', 30, 60, 'free', 0.00, 'none', 'easy', false, true,
    array['fruehling','sommer'], array['trocken','bewoelkt'], array['Fernglas'],
    '1. Ruhigen Platz im Garten oder Park suchen. 2. Vögel beobachten. 3. Mit einem Vogelbuch oder einer App bestimmen.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000008', '[Demo] Papierboote schwimmen lassen', 'demo-papierboote-schwimmen-lassen',
    'Papierboote falten und an einem Bach oder in der Regentonne schwimmen lassen.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000005', 30, 60, 'free', 0.00, 'light', 'easy', false, true,
    array['fruehling','sommer','herbst'], array['trocken'], array['Papier'],
    '1. Papierboote falten. 2. Geeignete Wasserstelle suchen. 3. Boote gegeneinander schwimmen lassen.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000009', '[Demo] Familien-Fotorallye', 'demo-familien-fotorallye',
    'Mit einer selbst erstellten Fotoliste die Nachbarschaft neu entdecken.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000006', 60, 120, 'free', 0.00, 'light', 'medium', false, true,
    array['fruehling','sommer','herbst'], array['trocken'], array['Smartphone oder Kamera'],
    '1. Liste mit Fotomotiven erstellen (z. B. „etwas Rotes", „ein Tier"). 2. Gemeinsam losziehen. 3. Ergebnisse anschließend vergleichen.',
    true, 'published', true, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000010', '[Demo] Baumklettern im Wald', 'demo-baumklettern-im-wald',
    'Niedrige, sichere Bäume im nahen Wald zum Klettern nutzen.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000004', 45, 90, 'free', 0.00, 'light', 'medium', false, true,
    array['fruehling','sommer','herbst'], array['trocken'], array['festes Schuhwerk'],
    '1. Geeigneten, niedrigen Baum auswählen. 2. Auf sicheren Halt achten. 3. Abwechselnd klettern.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000011', '[Demo] Kneippen im Bach', 'demo-kneippen-im-bach',
    'Wassertreten im kühlen Bach für zwischendurch.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000005', 20, 40, 'free', 0.00, 'none', 'easy', false, true,
    array['fruehling','sommer','herbst'], array['sonnig'], array['Handtuch'],
    '1. Flachen, ruhigen Bach suchen. 2. Barfuß hineinstellen. 3. Abwechselnd stehen und ausruhen.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000012', '[Demo] Sterne beobachten im Garten', 'demo-sterne-beobachten-im-garten',
    'An einem klaren Abend gemeinsam den Sternenhimmel entdecken.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000006', 30, 60, 'free', 0.00, 'none', 'easy', false, true,
    array['herbst','winter'], array['klar'], array['warme Decke'],
    '1. Klaren Abend abwarten. 2. Decken nach draußen bringen. 3. Sternbilder gemeinsam suchen.',
    true, 'published', true, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000013', '[Demo] Waldmemory sammeln', 'demo-waldmemory-sammeln',
    'Naturmaterialien sammeln und daraus ein selbstgebautes Memory legen.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000004', 30, 60, 'free', 0.00, 'light', 'easy', false, true,
    array['herbst'], array['trocken'], array['kleiner Korb'],
    '1. Von jeder Naturform zwei Exemplare sammeln (Blätter, Kastanien, Steine). 2. Verdeckt auslegen. 3. Gemeinsam Paare finden.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000014', '[Demo] Seifenblasen-Werkstatt', 'demo-seifenblasen-werkstatt',
    'Riesige Seifenblasen selbst herstellen und im Garten steigen lassen.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000006', 30, 45, 'low', 5.00, 'light', 'easy', false, true,
    array['fruehling','sommer'], array['trocken','windstill'], array['Spülmittel', 'Wasser', 'Draht'],
    '1. Seifenblasenlösung anrühren. 2. Große Blasringe aus Draht formen. 3. Im Garten Riesenblasen erzeugen.',
    true, 'published', false, now()
  ),
  (
    'ab000000-0000-0000-0000-000000000015', '[Demo] Regenpfützen-Expedition', 'demo-regenpfuetzen-expedition',
    'Nach dem Regen gemeinsam die größten Pfützen der Umgebung erkunden.',
    'Demo-Inhalt: Fiktive Mikro-Abenteuer-Idee zur Veranschaulichung der FamVaya-Detailseite.',
    'a3000000-0000-0000-0000-000000000005', 20, 40, 'free', 0.00, 'none', 'easy', false, true,
    array['herbst','winter','fruehling'], array['regen'], array['Gummistiefel'],
    '1. Nach einem Regenschauer losziehen. 2. Größte Pfützen der Nachbarschaft suchen. 3. Vorsichtig hindurchstapfen.',
    true, 'published', false, now()
  )
on conflict (id) do nothing;

insert into content_media (content_type, content_id, media_id, sort_order, is_cover) values
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000004', 'ac000000-0000-0000-0000-000000000028', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000005', 'ac000000-0000-0000-0000-000000000029', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000006', 'ac000000-0000-0000-0000-000000000030', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000007', 'ac000000-0000-0000-0000-000000000031', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000008', 'ac000000-0000-0000-0000-000000000032', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000009', 'ac000000-0000-0000-0000-000000000033', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000010', 'ac000000-0000-0000-0000-000000000034', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000011', 'ac000000-0000-0000-0000-000000000035', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000012', 'ac000000-0000-0000-0000-000000000036', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000013', 'ac000000-0000-0000-0000-000000000037', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000014', 'ac000000-0000-0000-0000-000000000038', 0, true),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000015', 'ac000000-0000-0000-0000-000000000039', 0, true)
on conflict do nothing;

insert into content_age_groups (content_type, content_id, age_group_id) values
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000004', 'a7000000-0000-0000-0000-000000000003'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000005', 'a7000000-0000-0000-0000-000000000002'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000006', 'a7000000-0000-0000-0000-000000000003'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000007', 'a7000000-0000-0000-0000-000000000004'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000008', 'a7000000-0000-0000-0000-000000000001'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000009', 'a7000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000010', 'a7000000-0000-0000-0000-000000000004'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000011', 'a7000000-0000-0000-0000-000000000002'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000012', 'a7000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000013', 'a7000000-0000-0000-0000-000000000003'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000014', 'a7000000-0000-0000-0000-000000000002'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000015', 'a7000000-0000-0000-0000-000000000004')
on conflict do nothing;

insert into content_tags (content_type, content_id, tag_id) values
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000005', 'a4000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000006', 'a4000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000007', 'a4000000-0000-0000-0000-000000000004'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000009', 'a4000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000010', 'a4000000-0000-0000-0000-000000000004'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000012', 'a4000000-0000-0000-0000-000000000005'),
  ('micro_adventure', 'ab000000-0000-0000-0000-000000000014', 'a4000000-0000-0000-0000-000000000005')
on conflict do nothing;

-- === Magazinartikel (6, Spec-Minimum: 6) ======================================
-- author_id bleibt NULL: kein fester Seed-Nutzer verfügbar (siehe DECISIONS.md).
-- Die Titel sind wörtlich aus Spec §17 übernommen.

insert into articles (
  id, title, slug, excerpt, content, author_id, category_id, cover_media_id,
  status, published_at
) values
  (
    'ad000000-0000-0000-0000-000000000001',
    'Die besten Ferienhäuser für Familien mit drei Kindern',
    'die-besten-ferienhaeuser-fuer-familien-mit-drei-kindern',
    'Worauf es bei der Wahl eines Ferienhauses für drei oder mehr Kinder wirklich ankommt.',
    E'Demo-Inhalt: Dieser Artikel zeigt beispielhaft, wie ein FamVaya-Magazinbeitrag aussieht.\n\nBei drei oder mehr Kindern zählt vor allem eines: genug Platz, ohne dass jede Nacht zum Puzzle wird. Achtet auf mindestens drei separate Schlafzimmer oder Betten, die sich flexibel kombinieren lassen.\n\nEbenso wichtig: ein eingezäuntes Grundstück, eine ausgestattete Küche und – wenn möglich – eine Waschmaschine vor Ort. Das spart bei einer Woche Urlaub mit fünf oder mehr Personen spürbar Gepäck und Nerven.',
    null, 'a3000000-0000-0000-0000-000000000012', 'ac000000-0000-0000-0000-000000000040',
    'published', now()
  ),
  (
    'ad000000-0000-0000-0000-000000000002',
    'Familienhotels mit Zimmern für fünf oder mehr Personen',
    'familienhotels-mit-zimmern-fuer-fuenf-oder-mehr-personen',
    'Nicht jedes Familienhotel hat wirklich große Familien im Blick — worauf ihr achten solltet.',
    E'Demo-Inhalt: Dieser Artikel zeigt beispielhaft, wie ein FamVaya-Magazinbeitrag aussieht.\n\nViele Hotels werben mit „Familienzimmern", meinen damit aber oft nur zwei Erwachsene plus ein Kind. Fragt gezielt nach verbindbaren Zimmern oder echten Fünf-Personen-Zimmern, bevor ihr bucht.\n\nEin Kinderclub oder Betreuungsangebot ist ein Bonus, aber kein Ersatz für ausreichend Schlafplätze und ein gemeinsames Esszimmer, in dem die ganze Familie an einen Tisch passt.',
    null, 'a3000000-0000-0000-0000-000000000012', 'ac000000-0000-0000-0000-000000000041',
    'published', now()
  ),
  (
    'ad000000-0000-0000-0000-000000000003',
    'Urlaub mit vier Kindern: So findet ihr passende Unterkünfte',
    'urlaub-mit-vier-kindern-so-findet-ihr-passende-unterkuenfte',
    'Vier Kinder, ein Urlaub, eine Unterkunft: eine strukturierte Herangehensweise an die Suche.',
    E'Demo-Inhalt: Dieser Artikel zeigt beispielhaft, wie ein FamVaya-Magazinbeitrag aussieht.\n\nMit vier Kindern schrumpft das Angebot an geeigneten Unterkünften spürbar. Startet die Suche deshalb mit einem harten Kriterium – etwa „mindestens vier Schlafplätze für Kinder" – statt mit dem Reiseziel.\n\nNutzt anschließend den FamVaya-Familiencheck auf jeder Unterkunft, um auf einen Blick zu sehen, für wie viele Kinder sie realistisch gedacht ist, statt euch allein auf die maximale Personenzahl zu verlassen.',
    null, 'a3000000-0000-0000-0000-000000000008', 'ac000000-0000-0000-0000-000000000042',
    'published', now()
  ),
  (
    'ad000000-0000-0000-0000-000000000004',
    'Ausflüge unter 100 Euro für eine fünfköpfige Familie',
    'ausfluege-unter-100-euro-fuer-eine-fuenfkoepfige-familie',
    'Gute Ausflüge müssen für eine große Familie nicht teuer sein — ein paar Beispiele.',
    E'Demo-Inhalt: Dieser Artikel zeigt beispielhaft, wie ein FamVaya-Magazinbeitrag aussieht.\n\nBei fünf Personen addieren sich Eintrittspreise schnell. Achtet auf Familientickets und Großfamilienrabatte – bei FamVaya markieren wir beides direkt auf der Aktivitäten-Karte.\n\nMikro-Familienabenteuer sind eine kostenlose Alternative für Tage, an denen das Budget schon anderweitig verplant ist: von der Nachtwanderung bis zur Schatzsuche im eigenen Garten.',
    null, 'a3000000-0000-0000-0000-000000000009', 'ac000000-0000-0000-0000-000000000043',
    'published', now()
  ),
  (
    'ad000000-0000-0000-0000-000000000005',
    'Die besten Aktivitäten bei Regen',
    'die-besten-aktivitaeten-bei-regen',
    'Wenn der Wetterbericht nichts Gutes verspricht: Indoor-Ideen für die ganze Familie.',
    E'Demo-Inhalt: Dieser Artikel zeigt beispielhaft, wie ein FamVaya-Magazinbeitrag aussieht.\n\nErlebnisbäder, Indoor-Spielplätze und Aquarien retten viele verregnete Urlaubstage. Filtert in der FamVaya-Übersicht gezielt nach „schlechtwettertauglich", um nicht erst vor Ort zu merken, dass ein Ausflugsziel komplett im Freien liegt.\n\nAuch drinnen gilt: Beispiel-Gesamtpreise vorher prüfen, damit ein spontaner Regentag nicht teurer wird als geplant.',
    null, 'a3000000-0000-0000-0000-000000000011', 'ac000000-0000-0000-0000-000000000044',
    'published', now()
  ),
  (
    'ad000000-0000-0000-0000-000000000006',
    'Mikro-Abenteuer für jedes Wochenende',
    'mikro-abenteuer-fuer-jedes-wochenende',
    'Kleine, spontane Ideen, die aus einem gewöhnlichen Samstag etwas Besonderes machen.',
    E'Demo-Inhalt: Dieser Artikel zeigt beispielhaft, wie ein FamVaya-Magazinbeitrag aussieht.\n\nNicht jedes Wochenende braucht einen großen Ausflug. Mikro-Familienabenteuer wie eine Sternenbeobachtung im Garten oder eine Fotorallye durch die Nachbarschaft lassen sich ganz ohne Vorbereitung umsetzen.\n\nNutzt den Filter nach Vorbereitungsaufwand, um gezielt Ideen zu finden, die wirklich in fünf Minuten startklar sind.',
    null, 'a3000000-0000-0000-0000-000000000010', 'ac000000-0000-0000-0000-000000000045',
    'published', now()
  )
on conflict (id) do nothing;
