-- ===========================================================================
-- 0002_rls.sql — Row Level Security (RLS)
-- Principe : lecture publique des contenus publiés ; écriture réservée à
-- l'admin (= tout utilisateur authentifié, l'inscription publique étant
-- désactivée dans Supabase Auth, seul ton compte existe).
-- ===========================================================================

alter table public.profile        enable row level security;
alter table public.skills         enable row level security;
alter table public.projects       enable row level security;
alter table public.project_images enable row level security;
alter table public.experiences    enable row level security;
alter table public.education      enable row level security;
alter table public.messages       enable row level security;

-- --- PROFILE ----------------------------------------------------------------
drop policy if exists profile_read_public on public.profile;
create policy profile_read_public on public.profile
  for select using (true);

drop policy if exists profile_write_admin on public.profile;
create policy profile_write_admin on public.profile
  for all to authenticated using (true) with check (true);

-- --- SKILLS -----------------------------------------------------------------
drop policy if exists skills_read_public on public.skills;
create policy skills_read_public on public.skills
  for select using (true);

drop policy if exists skills_write_admin on public.skills;
create policy skills_write_admin on public.skills
  for all to authenticated using (true) with check (true);

-- --- PROJECTS (le public ne voit que les projets publiés) -------------------
drop policy if exists projects_read_published on public.projects;
create policy projects_read_published on public.projects
  for select using (status = 'published');

-- (la policy "for all to authenticated" ci-dessous couvre aussi la lecture
--  des brouillons par l'admin)
drop policy if exists projects_write_admin on public.projects;
create policy projects_write_admin on public.projects
  for all to authenticated using (true) with check (true);

-- --- PROJECT_IMAGES (visibles si le projet parent est publié) ---------------
drop policy if exists project_images_read_published on public.project_images;
create policy project_images_read_published on public.project_images
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );

drop policy if exists project_images_write_admin on public.project_images;
create policy project_images_write_admin on public.project_images
  for all to authenticated using (true) with check (true);

-- --- EXPERIENCES ------------------------------------------------------------
drop policy if exists experiences_read_public on public.experiences;
create policy experiences_read_public on public.experiences
  for select using (true);

drop policy if exists experiences_write_admin on public.experiences;
create policy experiences_write_admin on public.experiences
  for all to authenticated using (true) with check (true);

-- --- EDUCATION --------------------------------------------------------------
drop policy if exists education_read_public on public.education;
create policy education_read_public on public.education
  for select using (true);

drop policy if exists education_write_admin on public.education;
create policy education_write_admin on public.education
  for all to authenticated using (true) with check (true);

-- --- MESSAGES (insertion publique via le formulaire, gestion admin) ---------
drop policy if exists messages_insert_public on public.messages;
create policy messages_insert_public on public.messages
  for insert with check (true);

drop policy if exists messages_read_admin on public.messages;
create policy messages_read_admin on public.messages
  for select to authenticated using (true);

drop policy if exists messages_update_admin on public.messages;
create policy messages_update_admin on public.messages
  for update to authenticated using (true) with check (true);

drop policy if exists messages_delete_admin on public.messages;
create policy messages_delete_admin on public.messages
  for delete to authenticated using (true);
