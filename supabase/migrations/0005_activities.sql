-- FamVaya Phase 0 — Familienaktivitäten (Spec §20, §3.2, §11)

create table activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  -- Fachlich sollte category_id auf eine Kategorie mit content_type='activity'
  -- zeigen; das wird in Phase 0 nicht per DB-Constraint erzwungen (siehe
  -- DECISIONS.md), sondern bleibt Aufgabe der Admin-Formulare (Phase 4).
  category_id uuid references categories(id) on delete set null,
  provider_id uuid references providers(id) on delete set null,
  country_id uuid references countries(id) on delete set null,
  region_id uuid references regions(id) on delete set null,
  city text,
  latitude double precision,
  longitude double precision,

  duration_min integer check (duration_min >= 0),
  duration_max integer check (duration_max >= 0),
  indoor boolean not null default false,
  outdoor boolean not null default false,
  weather_suitable boolean not null default true,

  adult_price numeric(10, 2),
  child_price numeric(10, 2),
  example_total_price numeric(10, 2),
  family_ticket boolean not null default false,
  large_family_discount boolean not null default false,
  booking_required boolean not null default false,

  affiliate_url text,
  external_url text,

  status content_status not null default 'draft',
  featured boolean not null default false,
  family_rating integer check (family_rating between 0 and 100),

  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger activities_set_updated_at
  before update on activities
  for each row execute function set_updated_at();

create index activities_status_idx on activities(status);
create index activities_featured_idx on activities(featured);
create index activities_published_at_idx on activities(published_at);
create index activities_country_region_idx on activities(country_id, region_id);
create index activities_category_idx on activities(category_id);
create index activities_provider_idx on activities(provider_id);
