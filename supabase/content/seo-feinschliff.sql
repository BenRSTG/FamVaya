-- FamVaya: Feinschliff nach dem Veröffentlichen (Oktober 2026).
--
-- 1) Bild-Alt-Texte: Bei vielen Mikro-Abenteuern steht als Alt-Text der englische
--    Suchbegriff "kids reading flashlight blanket night" (stammt von einem
--    kopierten Eintrag). Das schadet der Barrierefreiheit und der Bildersuche.
--    Hier bekommt jedes Bild den Titel seines Abenteuers als Alt-Text; die
--    Lesenacht bekommt eine echte Bildbeschreibung. Feinere Beschreibungen
--    ("Kinder bauen ...") kannst du jederzeit im Admin ergänzen.
update media m
set alt_text = a.title || ' – Mikro-Abenteuer für Familien'
from content_media cm
join micro_adventures a on a.id = cm.content_id
where cm.media_id = m.id
  and cm.content_type = 'micro_adventure'
  and m.alt_text = 'kids reading flashlight blanket night'
  and a.slug <> 'lesenacht-mit-taschenlampe';

update media m
set alt_text = 'Kinder lesen unter einer Decke im Licht von Taschenlampen'
from content_media cm
join micro_adventures a on a.id = cm.content_id
where cm.media_id = m.id
  and cm.content_type = 'micro_adventure'
  and m.alt_text = 'kids reading flashlight blanket night'
  and a.slug = 'lesenacht-mit-taschenlampe';

-- 2) Zu lange SEO-Titel und zu kurze/lange Meta-Beschreibungen (Google schneidet ab).
update micro_adventures set seo_title = 'Zeitkapsel vergraben: Familienprojekt mit Kindern' where slug = 'familien-zeitkapsel';
update articles set seo_title = 'Ausflüge mit Kindern bei Regen: 30 Ideen' where slug = 'ausfluege-mit-kindern-bei-regen';
update micro_adventures set meta_description = 'Familien-Fotorallye: Mit einer Motivliste die Nachbarschaft neu entdecken. Anleitung, Regeln und Tipps für Familien mit mehreren Kindern.' where slug = 'familien-fotorallye';
update micro_adventures set meta_description = 'Regenpfützen-Expedition: Mit Gummistiefeln und einer Regen-Challenge durch die Pfützen der Nachbarschaft. Ideen und Tipps für Familien.' where slug = 'regenpfuetzen-expedition';
update micro_adventures set meta_description = 'Baumklettern mit Kindern im Wald: Welche Bäume sich eignen, Sicherheitsregeln und Tipps für Familien mit mehreren Kindern.' where slug = 'baumklettern-im-wald';
update micro_adventures set meta_description = 'Kreidemalerei auf dem Gehweg: Hüpfspiele, Fantasiewelten und Familienkunstwerke mit Straßenmalkreide. Kostenlos und direkt vor der Haustür.' where slug = 'kreidemalerei-auf-dem-gehweg';
update micro_adventures set meta_description = 'Muschelsuche am Strand: Muscheln sammeln, bestimmen und eine Urlaubssammlung gestalten. Ideen und Tipps für Familien am Meer.' where slug = 'muschelsuche-am-strand';

-- Kontrolle: sollte keine Zeile mehr mit dem alten Alt-Text liefern.
select count(*) as alter_alt_text_uebrig from media where alt_text = 'kids reading flashlight blanket night';
