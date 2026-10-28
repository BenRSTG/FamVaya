-- FamVaya: Newsletter Double-Opt-in.
--
-- confirmation_token: pseudonymer Token für den Bestätigungslink in der
-- Anmelde-Mail (analog unsubscribe_token aus 0023).
-- confirmation_sent_at: letzter Versand der Bestätigungs-Mail (Schutz gegen
-- wiederholtes Absenden des Formulars).
-- confirmed_at: Zeitpunkt der Bestätigung als Einwilligungsnachweis.
--
-- Bestehende Abonnenten (bisher Single-Opt-in, confirmed = true) bleiben
-- bestätigt; confirmed_at wird mit dem Anmeldezeitpunkt vorbelegt.
alter table newsletter_subscribers
  add column confirmation_token uuid not null default gen_random_uuid(),
  add column confirmation_sent_at timestamptz,
  add column confirmed_at timestamptz;

update newsletter_subscribers
  set confirmed_at = created_at
  where confirmed = true and confirmed_at is null;
