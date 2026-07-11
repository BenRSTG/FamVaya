-- FamVaya Phase 0 — Extensions & Enums
-- Siehe DECISIONS.md für die Begründung der Enum- vs. CHECK-Strategie.

create extension if not exists pgcrypto;

-- Rollen laut Spec §19 (Nutzerkonten) und §18 (Admin-Bereich)
create type user_role as enum ('user', 'editor', 'admin', 'provider');

-- Content-Status laut Spec §18.2
create type content_status as enum (
  'draft',
  'in_review',
  'published',
  'paused',
  'archived'
);

-- Für polymorphe Verknüpfungstabellen (favorites, content_media, content_tags,
-- content_age_groups, reviews, outbound_clicks, search_events). Ein
-- ENUM-typisierter content_id-Nachbar ersetzt hier bewusst FK + CHECK
-- (siehe DECISIONS.md).
create type content_type as enum ('accommodation', 'activity', 'micro_adventure');

-- Kategorien decken zusätzlich Magazinartikel ab (Spec §17), daher ein
-- eigenes, breiteres Enum nur für categories.content_type.
create type category_content_type as enum (
  'accommodation',
  'activity',
  'micro_adventure',
  'article'
);

-- Wiederverwendbarer Trigger für updated_at-Spalten.
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
