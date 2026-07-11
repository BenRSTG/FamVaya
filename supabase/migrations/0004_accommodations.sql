-- FamVaya Phase 0 — Familienunterkünfte (Spec §20, §3.1, §10)

create table accommodations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  accommodation_type_id uuid references accommodation_types(id) on delete set null,
  provider_id uuid references providers(id) on delete set null,
  country_id uuid references countries(id) on delete set null,
  region_id uuid references regions(id) on delete set null,
  city text,
  postal_code text,
  latitude double precision,
  longitude double precision,

  -- Kapazität (Spec §2: "Large Families First" — keine Obergrenze von 4 Personen annehmen)
  max_guests integer check (max_guests >= 0),
  max_adults integer check (max_adults >= 0),
  max_children integer check (max_children >= 0),
  bedrooms integer check (bedrooms >= 0),
  bathrooms integer check (bathrooms >= 0),
  beds integer check (beds >= 0),
  living_area numeric(8, 2),

  -- Preis (Spec §22: möglichst Gesamtpreis statt irreführender Einzelpreise)
  price_from numeric(10, 2),
  price_type text check (price_type in ('per_night', 'total')),
  currency text not null default 'EUR',
  example_family_size text,
  example_total_price numeric(10, 2),

  affiliate_url text,
  external_url text,

  status content_status not null default 'draft',
  featured boolean not null default false,
  -- Großfamilien-Eignungs-Score 0-100, redaktionelle Orientierung (Spec §21)
  family_rating integer check (family_rating between 0 and 100),

  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger accommodations_set_updated_at
  before update on accommodations
  for each row execute function set_updated_at();

create index accommodations_status_idx on accommodations(status);
create index accommodations_featured_idx on accommodations(featured);
create index accommodations_published_at_idx on accommodations(published_at);
create index accommodations_country_region_idx on accommodations(country_id, region_id);
create index accommodations_accommodation_type_idx on accommodations(accommodation_type_id);
create index accommodations_provider_idx on accommodations(provider_id);
