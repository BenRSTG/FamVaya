-- FamVaya Phase 13 — Einheitliches Ebene-2-Events-Table (Analytics & Reporting)
-- Ersetzt page_views/matcher_submissions (Phase 12) und search_events (Phase 7)
-- als Schreibziel; alte Tabellen bleiben unangetastet (siehe DECISIONS.md).

create table events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'page_view', 'matcher_submit', 'filter_applied', 'listing_viewed',
    'cta_clicked', 'zero_result_search', 'newsletter_signup', 'favorite_added'
  )),
  session_id uuid,
  page_path text,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  referrer_domain text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop')),
  country text,
  created_at timestamptz not null default now()
);
create index events_type_created_idx on events(event_type, created_at);
create index events_session_idx on events(session_id);
create index events_entity_idx on events(entity_type, entity_id);
alter table events enable row level security;
