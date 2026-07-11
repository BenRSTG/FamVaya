-- FamVaya Phase 0 — Nutzer & Familienprofile (Spec §20, §15.1)
-- users.id referenziert auth.users(id): das ist Standard-Supabase-Schema-Design
-- (Identität lebt in auth.users), keine Auth-Flow-Implementierung in Phase 0.

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role user_role not null default 'user',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger users_set_updated_at
  before update on users
  for each row execute function set_updated_at();

-- Sensible Kinderdaten minimieren (Spec §15.1): children_age_groups speichert
-- grobe Altersgruppen-Labels, kein vollständiges Geburtsdatum.
create table family_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  adults_count integer not null default 2 check (adults_count >= 0),
  children_count integer not null default 0 check (children_count >= 0),
  children_age_groups text[] not null default '{}',
  city text,
  postal_code text,
  latitude double precision,
  longitude double precision,
  max_budget numeric(10, 2),
  preferred_distance integer,
  interests text[] not null default '{}',
  accessibility_needs text,
  has_pet boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);
create trigger family_profiles_set_updated_at
  before update on family_profiles
  for each row execute function set_updated_at();
create index family_profiles_user_id_idx on family_profiles(user_id);
