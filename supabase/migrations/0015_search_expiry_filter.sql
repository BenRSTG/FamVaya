-- FamVaya Phase 5 — Automatisches Ablaufdatum (Spec §20, Bauplan_2.md Phase 5).
--
-- Abgelaufene Unterkünfte/Aktivitäten (status='published' UND expires_at in
-- der Vergangenheit) sollen aus Übersichten, Startseite UND globaler Suche
-- verschwinden, bleiben aber unter ihrer URL erreichbar (SEO/Detailseite
-- zeigt stattdessen einen Ablauf-Hinweis, siehe app/*/[slug]/page.tsx).
-- micro_adventures hat kein expires_at (siehe supabase/migrations/0006_*.sql),
-- daher hier unverändert.

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
    and (expires_at is null or expires_at > now())
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
    and (expires_at is null or expires_at > now())
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
