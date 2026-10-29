-- ===========================================================================
-- 0003_storage.sql — Buckets de stockage + politiques d'accès
-- Buckets publics en lecture : avatars, cv, projects.
-- Écriture (upload/maj/suppression) réservée à l'admin authentifié.
-- ===========================================================================

insert into storage.buckets (id, name, public)
values
  ('avatars',  'avatars',  true),
  ('cv',       'cv',       true),
  ('projects', 'projects', true)
on conflict (id) do nothing;

-- Lecture publique sur les trois buckets du portfolio
drop policy if exists public_read_portfolio_buckets on storage.objects;
create policy public_read_portfolio_buckets on storage.objects
  for select using (bucket_id in ('avatars', 'cv', 'projects'));

-- Upload réservé à l'admin
drop policy if exists admin_insert_portfolio_buckets on storage.objects;
create policy admin_insert_portfolio_buckets on storage.objects
  for insert to authenticated with check (bucket_id in ('avatars', 'cv', 'projects'));

-- Mise à jour réservée à l'admin
drop policy if exists admin_update_portfolio_buckets on storage.objects;
create policy admin_update_portfolio_buckets on storage.objects
  for update to authenticated using (bucket_id in ('avatars', 'cv', 'projects'));

-- Suppression réservée à l'admin
drop policy if exists admin_delete_portfolio_buckets on storage.objects;
create policy admin_delete_portfolio_buckets on storage.objects
  for delete to authenticated using (bucket_id in ('avatars', 'cv', 'projects'));
