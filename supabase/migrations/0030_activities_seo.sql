-- FamVaya: eigene SEO-Felder für Familienaktivitäten (analog 0028 für
-- Mikro-Abenteuer). Leer = Fallback auf Titel bzw. Kurzbeschreibung.
alter table activities
  add column seo_title text,
  add column meta_description text;
