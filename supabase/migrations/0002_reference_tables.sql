-- FamVaya Phase 0 — Referenz-/Stammdaten-Tabellen (Spec §20)
-- Keine dieser Tabellen referenziert Content-Tabellen, daher zuerst angelegt.

create table countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table regions (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (country_id, slug)
);
create index regions_country_id_idx on regions(country_id);

-- Lückenschluss: von accommodations.accommodation_type_id referenziert
-- (Spec §20), aber im Spec-Dokument selbst nie als eigene Tabelle definiert.
-- Siehe DECISIONS.md. Werte orientieren sich an der Liste in Spec §3.1.
create table accommodation_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  content_type category_content_type not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (content_type, slug)
);
create index categories_content_type_idx on categories(content_type);

create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  group_name text,
  icon text
);

create table activity_features (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  group_name text,
  icon text
);

create table age_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_age integer not null,
  max_age integer not null,
  sort_order integer not null default 0,
  check (max_age >= min_age)
);

create table providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  website text,
  affiliate_network text,
  contact_email text,
  -- Kein eigenes Enum: providers sind kein "Content" mit Redaktionsworkflow
  -- (content_status passt semantisch nicht), daher schlanker CHECK.
  status text not null default 'active' check (status in ('active', 'inactive', 'pending')),
  created_at timestamptz not null default now()
);
