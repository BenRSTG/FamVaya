-- FamVaya Phase 12 — Besucher- & Nutzungs-Reporting im Admin-Bereich.
--
-- page_views: first-party Seitenaufruf-Erfassung, ergänzt Vercel Web
-- Analytics (läuft seit Phase 6 parallel weiter, siehe DECISIONS.md).
-- session_id kommt aus sessionStorage im Browser, NICHT aus einem Cookie
-- (der bestehende Cookie-Consent-Banner verspricht "cookie-freie
-- Nutzungsstatistiken" — das soll wörtlich stimmen bleiben).
--
-- matcher_submissions: jede Eingabe im Schnellen Familien-Check
-- (components/quick-family-check.tsx), unabhängig vom Ergebnis — bewusst
-- getrennt von search_events, das ausschließlich Suchen OHNE Treffer
-- protokolliert (andere Semantik).

create table page_views (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);
create index page_views_session_idx on page_views(session_id);
create index page_views_created_at_idx on page_views(created_at);
alter table page_views enable row level security;

create table matcher_submissions (
  id uuid primary key default gen_random_uuid(),
  adults integer not null,
  children integer not null,
  area text not null check (area in ('unterkunft', 'aktivitaet', 'mikroabenteuer', 'unentschlossen')),
  created_at timestamptz not null default now()
);
create index matcher_submissions_created_at_idx on matcher_submissions(created_at);
alter table matcher_submissions enable row level security;
