-- Endless Wordle V2: accounts, scores and the leaderboard.
-- Run this once in the Supabase SQL editor. See "Supabase setup" in the README.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now()
);

-- "Alice" and "alice" are the same name.
create unique index profiles_username_lower_key on public.profiles (lower(username));

create table public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  words_solved integer not null check (words_solved >= 0),
  total_guesses integer not null check (total_guesses >= 0),
  created_at timestamptz not null default now()
);

-- Leaderboard: finished games in a time range, best score first.
create index games_created_at_words_idx on public.games (created_at desc, words_solved desc);
-- Leaderboard: each user's best game. Profile: their stats.
create index games_user_words_idx on public.games (user_id, words_solved desc, total_guesses);
-- Profile: their recent games.
create index games_user_created_at_idx on public.games (user_id, created_at desc);

-- The game in progress for each logged-in user. `state` is encrypted with
-- GAME_SECRET, so it holds no readable answer. Keeping this on the server stops
-- players from replaying an old cookie to get extra attempts, and `revision`
-- stops parallel requests from doing the same. No role but the service role can
-- touch this table.
create table public.active_games (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state text not null,
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Username rules
-- ---------------------------------------------------------------------------

-- Users can update their own row directly with their own token, so the rules
-- have to hold here as well as in the app. Keep the two lists in step with
-- src/lib/username.ts. A test fails if they drift apart.
create function public.enforce_username_rules()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  normalized text := translate(replace(lower(new.username), '_', ''), '013457$', 'oieasts');
begin
  if new.username !~ '^[A-Za-z0-9_]{3,20}$' then
    raise exception 'username not allowed' using errcode = '23514';
  end if;

  if normalized = any (array[
    'admin', 'administrator', 'anonymous', 'endlesswordle', 'guest', 'help', 'login',
    'logout', 'mod', 'moderator', 'null', 'official', 'owner', 'privacy', 'profile',
    'root', 'staff', 'support', 'system', 'terms', 'undefined', 'wordle'
  ]) or normalized ~ '(bitch|cunt|fag|fuck|hitler|nazi|nigg|penis|pussy|rape|shit|slut|whore)' then
    raise exception 'username not allowed' using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger profiles_enforce_username_rules
  before insert or update of username on public.profiles
  for each row execute function public.enforce_username_rules();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.active_games enable row level security;

-- Supabase grants broad table access by default. Start from nothing and add
-- back only what the policies below need. RLS still applies on top of grants.
revoke all on public.profiles, public.games, public.active_games from public, anon, authenticated;
grant all on public.profiles, public.games, public.active_games to service_role;

grant select on public.profiles to authenticated;
grant update (username) on public.profiles to authenticated;
grant select on public.games to authenticated;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can read their own games"
  on public.games for select to authenticated
  using ((select auth.uid()) = user_id);

-- No insert, update or delete policy on games, and no policy at all on
-- active_games. Only server route handlers, using the service role, write them.

-- ---------------------------------------------------------------------------
-- Leaderboard
-- ---------------------------------------------------------------------------

-- Start of a time range, in UTC. Weeks start on Monday.
create function public.leaderboard_range_start(p_range text)
returns timestamptz
language plpgsql
stable
set search_path = ''
as $$
begin
  case p_range
    when 'all' then return '-infinity'::timestamptz;
    when 'week' then return date_trunc('week', now() at time zone 'utc') at time zone 'utc';
    when 'today' then return date_trunc('day', now() at time zone 'utc') at time zone 'utc';
    else raise exception 'invalid range' using errcode = '22023';
  end case;
end;
$$;

-- Each user's best game in the range, ranked. Runs with the owner's rights
-- because nobody can read other people's rows directly, so it must only ever be
-- called from the two functions below, which decide what leaves. Players on the
-- same number of words share a rank, and fewer total guesses lists first.
create function public.leaderboard_ranked(p_range text)
returns table (
  user_id uuid,
  username text,
  words_solved integer,
  total_guesses integer,
  created_at timestamptz,
  rank bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with best as (
    select distinct on (g.user_id) g.user_id, g.words_solved, g.total_guesses, g.created_at
    from public.games g
    where g.created_at >= public.leaderboard_range_start(p_range)
      and g.words_solved > 0
    order by g.user_id, g.words_solved desc, g.total_guesses asc, g.created_at asc
  )
  select
    b.user_id,
    p.username,
    b.words_solved,
    b.total_guesses,
    b.created_at,
    rank() over (order by b.words_solved desc)
  from best b
  join public.profiles p on p.id = b.user_id;
$$;

-- The public leaderboard: rank, username and score only, and never past the top 50.
create function public.get_leaderboard(p_range text, p_limit integer default 25, p_offset integer default 0)
returns table (rank bigint, username text, words_solved integer)
language sql
stable
security definer
set search_path = ''
as $$
  select r.rank, r.username, r.words_solved
  from public.leaderboard_ranked(p_range) r
  order by r.rank, r.total_guesses, r.created_at, r.username
  limit greatest(0, least(p_limit, 50 - greatest(p_offset, 0)))
  offset greatest(p_offset, 0);
$$;

-- The caller's own rank, for showing it when they are outside the top 50.
create function public.get_my_rank(p_range text)
returns table (rank bigint, words_solved integer)
language sql
stable
security definer
set search_path = ''
as $$
  select r.rank, r.words_solved
  from public.leaderboard_ranked(p_range) r
  where r.user_id = (select auth.uid());
$$;

-- The caller's own stats. Runs with their rights, so RLS limits it to their games.
create function public.get_my_stats()
returns table (games_played bigint, best_score integer, average_words numeric)
language sql
stable
set search_path = ''
as $$
  select count(*), coalesce(max(g.words_solved), 0), round(coalesce(avg(g.words_solved), 0), 1)
  from public.games g
  where g.user_id = (select auth.uid());
$$;

-- Functions are executable by everyone unless revoked.
revoke all on function public.enforce_username_rules() from public, anon, authenticated;
revoke all on function public.leaderboard_range_start(text) from public, anon, authenticated;
revoke all on function public.leaderboard_ranked(text) from public, anon, authenticated;
revoke all on function public.get_leaderboard(text, integer, integer) from public;
revoke all on function public.get_my_rank(text) from public, anon;
revoke all on function public.get_my_stats() from public, anon;

grant execute on function public.get_leaderboard(text, integer, integer) to anon, authenticated;
grant execute on function public.get_my_rank(text) to authenticated;
grant execute on function public.get_my_stats() to authenticated;
