-- FamVaya Phase 0 — Favoriten, Bewertungen, Magazin (Spec §20, §15.2, §16, §17)

create table favorite_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean not null default false,
  share_token uuid unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);
create index favorite_collections_user_idx on favorite_collections(user_id);

-- collection_id = null bedeutet "Meine Favoriten" (Standardliste, Spec §15.2)
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  content_type content_type not null,
  content_id uuid not null,
  collection_id uuid references favorite_collections(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, content_type, content_id, collection_id)
);
create index favorites_user_idx on favorites(user_id);
create index favorites_content_idx on favorites(content_type, content_id);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  content_type content_type not null,
  content_id uuid not null,
  rating_overall integer not null check (rating_overall between 1 and 5),
  rating_large_family integer check (rating_large_family between 1 and 5),
  rating_value integer check (rating_value between 1 and 5),
  rating_child_friendly integer check (rating_child_friendly between 1 and 5),
  family_size text,
  children_age_groups text[] not null default '{}',
  review_text text,
  -- ASSUMPTION: Spec §16 verlangt nur "muss moderiert werden können", keine
  -- konkreten Statuswerte — an content_status angelehnt, aber eigenständig,
  -- da Reviews kein Redaktions-Workflow, sondern eine Moderationswarteschlange
  -- sind (siehe DECISIONS.md).
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
create index reviews_content_idx on reviews(content_type, content_id);
create index reviews_status_idx on reviews(status);

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  author_id uuid references users(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  cover_media_id uuid references media(id) on delete set null,
  status content_status not null default 'draft',
  seo_title text,
  meta_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger articles_set_updated_at
  before update on articles
  for each row execute function set_updated_at();
create index articles_status_idx on articles(status);
create index articles_published_at_idx on articles(published_at);
create index articles_category_idx on articles(category_id);
