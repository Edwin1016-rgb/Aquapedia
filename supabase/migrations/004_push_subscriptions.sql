create table public.push_subscriptions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;
create policy "push_owner" on public.push_subscriptions
  for all using (auth.uid() = user_id);
