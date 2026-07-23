-- FamVaya Phase 11 — Instagram-Post-Generator (Admin-Erweiterung).
--
-- Generierte Bilder werden NICHT über content_media mit dem Inserat
-- verknüpft (media_id zeigt zwar auf die media-Tabelle, aber es ist eine
-- abgeleitete Werbegrafik, kein Content-Foto — soll nicht in der
-- Foto-Galerie/Titelbild-Auswahl des Inserats auftauchen, siehe
-- DECISIONS.md).
--
-- content_id referenziert bewusst keine Fremdschlüssel auf vier
-- verschiedene Tabellen (accommodations/activities/micro_adventures/
-- articles) — polymorphe Referenz ohne FK-Constraint, gleiches Muster
-- wie content_media/content_tags (siehe 0007_polymorphic_links_and_media.sql).

create table instagram_posts (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('accommodation', 'activity', 'micro_adventure', 'article')),
  content_id uuid not null,
  media_id uuid references media(id) on delete set null,
  caption text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'failed')),
  instagram_media_id text,
  error_message text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index instagram_posts_content_idx on instagram_posts(content_type, content_id);

create trigger instagram_posts_set_updated_at
  before update on instagram_posts
  for each row execute function set_updated_at();

alter table instagram_posts enable row level security;
