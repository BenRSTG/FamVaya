-- FamVaya Phase 10 — Preisdarstellung als Richtwert statt Fixpreis
-- (externes Vision-Dokument "Phase 2.5 Fortsetzung", Teil B).
--
-- price_checked_at ist ein manuell im Admin gepflegtes Datum ("Stand: ...").
-- Bewusst eine eigene Spalte statt updated_at wiederzuverwenden: updated_at
-- ändert sich bei jeder Bearbeitung (z. B. Reality-Check-Text), das würde
-- ein falsches "zuletzt geprüft"-Datum für den Preis suggerieren.

alter table accommodations add column price_checked_at date;
alter table activities add column price_checked_at date;
alter table micro_adventures add column price_checked_at date;
