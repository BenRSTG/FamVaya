-- FamVaya — eigene SEO-Felder für Mikro-Abenteuer (analog zu articles, das
-- seo_title/meta_description seit 0008 hat). Bisher diente short_description
-- als Meta-Description und title als Seitentitel; mit eigenen Feldern lässt
-- sich beides für Suchmaschinen optimieren, ohne den sichtbaren Text zu ändern.
alter table micro_adventures
  add column seo_title text,
  add column meta_description text;
