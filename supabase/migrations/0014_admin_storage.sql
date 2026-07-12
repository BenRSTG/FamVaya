-- FamVaya Phase 5 — Admin-Bereich: Storage-Bucket für Medien-Uploads.
--
-- Kein Storage-RLS nötig: Uploads laufen ausschließlich über eine
-- Server Action mit dem service_role-Client (umgeht Storage-RLS ohnehin,
-- Durchsetzung erfolgt auf Anwendungsebene über requireAdminOrEditor()).
-- Der Bucket ist "public", damit Bilder auf den öffentlichen Detailseiten
-- ohne Auth ladbar sind (siehe DECISIONS.md).

insert into storage.buckets (id, name, public)
values ('content-media', 'content-media', true)
on conflict (id) do nothing;
