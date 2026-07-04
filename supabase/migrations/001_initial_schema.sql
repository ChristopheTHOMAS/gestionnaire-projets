-- Extension UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: lieux (avant steps pour la FK)
-- ============================================================
create table public.lieux (
  id         uuid primary key default uuid_generate_v4(),
  nom        text not null,
  adresse    text,
  lat        double precision,
  lng        double precision,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.lieux enable row level security;

create policy "lieux: user owns row"
  on public.lieux for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABLE: projects
-- ============================================================
create table public.projects (
  id         uuid primary key default uuid_generate_v4(),
  titre      text not null,
  categorie  text check (categorie in ('maison', 'bricolage', 'travaux', 'autre')),
  deadline   date,
  statut     text not null default 'À faire'
             check (statut in ('À faire', 'En cours', 'Terminé')),
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "projects: user owns row"
  on public.projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABLE: steps
-- ============================================================
create table public.steps (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  titre      text not null,
  lieu_id    uuid references public.lieux(id) on delete set null,
  deadline   date,
  statut     text not null default 'À faire'
             check (statut in ('À faire', 'En cours', 'Fait')),
  ordre      integer not null default 0,
  depends_on uuid references public.steps(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.steps enable row level security;

create policy "steps: user owns via project"
  on public.steps for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = steps.project_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = steps.project_id and p.user_id = auth.uid()
    )
  );

-- ============================================================
-- TABLE: push_subscriptions
-- ============================================================
create table public.push_subscriptions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  endpoint   text unique not null,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "push: user owns row"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- INDEX
-- ============================================================
create index steps_project_id_idx on public.steps(project_id);
create index steps_lieu_id_idx    on public.steps(lieu_id);
create index steps_depends_on_idx on public.steps(depends_on);
create index projects_user_id_idx on public.projects(user_id);
create index lieux_user_id_idx    on public.lieux(user_id);
