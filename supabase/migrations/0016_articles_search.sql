-- FamVaya Phase 6 — Magazinartikel in die globale Suche aufnehmen (Spec §14/§17).
--
-- content_type ist ein 3-wertiges Enum (accommodation/activity/micro_adventure,
-- siehe 0011_search.sql). Eine Enum-Erweiterung um 'article' würde auch die
-- polymorphen Verknüpfungstabellen (content_tags, content_age_groups,
-- content_media, outbound_clicks, search_events) betreffen — Artikel
-- bekommen aber bewusst keine Tag-/Content-Verknüpfung (siehe DECISIONS.md).
-- Stattdessen wird die Rückgabespalte der Suchfunktion von content_type
-- (Enum) auf text umgestellt. Eine Rückgabetyp-Änderung erfordert
-- drop+create statt create or replace.

drop function if exists search_all_content(text);

alter table articles add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('german', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('german', coalesce(excerpt, '')), 'C') ||
    setweight(to_tsvector('german', coalesce(content, '')), 'D')
  ) stored;
create index articles_search_vector_idx on articles using gin(search_vector);
create index articles_title_trgm_idx on articles using gin(title gin_trgm_ops);

create function search_all_content(search_query text)
returns table (
  content_type text,
  id uuid,
  title text,
  slug text,
  short_description text,
  city text,
  rank real
)
language sql stable as $$
  select
    'accommodation'::text as content_type,
    id, title, slug, short_description, city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + word_similarity(search_query, title) as rank
  from accommodations
  where status = 'published'
    and (expires_at is null or expires_at > now())
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or search_query <% title
    )
  union all
  select
    'activity'::text,
    id, title, slug, short_description, city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + word_similarity(search_query, title)
  from activities
  where status = 'published'
    and (expires_at is null or expires_at > now())
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or search_query <% title
    )
  union all
  select
    'micro_adventure'::text,
    id, title, slug, short_description, null::text as city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + word_similarity(search_query, title)
  from micro_adventures
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or search_query <% title
    )
  union all
  select
    'article'::text,
    id, title, slug, excerpt as short_description, null::text as city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + word_similarity(search_query, title)
  from articles
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or search_query <% title
    )
  order by rank desc
  limit 60;
$$;
