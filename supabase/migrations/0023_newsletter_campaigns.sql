-- FamVaya Phase 14 — Newsletter-Bereich im Admin.
--
-- unsubscribe_token: pseudonymer Token für den öffentlichen Abmelde-Link
-- (app/newsletter/abmelden), damit die E-Mail-Adresse nicht im Klartext
-- in der URL steht.
alter table newsletter_subscribers
  add column unsubscribe_token uuid not null default gen_random_uuid();

-- content_type/content_id bewusst nullable (anders als instagram_posts):
-- Kampagnen können auch frei ohne Inserats-Bezug erstellt werden, siehe
-- DECISIONS.md.
--
-- Gespeichert werden die strukturierten Bausteine (subject/intro_text/
-- teaser), nicht fertiges HTML — das E-Mail-HTML wird bei jeder Vorschau
-- und beim Versand frisch gerendert (lib/newsletter/template.ts). Sonst
-- würde ein Bearbeiten von Betreff/Text nach dem Erzeugen aus einem
-- Inserat den Teaser (Bild/Titel/Link) aus dem gespeicherten HTML wieder
-- verlieren.
create table newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  content_type text check (content_type in ('accommodation', 'activity', 'micro_adventure', 'article')),
  content_id uuid,
  intro_text text not null,
  teaser jsonb,
  status text not null default 'draft' check (status in ('draft', 'sent', 'failed')),
  recipient_count integer,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index newsletter_campaigns_content_idx on newsletter_campaigns(content_type, content_id);
create trigger newsletter_campaigns_set_updated_at
  before update on newsletter_campaigns
  for each row execute function set_updated_at();
alter table newsletter_campaigns enable row level security;
