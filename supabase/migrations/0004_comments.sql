-- ===========================================================================
-- 0004_comments.sql — Mur de commentaires public (page Contact)
-- Lecture + insertion publiques ; suppression réservée à l'admin.
-- ===========================================================================

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  message    text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_created_idx on public.comments (created_at desc);

alter table public.comments enable row level security;

drop policy if exists comments_read_public on public.comments;
create policy comments_read_public on public.comments
  for select using (true);

drop policy if exists comments_insert_public on public.comments;
create policy comments_insert_public on public.comments
  for insert with check (true);

drop policy if exists comments_delete_admin on public.comments;
create policy comments_delete_admin on public.comments
  for delete to authenticated using (true);
