-- FamVaya Phase 4 — Auth: Trigger + RLS-Policies (Bauplan_2.md Phase 4)
--
-- Nur die jetzt nutzerbezogenen Tabellen bekommen echte Policies. Alle
-- anderen Tabellen bleiben bei der Phase-0-Entscheidung "RLS aktiv, keine
-- Policy, Zugriff nur über service_role" (siehe DECISIONS.md).

-- === Auto-Anlage der public.users-Zeile bei Signup ==========================
-- security definer nötig: der auth.users-Insert läuft unter der internen
-- supabase_auth_admin-Rolle, die kein INSERT-Grant auf public.users hat.
-- set search_path schützt vor search_path-Hijacking (Standard-Best-Practice
-- für security-definer-Funktionen).

create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- === RLS-Policies ============================================================

create policy "users_select_own" on users
  for select using (auth.uid() = id);
create policy "users_update_own" on users
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "family_profiles_select_own" on family_profiles
  for select using (auth.uid() = user_id);
create policy "family_profiles_insert_own" on family_profiles
  for insert with check (auth.uid() = user_id);
create policy "family_profiles_update_own" on family_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "family_profiles_delete_own" on family_profiles
  for delete using (auth.uid() = user_id);

create policy "favorites_select_own" on favorites
  for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on favorites
  for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on favorites
  for delete using (auth.uid() = user_id);

-- Kein öffentliches Select für is_public=true: die Freigabe-Seite
-- (/merkliste/geteilt/[token]) liest bewusst über den bestehenden
-- service_role-Admin-Client mit exaktem Token-Match statt über eine
-- RLS-Ausnahme (siehe DECISIONS.md).
create policy "favorite_collections_select_own" on favorite_collections
  for select using (auth.uid() = user_id);
create policy "favorite_collections_insert_own" on favorite_collections
  for insert with check (auth.uid() = user_id);
create policy "favorite_collections_update_own" on favorite_collections
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "favorite_collections_delete_own" on favorite_collections
  for delete using (auth.uid() = user_id);

-- Öffentliches Anmeldeformular: insert für alle Rollen, kein select/update/delete.
create policy "newsletter_subscribers_insert_public" on newsletter_subscribers
  for insert with check (true);
