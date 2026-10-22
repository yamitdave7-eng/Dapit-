-- Run this once in Supabase SQL Editor before starting the app.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'DAPIT member',
  role text not null default 'student' check (role in ('student', 'resident', 'business_owner', 'admin')),
  location text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_records (
  id text primary key,
  kind text not null check (kind in ('business', 'event', 'job', 'community', 'talent')),
  owner_id uuid references public.profiles(id) on delete set null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists marketplace_records_kind_created_idx on public.marketplace_records(kind, created_at desc);
create index if not exists marketplace_records_owner_idx on public.marketplace_records(owner_id);

create table if not exists public.applications (
  id text primary key,
  job_id text not null references public.marketplace_records(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  data jsonb not null,
  status text not null default 'Pending' check (status in ('Pending', 'Reviewing', 'Interviewing', 'Accepted', 'Rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_applicant_created_idx on public.applications(applicant_id, created_at desc);
create index if not exists applications_job_created_idx on public.applications(job_id, created_at desc);

create table if not exists public.record_interactions (
  record_id text not null references public.marketplace_records(id) on delete cascade,
  interaction_type text not null check (interaction_type in ('rsvp', 'like')),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (record_id, interaction_type, user_id)
);

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

create or replace function public.current_profile_role()
returns text
language sql stable security definer
set search_path = ''
as $$ select role from public.profiles where id = (select auth.uid()) $$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$ select coalesce(public.current_profile_role() = 'admin', false) $$;

create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and (select auth.uid()) is not null and not public.is_admin() then
    raise exception 'Only administrators may change account roles';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role before update on public.profiles
for each row execute function public.guard_profile_role_change();

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare requested_role text;
begin
  requested_role := new.raw_user_meta_data ->> 'role';
  if requested_role is null or requested_role not in ('student', 'resident', 'business_owner') then
    requested_role := 'student';
  end if;
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'DAPIT member'), requested_role);
  return new;
end;
$$;

drop trigger if exists auth_user_profile on auth.users;
create trigger auth_user_profile after insert on auth.users
for each row execute function public.create_profile_for_auth_user();

create or replace function public.update_record_interaction_count()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare target_id text; target_type text; delta integer;
begin
  if tg_op = 'DELETE' then
    target_id := old.record_id;
    target_type := old.interaction_type;
    delta := -1;
  else
    target_id := new.record_id;
    target_type := new.interaction_type;
    delta := 1;
  end if;
  update public.marketplace_records
    set data = jsonb_set(
      data,
      case when target_type = 'rsvp' then '{rsvpCount}' else '{likes}' end,
      to_jsonb(greatest(0, coalesce((data ->> case when target_type = 'rsvp' then 'rsvpCount' else 'likes' end)::integer, 0) + delta)),
      true
    ), updated_at = now()
    where id = target_id;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function public.validate_record_interaction()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare target_kind text; max_capacity integer; current_count integer;
begin
  select kind, nullif(data ->> 'capacity', '')::integer
    into target_kind, max_capacity
    from public.marketplace_records where id = new.record_id for update;
  if target_kind is null then raise exception 'Listing not found'; end if;
  if new.interaction_type = 'rsvp' then
    if target_kind <> 'event' then raise exception 'RSVPs are only available for events'; end if;
    select count(*) into current_count from public.record_interactions
      where record_id = new.record_id and interaction_type = 'rsvp';
    if max_capacity is not null and current_count >= max_capacity then raise exception 'This event is full'; end if;
  elsif new.interaction_type = 'like' and target_kind <> 'community' then
    raise exception 'Likes are only available for community posts';
  end if;
  return new;
end;
$$;

drop trigger if exists interaction_validate on public.record_interactions;
create trigger interaction_validate before insert on public.record_interactions
for each row execute function public.validate_record_interaction();

drop trigger if exists interaction_count on public.record_interactions;
create trigger interaction_count after insert or delete on public.record_interactions
for each row execute function public.update_record_interaction_count();

create or replace function public.update_job_applicant_count()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  update public.marketplace_records
    set data = jsonb_set(data, '{applicantsCount}', to_jsonb(coalesce((data ->> 'applicantsCount')::integer, 0) + 1), true), updated_at = now()
    where id = new.job_id;
  return new;
end;
$$;

drop trigger if exists application_count on public.applications;
create trigger application_count after insert on public.applications
for each row execute function public.update_job_applicant_count();

alter table public.profiles enable row level security;
alter table public.marketplace_records enable row level security;
alter table public.applications enable row level security;
alter table public.record_interactions enable row level security;
alter table public.social_connections enable row level security;
alter table public.login_history enable row level security;
create or replace function public.prepare_application()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare current_role text; current_name text; current_email text; job_record jsonb;
begin
  select role, display_name into current_role, current_name
    from public.profiles where id = new.applicant_id;
  if current_role not in ('student', 'resident') then raise exception 'Only job seekers can apply'; end if;
  select data into job_record from public.marketplace_records where id = new.job_id and kind = 'job';
  if job_record is null then raise exception 'Choose an active job listing'; end if;
  select email into current_email from auth.users where id = new.applicant_id;
  new.data := new.data || jsonb_build_object(
    'applicantName', coalesce(current_name, 'DAPIT member'),
    'applicantEmail', coalesce(current_email, ''),
    'applicantRole', current_role,
    'jobId', new.job_id,
    'jobTitle', job_record ->> 'title',
    'businessId', job_record ->> 'businessId',
    'businessName', job_record ->> 'businessName'
  );
  return new;
end;
$$;

drop trigger if exists applications_prepare_identity on public.applications;
create trigger applications_prepare_identity before insert on public.applications
for each row execute function public.prepare_application();

revoke all on public.profiles, public.marketplace_records, public.applications, public.record_interactions from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, role, location, bio, avatar_url) on public.profiles to authenticated;
grant select on public.marketplace_records to anon, authenticated;
grant insert, delete on public.marketplace_records to authenticated;
grant select on public.applications to authenticated;
grant insert (id, job_id, applicant_id, data) on public.applications to authenticated;
grant update (status, updated_at) on public.applications to authenticated;
grant select (record_id, interaction_type) on public.record_interactions to anon, authenticated;
revoke all on public.record_interactions from anon;
grant select (record_id, interaction_type, user_id), insert (record_id, interaction_type, user_id) on public.record_interactions to authenticated;
grant select on public.record_interactions to authenticated;
grant delete on public.record_interactions to authenticated;
grant select, insert, update, delete on public.social_connections to authenticated;
grant select, insert on public.login_history to authenticated;
grant usage, select on sequence public.login_history_id_seq to authenticated;
grant usage on schema public to anon, authenticated;
grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists profile_read_self_or_admin on public.profiles;
create policy profile_read_self_or_admin on public.profiles for select to authenticated
using (true);
drop policy if exists profile_update_self_or_admin on public.profiles;
create policy profile_update_self_or_admin on public.profiles for update to authenticated
using (id = (select auth.uid()) or (select public.is_admin()))
with check (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists records_public_read on public.marketplace_records;
create policy records_public_read on public.marketplace_records for select to anon, authenticated using (true);
drop policy if exists records_owner_insert on public.marketplace_records;
create policy records_owner_insert on public.marketplace_records for insert to authenticated
with check (owner_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists records_owner_update on public.marketplace_records;
create policy records_owner_update on public.marketplace_records for update to authenticated
using (owner_id = (select auth.uid()) or (select public.is_admin()))
with check (owner_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists records_owner_delete on public.marketplace_records;
create policy records_owner_delete on public.marketplace_records for delete to authenticated
using (owner_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists applications_read_own_or_job_owner_or_admin on public.applications;
create policy applications_read_own_or_job_owner_or_admin on public.applications for select to authenticated
using (
  applicant_id = (select auth.uid()) or (select public.is_admin()) or exists (
    select 1 from public.marketplace_records r where r.id = job_id and r.owner_id = (select auth.uid())
  )
);
drop policy if exists applications_insert_self on public.applications;
create policy applications_insert_self on public.applications for insert to authenticated
with check (applicant_id = (select auth.uid()));
drop policy if exists applications_update_job_owner_or_admin on public.applications;
create policy applications_update_job_owner_or_admin on public.applications for update to authenticated
using (
  (select public.is_admin()) or exists (
    select 1 from public.marketplace_records r where r.id = job_id and r.owner_id = (select auth.uid())
  )
)
with check (
  (select public.is_admin()) or exists (
    select 1 from public.marketplace_records r where r.id = job_id and r.owner_id = (select auth.uid())
  )
);

drop policy if exists interactions_public_read on public.record_interactions;
create policy interactions_public_read on public.record_interactions for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists interactions_insert_self on public.record_interactions;
create policy interactions_insert_self on public.record_interactions for insert to authenticated
with check (user_id = (select auth.uid()));
drop policy if exists interactions_delete_self on public.record_interactions;
create policy interactions_delete_self on public.record_interactions for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists interactions_admin_read on public.record_interactions;
create policy interactions_admin_read on public.record_interactions for select to authenticated
using ((select public.is_admin()));

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
using ((actor_id = (select auth.uid()) or target_id = (select auth.uid())) and (kind = 'follow' or kind = 'friend'));

drop policy if exists login_history_insert_self on public.login_history;
create policy login_history_insert_self on public.login_history for insert to authenticated
with check (user_id = (select auth.uid()) and lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), '')));
drop policy if exists login_history_admin_read on public.login_history;
create policy login_history_admin_read on public.login_history for select to authenticated
using ((select public.is_admin()));



