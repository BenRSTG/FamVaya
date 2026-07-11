-- FamVaya Phase 0 — Verknüpfungstabellen & Medien (Spec §20)

create table accommodation_amenities (
  accommodation_id uuid not null references accommodations(id) on delete cascade,
  amenity_id uuid not null references amenities(id) on delete cascade,
  primary key (accommodation_id, amenity_id)
);
create index accommodation_amenities_amenity_idx on accommodation_amenities(amenity_id);

create table activity_feature_links (
  activity_id uuid not null references activities(id) on delete cascade,
  feature_id uuid not null references activity_features(id) on delete cascade,
  primary key (activity_id, feature_id)
);
create index activity_feature_links_feature_idx on activity_feature_links(feature_id);

-- Polymorphe Verknüpfungen: content_type ist ein ENUM (accommodation/activity/
-- micro_adventure), content_id bewusst ohne FK (siehe DECISIONS.md für den
-- Trade-off Geschwindigkeit vs. referenzielle Integrität).

create table content_age_groups (
  content_type content_type not null,
  content_id uuid not null,
  age_group_id uuid not null references age_groups(id) on delete cascade,
  primary key (content_type, content_id, age_group_id)
);
create index content_age_groups_content_idx on content_age_groups(content_type, content_id);

create table content_tags (
  content_type content_type not null,
  content_id uuid not null,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (content_type, content_id, tag_id)
);
create index content_tags_content_idx on content_tags(content_type, content_id);

create table media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_text text,
  copyright_text text,
  source_url text,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table content_media (
  content_type content_type not null,
  content_id uuid not null,
  media_id uuid not null references media(id) on delete cascade,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  primary key (content_type, content_id, media_id)
);
create index content_media_content_idx on content_media(content_type, content_id);
-- Höchstens ein Titelbild pro Content-Item.
create unique index content_media_one_cover_idx
  on content_media(content_type, content_id)
  where is_cover;
