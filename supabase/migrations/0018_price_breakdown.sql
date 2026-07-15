-- FamVaya Phase 9 — Preis-Aufschlüsselung für Unterkünfte
-- (externes Vision-Dokument "Phase 2.5 – Politur & Vertrauen", Aufgabe 5).
--
-- example_nights macht Preis/Nacht aus example_total_price berechenbar, ohne
-- ein neues Personenzahl-Feld: Preis/Person nutzt das bereits vorhandene
-- max_guests (Vollauslastung) statt eines weiteren Freitext-Felds nur für
-- diese eine Beispielrechnung (siehe DECISIONS.md).
--
-- value_tier ist eine manuell gepflegte, qualitative Preis-Leistungs-
-- Einordnung — gleiches text-check-Muster wie micro_adventures.cost_level
-- (0006_micro_adventures.sql), keine automatische Kategorisierung.

alter table accommodations
  add column example_nights integer check (example_nights > 0),
  add column value_tier text check (value_tier in ('budget', 'fair', 'good_value', 'premium'));
