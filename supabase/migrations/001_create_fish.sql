create extension if not exists "uuid-ossp";

create table public.fish (
  id               uuid primary key default uuid_generate_v4(),
  common_name      text not null,
  scientific_name  text not null unique,
  family           text not null,
  description      text,
  image_url        text,
  temp_min         numeric(4,1) not null,
  temp_max         numeric(4,1) not null,
  ph_min           numeric(3,1) not null,
  ph_max           numeric(3,1) not null,
  hardness_min     integer,
  hardness_max     integer,
  size_adult_cm    numeric(5,1) not null,
  lifespan         text,
  diet             text check (diet in ('omnivoro','carnivoro','herbivoro')),
  temperament      text check (temperament in ('pacifico','semiagressivo','agresivo')),
  tank_level_min   integer,
  difficulty_level integer check (difficulty_level between 1 and 5),
  rarity           text check (rarity in ('comun','poco_comun','raro','epico')),
  compatible_with  uuid[] default '{}',
  incompatible_with uuid[] default '{}',
  care_notes       text,
  tags             text[] default '{}',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.fish enable row level security;
create policy "fish_public_read" on public.fish for select using (true);
create policy "fish_admin_write" on public.fish for all
  using (auth.jwt() ->> 'role' = 'admin');
