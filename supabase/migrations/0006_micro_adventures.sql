-- FamVaya Phase 0 — Mikro-Familienabenteuer (Spec §20, §3.3, §12)

create table micro_adventures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  category_id uuid references categories(id) on delete set null,

  duration_min integer check (duration_min >= 0),
  duration_max integer check (duration_max >= 0),
  -- ASSUMPTION: Spec definiert keine festen Werte für cost_level /
  -- preparation_level / difficulty_level — Abstufungen an Spec §3.3/§13
  -- angelehnt, siehe DECISIONS.md.
  cost_level text check (cost_level in ('free', 'low', 'medium', 'high')),
  estimated_total_cost numeric(10, 2),
  preparation_level text check (preparation_level in ('none', 'light', 'moderate')),
  difficulty_level text check (difficulty_level in ('easy', 'medium', 'hard')),
  indoor boolean not null default false,
  outdoor boolean not null default false,
  seasonal_tags text[] not null default '{}',
  weather_tags text[] not null default '{}',
  materials text[] not null default '{}',
  instructions text,
  safety_notes text,

  latitude double precision,
  longitude double precision,
  -- true = freie Idee ohne festen Ort (z. B. "Zelten im eigenen Garten")
  location_optional boolean not null default true,

  external_url text,
  affiliate_url text,

  status content_status not null default 'draft',
  featured boolean not null default false,

  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger micro_adventures_set_updated_at
  before update on micro_adventures
  for each row execute function set_updated_at();

create index micro_adventures_status_idx on micro_adventures(status);
create index micro_adventures_featured_idx on micro_adventures(featured);
create index micro_adventures_published_at_idx on micro_adventures(published_at);
create index micro_adventures_category_idx on micro_adventures(category_id);
