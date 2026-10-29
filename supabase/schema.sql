-- ===========================================================================
-- schema.sql — TOUT le schéma en un seul fichier (migrations 0001 + 0002 + 0003).
-- À coller en une fois dans le SQL Editor de Supabase, puis cliquer « Run ».
-- Ré-exécutable sans danger.
-- ===========================================================================

-- ====================== 1) TABLES ==========================================
create extension if not exists "pgcrypto";

do $$ begin
  create type skill_category as enum ('development', 'data_design', 'systems_networks');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type education_type as enum ('formation', 'certification');
exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profile (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  title       text not null,
  location    text,
  email       text,
  phone       text,
  github_url  text,
  bio         text,
  avatar_url  text,
  cv_url      text,
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_profile_updated on public.profile;
create trigger trg_profile_updated before update on public.profile
  for each row execute function public.set_updated_at();

create table if not exists public.skills (
  id            uuid primary key default gen_random_uuid(),
  category      skill_category not null,
  name          text not null,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists skills_order_idx on public.skills (category, display_order);

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  summary       text,
  description   text,
  tech          text[] not null default '{}',
  github_url    text,
  demo_url      text,
  cover_image_url text,
  status        project_status not null default 'draft',
  featured      boolean not null default false,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists projects_status_idx on public.projects (status, display_order);
drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

create table if not exists public.project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  image_url     text not null,
  caption       text,
  display_order int not null default 0
);
create index if not exists project_images_project_idx
  on public.project_images (project_id, display_order);

create table if not exists public.experiences (
  id            uuid primary key default gen_random_uuid(),
  role          text not null,
  company       text not null,
  location      text,
  period        text,
  description   text,
  display_order int not null default 0
);
create index if not exists experiences_order_idx on public.experiences (display_order);

create table if not exists public.education (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  institution   text,
  year          text,
  type          education_type not null default 'formation',
  mention       text,
  display_order int not null default 0
);
create index if not exists education_order_idx on public.education (type, display_order);

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text,
  body       text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_created_idx on public.messages (created_at desc);

-- ====================== 2) SÉCURITÉ (RLS) ===================================
alter table public.profile        enable row level security;
alter table public.skills         enable row level security;
alter table public.projects       enable row level security;
alter table public.project_images enable row level security;
alter table public.experiences    enable row level security;
alter table public.education      enable row level security;
alter table public.messages       enable row level security;

drop policy if exists profile_read_public on public.profile;
create policy profile_read_public on public.profile for select using (true);
drop policy if exists profile_write_admin on public.profile;
create policy profile_write_admin on public.profile for all to authenticated using (true) with check (true);

drop policy if exists skills_read_public on public.skills;
create policy skills_read_public on public.skills for select using (true);
drop policy if exists skills_write_admin on public.skills;
create policy skills_write_admin on public.skills for all to authenticated using (true) with check (true);

drop policy if exists projects_read_published on public.projects;
create policy projects_read_published on public.projects for select using (status = 'published');
drop policy if exists projects_write_admin on public.projects;
create policy projects_write_admin on public.projects for all to authenticated using (true) with check (true);

drop policy if exists project_images_read_published on public.project_images;
create policy project_images_read_published on public.project_images for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
drop policy if exists project_images_write_admin on public.project_images;
create policy project_images_write_admin on public.project_images for all to authenticated using (true) with check (true);

drop policy if exists experiences_read_public on public.experiences;
create policy experiences_read_public on public.experiences for select using (true);
drop policy if exists experiences_write_admin on public.experiences;
create policy experiences_write_admin on public.experiences for all to authenticated using (true) with check (true);

drop policy if exists education_read_public on public.education;
create policy education_read_public on public.education for select using (true);
drop policy if exists education_write_admin on public.education;
create policy education_write_admin on public.education for all to authenticated using (true) with check (true);

drop policy if exists messages_insert_public on public.messages;
create policy messages_insert_public on public.messages for insert with check (true);
drop policy if exists messages_read_admin on public.messages;
create policy messages_read_admin on public.messages for select to authenticated using (true);
drop policy if exists messages_update_admin on public.messages;
create policy messages_update_admin on public.messages for update to authenticated using (true) with check (true);
drop policy if exists messages_delete_admin on public.messages;
create policy messages_delete_admin on public.messages for delete to authenticated using (true);

-- ====================== 3) STOCKAGE (buckets) ===============================
insert into storage.buckets (id, name, public)
values ('avatars','avatars',true), ('cv','cv',true), ('projects','projects',true)
on conflict (id) do nothing;

drop policy if exists public_read_portfolio_buckets on storage.objects;
create policy public_read_portfolio_buckets on storage.objects
  for select using (bucket_id in ('avatars','cv','projects'));

drop policy if exists admin_insert_portfolio_buckets on storage.objects;
create policy admin_insert_portfolio_buckets on storage.objects
  for insert to authenticated with check (bucket_id in ('avatars','cv','projects'));

drop policy if exists admin_update_portfolio_buckets on storage.objects;
create policy admin_update_portfolio_buckets on storage.objects
  for update to authenticated using (bucket_id in ('avatars','cv','projects'));

drop policy if exists admin_delete_portfolio_buckets on storage.objects;
create policy admin_delete_portfolio_buckets on storage.objects
  for delete to authenticated using (bucket_id in ('avatars','cv','projects'));

-- ====================== 4) COMMENTAIRES (mur public) =======================
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  message    text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_created_idx on public.comments (created_at desc);

alter table public.comments enable row level security;

drop policy if exists comments_read_public on public.comments;
create policy comments_read_public on public.comments for select using (true);

drop policy if exists comments_insert_public on public.comments;
create policy comments_insert_public on public.comments for insert with check (true);

drop policy if exists comments_delete_admin on public.comments;
create policy comments_delete_admin on public.comments for delete to authenticated using (true);

-- ✅ Terminé. Tu peux maintenant lancer « npm run seed ».
