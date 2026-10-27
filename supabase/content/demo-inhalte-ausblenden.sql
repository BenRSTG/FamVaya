-- FamVaya: Demo-Inhalte aus dem Seed (supabase/seed.sql) ausblenden.
--
-- Setzt alle Seed-Demo-Einträge auf ENTWURF. Sie verschwinden damit von der
-- Website, aus der Sitemap und aus den strukturierten Daten (Google). Es wird
-- nichts gelöscht; rückgängig machbar (siehe Ende der Datei).
--
-- Erkennung der Demo-Einträge:
--   Unterkünfte, Aktivitäten, Mikro-Abenteuer: Titel beginnt mit "[Demo]"
--   Magazinartikel: Text beginnt mit "Demo-Inhalt:"
-- Einträge, die du im Admin umbenannt/neu geschrieben hast (Titel ohne
-- "[Demo]"), bleiben unberührt.

-- 1) VORSCHAU: Das wird gleich ausgeblendet (zuerst nur diesen Block ausführen
--    und prüfen, ob etwas dabei ist, das du behalten willst).
select 'unterkunft' as bereich, title, status from accommodations where title like '[Demo]%' and status = 'published'
union all
select 'aktivitaet', title, status from activities where title like '[Demo]%' and status = 'published'
union all
select 'mikro-abenteuer', title, status from micro_adventures where title like '[Demo]%' and status = 'published'
union all
select 'artikel', title, status from articles where content like 'Demo-Inhalt:%' and status = 'published'
order by 1, 2;

-- 2) AUSBLENDEN
update accommodations  set status = 'draft' where title like '[Demo]%' and status = 'published';
update activities      set status = 'draft' where title like '[Demo]%' and status = 'published';
update micro_adventures set status = 'draft' where title like '[Demo]%' and status = 'published';
update articles        set status = 'draft' where content like 'Demo-Inhalt:%' and status = 'published';

-- 3) KONTROLLE: danach sollte hier überall 0 stehen
select
  (select count(*) from accommodations   where title like '[Demo]%' and status = 'published') as unterkuenfte,
  (select count(*) from activities       where title like '[Demo]%' and status = 'published') as aktivitaeten,
  (select count(*) from micro_adventures where title like '[Demo]%' and status = 'published') as mikro_abenteuer,
  (select count(*) from articles         where content like 'Demo-Inhalt:%' and status = 'published') as artikel;

-- RÜCKGÄNGIG (nur falls nötig):
--   update accommodations   set status = 'published' where title like '[Demo]%';
--   update activities       set status = 'published' where title like '[Demo]%';
--   update micro_adventures set status = 'published' where title like '[Demo]%';
--   update articles         set status = 'published' where content like 'Demo-Inhalt:%';
