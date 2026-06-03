create table public.aqua_stores (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  type        text check (type in ('tienda','acuario_publico','criador')),
  lat         numeric(10,7) not null,
  lng         numeric(10,7) not null,
  address     text,
  phone       text,
  website     text,
  schedule    text,
  rating      numeric(2,1),
  verified_by uuid references auth.users(id),
  created_at  timestamptz default now()
);

alter table public.aqua_stores enable row level security;
create policy "stores_public_read" on public.aqua_stores for select using (true);
create policy "stores_user_insert" on public.aqua_stores
  for insert with check (auth.uid() is not null);

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  avatar_url  text,
  badges      jsonb default '[]',
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_owner" on public.profiles
  for all using (auth.uid() = id);
