-- Run once in the Supabase SQL Editor to add follows, friend requests, analytics, and sign-in history.
create table if not exists public.social_connections (
  actor_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('follow', 'friend')),
  status text not null check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (actor_id, target_id, kind),
  check (actor_id <> target_id)
);
create index if not exists social_connections_target_idx on public.social_connections(target_id, kind, status);

create table if not exists public.login_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
create index if not exists login_history_created_at_idx on public.login_history(created_at desc);
alter table public.login_history enable row level security;
grant select, insert on public.login_history to authenticated;
grant usage, select on sequence public.login_history_id_seq to authenticated;

drop policy if exists login_history_insert_self on public.login_history;
create policy login_history_insert_self on public.login_history for insert to authenticated
with check (user_id = (select auth.uid()) and lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), '')));
drop policy if exists login_history_admin_read on public.login_history;
create policy login_history_admin_read on public.login_history for select to authenticated
using ((select public.is_admin()));

alter table public.social_connections enable row level security;
grant select, insert, update, delete on public.social_connections to authenticated;
grant select on public.record_interactions to authenticated;

drop policy if exists profile_read_self_or_admin on public.profiles;
create policy profile_read_self_or_admin on public.profiles for select to authenticated using (true);

drop policy if exists social_connections_read_participant_or_admin on public.social_connections;
create policy social_connections_read_participant_or_admin on public.social_connections for select to authenticated
using (actor_id = (select auth.uid()) or target_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists social_connections_insert_actor on public.social_connections;
create policy social_connections_insert_actor on public.social_connections for insert to authenticated
with check (actor_id = (select auth.uid()) and actor_id <> target_id);
drop policy if exists social_connections_update_target on public.social_connections;
create policy social_connections_update_target on public.social_connections for update to authenticated
using (target_id = (select auth.uid()) and kind = 'friend' and status = 'pending')
with check (target_id = (select auth.uid()) and kind = 'friend' and status = 'accepted');
drop policy if exists social_connections_delete_participant on public.social_connections;
create policy social_connections_delete_participant on public.social_connections for delete to authenticated
using (actor_id = (select auth.uid()) or target_id = (select auth.uid()));

drop policy if exists interactions_admin_read on public.record_interactions;
create policy interactions_admin_read on public.record_interactions for select to authenticated
using ((select public.is_admin()));
