-- FamVaya — "Persönlich getestet"-Badge auf dem FamVaya-Familiencheck.
-- Vorstufe zu einem geplanten Bronze/Silber/Gold-Qualitätssiegel (siehe
-- DECISIONS.md) — bewusst erstmal nur ein einfaches Ja/Nein-Flag.
alter table accommodations
  add column personally_tested boolean not null default false;
alter table activities
  add column personally_tested boolean not null default false;
alter table micro_adventures
  add column personally_tested boolean not null default false;
