-- FamVaya Phase 15 — Pflicht-Passwortwechsel für admin-angelegte Accounts.
--
-- Wird nur bei per Admin-API angelegten Nutzer:innen (lib/data/users.ts#
-- createUserWithTempPassword) auf true gesetzt. Selbst-Registrierte
-- (/registrieren) behalten den Default false, siehe DECISIONS.md.
alter table users
  add column must_change_password boolean not null default false;
