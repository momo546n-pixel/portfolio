-- ===========================================================================
-- 0001_init.sql — Schéma initial du portfolio
-- ===========================================================================

create extension if not exists "pgcrypto";

-- --- Types énumérés ---------------------------------------------------------
do $$ begin
  create type skill_category as enum ('development', 'data_design', 'systems_networks');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type education_type as enum ('formation', 'certification');
exception when duplicate_object then null; end $$;

-- --- Fonction utilitaire : met à jour updated_at ----------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --- Profil (une seule ligne) ----------------------------------------------
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

-- --- Compétences ------------------------------------------------------------
create table if not exists public.skills (
  id            uuid primary key default gen_random_uuid(),
  category      skill_category not null,
  name          text not null,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists skills_order_idx on public.skills (category, display_order);

-- --- Projets ----------------------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  summary       text,                         -- courte accroche affichée sur la carte
  description   text,                         -- description détaillée (markdown)
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

-- --- Galerie d'images des projets ------------------------------------------
create table if not exists public.project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  image_url     text not null,
  caption       text,
  display_order int not null default 0
);
create index if not exists project_images_project_idx
  on public.project_images (project_id, display_order);

-- --- Expériences (prévu pour plus tard, déjà exploitable) -------------------
create table if not exists public.experiences (
  id            uuid primary key default gen_random_uuid(),
  role          text not null,
  company       text not null,
  location      text,
  period        text,                         -- ex. « 2026 · 2 mois »
  description   text,
  display_order int not null default 0
);
create index if not exists experiences_order_idx on public.experiences (display_order);

-- --- Formation & certifications --------------------------------------------
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

-- --- Messages du formulaire de contact -------------------------------------
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
