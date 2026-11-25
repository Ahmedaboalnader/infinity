-- ========================================================
-- INFINITY - SUPABASE SCHEMA (Postgres + Auth + Storage + RLS)
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- --------------------------------------------------------
-- 1. TABLES
-- --------------------------------------------------------

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  slug text unique not null,
  full_name_en text default '',
  full_name_ar text default '',
  title_en text default '',
  title_ar text default '',
  bio_en text default '',
  bio_ar text default '',
  avatar_url text default '',
  cover_url text default '',
  whatsapp text default '',
  email text default '',
  location_en text default '',
  location_ar text default '',
  years_experience int default 0,
  skills text[] default '{}',
  socials jsonb default '{}'::jsonb,
  is_available boolean default true,
  is_published boolean default false,
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  description_en text default '',
  description_ar text default '',
  icon text default 'PenTool',
  sort_order int default 0,
  is_active boolean default true
);

-- MEMBER_CATEGORIES
create table if not exists public.member_categories (
  member_id uuid references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (member_id, category_id)
);

-- PROJECTS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title_en text default '',
  title_ar text default '',
  description_en text default '',
  description_ar text default '',
  cover_url text default '',
  images text[] default '{}',
  tags text[] default '{}',
  live_url text default '',
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- REQUESTS
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid null references public.profiles(id) on delete set null,
  category_id uuid null references public.categories(id) on delete set null,
  client_name text not null,
  client_email text default '',
  client_phone text default '',
  budget text default '',
  message text not null,
  status text default 'new' check (status in ('new', 'in_progress', 'done')),
  created_at timestamptz default now()
);

-- SITE SETTINGS
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text default 'Infinity',
  hero_title_en text default 'Infinity — Endless talent, one place',
  hero_title_ar text default 'إنفينيتي — مواهب بلا حدود في مكان واحد',
  hero_subtitle_en text default 'An elite collective of independent designers, developers, and creative directors.',
  hero_subtitle_ar text default 'نخبة من المصممين والمطورين والمبدعين المستقلين.',
  about_en text default 'Infinity is a curated collective of top-tier freelancers.',
  about_ar text default 'إنفينيتي تجمع نخبة من المستقلين المحترفين.',
  whatsapp text default '201000000000',
  email text default 'contact@infinity-talent.com',
  socials jsonb default '{}'::jsonb,
  logo_url text default ''
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- --------------------------------------------------------
-- 2. HELPER FUNCTIONS & TRIGGERS
-- --------------------------------------------------------

create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_name text;
  base_slug text;
  final_slug text;
  counter int := 1;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  base_slug := lower(regexp_replace(raw_name, '[^a-zA-Z0-9]', '-', 'g'));
  if base_slug = '' or base_slug is null then
    base_slug := 'member-' || substr(md5(random()::text), 1, 6);
  end if;
  final_slug := base_slug;

  while exists (select 1 from public.profiles where slug = final_slug) loop
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  end loop;

  insert into public.profiles (
    id, role, slug, full_name_en, full_name_ar, email, is_published, is_available
  ) values (
    new.id, 'member', final_slug, raw_name, raw_name, new.email, false, true
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.protect_profile_admin_fields()
returns trigger as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.is_published := old.is_published;
    new.is_featured := old.is_featured;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger check_profile_update_security
  before update on public.profiles
  for each row execute function public.protect_profile_admin_fields();

-- --------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.member_categories enable row level security;
alter table public.projects enable row level security;
alter table public.requests enable row level security;
alter table public.site_settings enable row level security;

create policy "Profiles public select" on public.profiles
  for select using (is_published = true or auth.uid() = id or public.is_admin());

create policy "Profiles owner update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "Categories public select" on public.categories
  for select using (is_active = true or public.is_admin());

create policy "Categories admin modify" on public.categories
  for all using (public.is_admin());

create policy "Member categories public select" on public.member_categories
  for select using (true);

create policy "Member categories owner insert" on public.member_categories
  for insert with check (auth.uid() = member_id or public.is_admin());

create policy "Member categories owner delete" on public.member_categories
  for delete using (auth.uid() = member_id or public.is_admin());

create policy "Projects public select" on public.projects
  for select using (
    exists (select 1 from public.profiles where id = projects.member_id and is_published = true)
    or auth.uid() = member_id
    or public.is_admin()
  );

create policy "Projects owner insert" on public.projects
  for insert with check (auth.uid() = member_id or public.is_admin());

create policy "Projects owner update" on public.projects
  for update using (auth.uid() = member_id or public.is_admin());

create policy "Projects owner delete" on public.projects
  for delete using (auth.uid() = member_id or public.is_admin());

create policy "Requests public insert" on public.requests
  for insert with check (true);

create policy "Requests member select" on public.requests
  for select using (auth.uid() = member_id or public.is_admin());

create policy "Requests member update" on public.requests
  for update using (auth.uid() = member_id or public.is_admin());

create policy "Site settings public select" on public.site_settings
  for select using (true);

create policy "Site settings admin update" on public.site_settings
  for update using (public.is_admin());

-- Storage
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Media public read" on storage.objects;
create policy "Media public read" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "Media owner upload" on storage.objects;
create policy "Media owner upload" on storage.objects for insert
with check (bucket_id = 'media' and auth.uid() is not null and (storage.foldername(name))[1] = 'media' and (storage.foldername(name))[2] = auth.uid()::text);

drop policy if exists "Media owner update" on storage.objects;
create policy "Media owner update" on storage.objects for update
using (bucket_id = 'media' and auth.uid() is not null and (storage.foldername(name))[1] = 'media' and (storage.foldername(name))[2] = auth.uid()::text);

drop policy if exists "Media owner delete" on storage.objects;
create policy "Media owner delete" on storage.objects for delete
using (bucket_id = 'media' and auth.uid() is not null and (storage.foldername(name))[1] = 'media' and (storage.foldername(name))[2] = auth.uid()::text);
