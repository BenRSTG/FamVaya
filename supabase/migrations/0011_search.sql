-- FamVaya Phase 3 — Globale Suche (Spec §14, Bauplan_2.md Phase 3)
--
-- pg_trgm war in Phase 0 bewusst zurückgestellt ("deferred to the later
-- search phase", siehe DECISIONS.md) — das ist jetzt.

create extension if not exists pg_trgm;

-- === Volltextsuche + Trigram je Content-Tabelle ============================
-- Gewichtung: Titel (A) > Ort (B) > Kurzbeschreibung (C) > Beschreibung (D).

alter table accommodations add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('german', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('german', coalesce(city, '')), 'B') ||
    setweight(to_tsvector('german', coalesce(short_description, '')), 'C') ||
    setweight(to_tsvector('german', coalesce(full_description, '')), 'D')
  ) stored;
create index accommodations_search_vector_idx on accommodations using gin(search_vector);
create index accommodations_title_trgm_idx on accommodations using gin(title gin_trgm_ops);

alter table activities add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('german', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('german', coalesce(city, '')), 'B') ||
    setweight(to_tsvector('german', coalesce(short_description, '')), 'C') ||
    setweight(to_tsvector('german', coalesce(full_description, '')), 'D')
  ) stored;
create index activities_search_vector_idx on activities using gin(search_vector);
create index activities_title_trgm_idx on activities using gin(title gin_trgm_ops);

-- micro_adventures hat keine city-Spalte (Spec §20).
alter table micro_adventures add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('german', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('german', coalesce(short_description, '')), 'C') ||
    setweight(to_tsvector('german', coalesce(full_description, '')), 'D')
  ) stored;
create index micro_adventures_search_vector_idx on micro_adventures using gin(search_vector);
create index micro_adventures_title_trgm_idx on micro_adventures using gin(title gin_trgm_ops);

-- === Vereinigte Such-Funktion ================================================
-- ASSUMMPTION: Der in der Spec geforderte vierte Suchbereich "Magazin"
-- (articles) ist hier NICHT als UNION-Arm vorbereitet: content_type ist ein
-- 3-wertiges Enum (accommodation/activity/micro_adventure), 'article' würde
-- eine Enum-Erweiterung erfordern. Da articles aktuell keine veröffentlichten
-- Inhalte hat (Magazin kommt erst Phase 6), wird das dann nachgezogen. Siehe
-- DECISIONS.md.
--
-- "sql stable" (nicht "security definer"): die Funktion läuft mit den
-- Rechten der aufrufenden Rolle. Aufgerufen wird sie ausschließlich über
-- lib/supabase/admin.ts (service_role, umgeht RLS ohnehin) — kein
-- "grant ... to anon" nötig, konsistent mit der bisherigen Sicherheitslinie.

create or replace function search_all_content(search_query text)
returns table (
  content_type content_type,
  id uuid,
  title text,
  slug text,
  short_description text,
  city text,
  rank real
)
language sql stable as $$
  select
    'accommodation'::content_type as content_type,
    id, title, slug, short_description, city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + similarity(title, search_query) as rank
  from accommodations
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or title % search_query
    )
  union all
  select
    'activity'::content_type,
    id, title, slug, short_description, city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + similarity(title, search_query)
  from activities
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or title % search_query
    )
  union all
  select
    'micro_adventure'::content_type,
    id, title, slug, short_description, null::text as city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + similarity(title, search_query)
  from micro_adventures
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or title % search_query
    )
  order by rank desc
  limit 60;
$$;
