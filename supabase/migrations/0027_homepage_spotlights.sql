-- FamVaya — Admin-steuerbare Werbeflächen auf der Startseite ("Spotlights"),
-- z. B. für bezahlte Partnerschaften. Ein Slot in v1 (siehe DECISIONS.md).
--
-- content_type/content_id nutzen bewusst den bestehenden, 3-wertigen
-- content_type-Enum (Migration 0001/0007) für interne Links — passt
-- exakt, da Spotlights nur auf Unterkünfte/Aktivitäten/Mikro-Abenteuer
-- verlinken können, keine neue Content-Art einführen.
create table homepage_spotlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_text text not null,
  image_media_id uuid not null references media(id),
  link_type text not null check (link_type in ('internal', 'external')),
  content_type content_type,
  content_id uuid,
  external_url text,
  is_active boolean not null default false,
  is_sponsored boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homepage_spotlights_link_check check (
    (link_type = 'internal' and content_type is not null and content_id is not null and external_url is null)
    or
    (link_type = 'external' and external_url is not null and content_type is null and content_id is null)
  )
);
create trigger homepage_spotlights_set_updated_at
  before update on homepage_spotlights
  for each row execute function set_updated_at();
create index homepage_spotlights_active_idx on homepage_spotlights(is_active);
alter table homepage_spotlights enable row level security;
