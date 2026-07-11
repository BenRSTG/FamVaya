-- FamVaya Phase 0 — Newsletter, Tracking, Alerts (Spec §20, §23, §27)

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  city text,
  children_count integer check (children_count >= 0),
  interests text[] not null default '{}',
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

-- outbound_clicks und search_events bleiben laut Vorgabe vollständig
-- polymorph ohne FK auf content_id (siehe DECISIONS.md). user_id/provider_id
-- erhalten echte FKs, da sie auf feststehende Tabellen zeigen.
create table outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  content_type content_type not null,
  content_id uuid not null,
  provider_id uuid references providers(id) on delete set null,
  target_url text not null,
  session_id text,
  created_at timestamptz not null default now()
);
create index outbound_clicks_content_idx on outbound_clicks(content_type, content_id);
create index outbound_clicks_provider_idx on outbound_clicks(provider_id);
create index outbound_clicks_created_at_idx on outbound_clicks(created_at);

create table search_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  query text,
  filters jsonb not null default '{}'::jsonb,
  result_count integer,
  created_at timestamptz not null default now()
);
create index search_events_created_at_idx on search_events(created_at);

-- ASSUMPTION: Spec §31 (Phase 2) nennt "Deal- und Ideenalarme" nur als
-- Konzept, ohne feste Werte für alert_type/frequency — als text modelliert,
-- damit spätere Phasen die Werte frei definieren können (siehe DECISIONS.md).
create table alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  alert_type text not null,
  filters jsonb not null default '{}'::jsonb,
  frequency text not null default 'weekly' check (frequency in ('daily', 'weekly', 'monthly')),
  active boolean not null default true,
  last_sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index alerts_user_idx on alerts(user_id);
create index alerts_active_idx on alerts(active);
