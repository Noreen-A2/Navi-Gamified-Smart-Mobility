create extension if not exists postgis;
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  phone text,
  level int default 1,
  xp int default 0,
  streak int default 0,
  achievements text[] default '{}',
  unlocked_regions uuid[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rarity text not null,
  unlock_xp int not null,
  boundary geography(Polygon, 4326) not null
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  reward_xp int not null,
  qr_code text,
  region_id uuid references public.regions(id) on delete set null,
  quest_type text not null,
  rarity text not null,
  location geography(Point, 4326)
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  rewards text,
  sponsor_level text not null,
  location geography(Point, 4326)
);

create table if not exists public.transit (
  id uuid primary key default gen_random_uuid(),
  route text not null,
  occupancy int default 0,
  eta_minutes int default 0,
  location geography(Point, 4326),
  updated_at timestamptz default now()
);

create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  quest_id uuid references public.quests(id) on delete cascade,
  completed_at timestamptz default now()
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reward_type text not null,
  xp_cost int not null
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  region_id uuid references public.regions(id) on delete set null,
  xp_earned int default 0,
  last_visit timestamptz default now()
);

create table if not exists public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  token text not null,
  platform text not null,
  last_seen timestamptz default now()
);

create unique index if not exists push_tokens_token_idx on public.push_tokens (token);

create or replace view public.regions_view as
select
  id,
  name,
  rarity,
  unlock_xp,
  st_asgeojson(boundary) as boundary_geojson
from public.regions;

create or replace view public.quests_view as
select
  id,
  title,
  description,
  reward_xp,
  qr_code,
  region_id,
  quest_type,
  rarity,
  st_asgeojson(location) as location_geojson
from public.quests;

create index if not exists regions_boundary_idx on public.regions using gist (boundary);
create index if not exists quests_location_idx on public.quests using gist (location);
create index if not exists businesses_location_idx on public.businesses using gist (location);
create index if not exists transit_location_idx on public.transit using gist (location);
