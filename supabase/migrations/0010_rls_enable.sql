-- FamVaya Phase 0 — Row Level Security aktivieren, Policies folgen in Phase 4.
--
-- WICHTIG: RLS wird hier aktiviert OHNE jegliche Policy anzulegen. In Postgres
-- bedeutet "RLS enabled + keine Policy" = kein Zugriff für anon/authenticated
-- Rollen, nur service_role (mit BYPASSRLS) kommt durch. Das ist bewusst die
-- sicherere Lesart von "Policies noch offen lassen" aus dem Kickoff-Prompt:
-- eine Platzhalter-Policy `using (true)` würde PII-nahe Tabellen wie
-- family_profiles und reviews sofort öffentlich lesbar machen, sobald ein
-- echter anon key verbunden wird. Siehe DECISIONS.md.

alter table users enable row level security;
alter table family_profiles enable row level security;
alter table countries enable row level security;
alter table regions enable row level security;
alter table accommodation_types enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table amenities enable row level security;
alter table activity_features enable row level security;
alter table age_groups enable row level security;
alter table providers enable row level security;
alter table accommodations enable row level security;
alter table activities enable row level security;
alter table micro_adventures enable row level security;
alter table accommodation_amenities enable row level security;
alter table activity_feature_links enable row level security;
alter table content_age_groups enable row level security;
alter table content_tags enable row level security;
alter table media enable row level security;
alter table content_media enable row level security;
alter table favorite_collections enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;
alter table articles enable row level security;
alter table newsletter_subscribers enable row level security;
alter table outbound_clicks enable row level security;
alter table search_events enable row level security;
alter table alerts enable row level security;
