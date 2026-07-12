-- FamVaya Phase 3 — Fix: Tippfehlertoleranz griff nicht (Bugfix zu 0011).
--
-- Bug: `title % search_query` nutzt similarity(), die den KOMPLETTEN
-- (langen) Titel gegen das kurze Suchwort vergleicht — bei mehrteiligen
-- Titeln liegt der Score dadurch fast immer unter dem Default-Threshold
-- (0.3), selbst bei einem einzelnen Buchstabendreher. Getestet mit
-- "Ferinhaus" statt "Ferienhaus": 0 Treffer statt 1.
--
-- Fix: word_similarity()/`<%` statt similarity()/`%` — sucht die beste
-- Teilwort-Übereinstimmung *innerhalb* des Titels statt den ganzen String
-- zu vergleichen. 0011 bleibt unverändert als Protokoll dessen, was
-- tatsächlich ausgeführt wurde (siehe DECISIONS.md).

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
      + word_similarity(search_query, title) as rank
  from accommodations
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or search_query <% title
    )
  union all
  select
    'activity'::content_type,
    id, title, slug, short_description, city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + word_similarity(search_query, title)
  from activities
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or search_query <% title
    )
  union all
  select
    'micro_adventure'::content_type,
    id, title, slug, short_description, null::text as city,
    ts_rank(search_vector, websearch_to_tsquery('german', search_query))
      + word_similarity(search_query, title)
  from micro_adventures
  where status = 'published'
    and (
      search_vector @@ websearch_to_tsquery('german', search_query)
      or search_query <% title
    )
  order by rank desc
  limit 60;
$$;
