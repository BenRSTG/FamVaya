-- FamVaya Phase 7 — Family Fit Score für Mikro-Abenteuer + Reality Check
-- (externes Vision-Dokument "Phase 2 – Vision schärfen", Aufgaben 2+3).
--
-- family_rating existierte bisher nur auf accommodations/activities
-- (0004/0005) — für eine konsistente "FamVaya Family Fit"-Badge auf allen
-- drei Content-Typen zieht micro_adventures hier nach, gleiche Definition.
--
-- pros/cons bilden den zweispaltigen "Das spricht dafür" / "Das solltet
-- ihr wissen"-Block auf den Detailseiten ab — manuell im Admin gepflegt,
-- keine Automatisierung (siehe DECISIONS.md). text[] not null default '{}'
-- folgt der bestehenden Konvention von micro_adventures.materials
-- (0006_micro_adventures.sql), statt nullable Arrays.

alter table micro_adventures
  add column family_rating integer check (family_rating between 0 and 100);

alter table accommodations
  add column pros text[] not null default '{}',
  add column cons text[] not null default '{}';

alter table activities
  add column pros text[] not null default '{}',
  add column cons text[] not null default '{}';

alter table micro_adventures
  add column pros text[] not null default '{}',
  add column cons text[] not null default '{}';
