create table public.collection_cards (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  fish_id     uuid not null references public.fish(id) on delete cascade,
  user_photo  text,
  notes       text,
  is_favorite boolean default false,
  added_at    timestamptz default now(),
  unique(user_id, fish_id)
);

alter table public.collection_cards enable row level security;
create policy "collection_owner_only" on public.collection_cards
  for all using (auth.uid() = user_id);
