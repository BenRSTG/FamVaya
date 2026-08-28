-- FamVaya — Anbieter-Vorstellung auf Detailseiten: Logo + Bildergalerie.
-- Eigene provider_media-Tabelle statt Erweiterung des 3-wertigen
-- content_type-Enums (siehe DECISIONS.md) — konsistent mit der
-- Entscheidung, Artikel/Instagram/Newsletter ebenfalls nicht über den
-- Enum, sondern eigene Strukturen abzubilden.
alter table providers
  add column logo_media_id uuid references media(id) on delete set null;

create table provider_media (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers(id) on delete cascade,
  media_id uuid not null references media(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index provider_media_provider_idx on provider_media(provider_id);
