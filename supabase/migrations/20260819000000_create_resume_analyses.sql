create extension if not exists "pgcrypto";

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  original_filename text not null,
  status text not null default 'uploaded',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists resumes_user_id_created_at_idx
  on public.resumes (user_id, created_at desc);

alter table public.resumes enable row level security;

create policy "Users can read their own resumes"
  on public.resumes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own resumes"
  on public.resumes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own resumes"
  on public.resumes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own resumes"
  on public.resumes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on table public.resumes to authenticated;

create table if not exists public.resume_analyses (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  overall_score smallint check (overall_score between 0 and 100),
  ats_score smallint check (ats_score between 0 and 100),
  content_score smallint check (content_score between 0 and 100),
  skills_score smallint check (skills_score between 0 and 100),
  experience_score smallint check (experience_score between 0 and 100),
  projects_score smallint check (projects_score between 0 and 100),
  formatting_score smallint check (formatting_score between 0 and 100),
  strengths text[] not null default '{}',
  critical_issues text[] not null default '{}',
  recommendations text[] not null default '{}',
  missing_keywords text[] not null default '{}',
  skill_gaps text[] not null default '{}',
  weak_bullets jsonb not null default '[]'::jsonb,
  structured_resume jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists resume_analyses_user_id_created_at_idx
  on public.resume_analyses (user_id, created_at desc);

create index if not exists resume_analyses_resume_id_idx
  on public.resume_analyses (resume_id);

alter table public.resume_analyses enable row level security;

create policy "Users can read their own resume analyses"
  on public.resume_analyses for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own resume analyses"
  on public.resume_analyses for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own resume analyses"
  on public.resume_analyses for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own resume analyses"
  on public.resume_analyses for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on table public.resume_analyses to authenticated;
