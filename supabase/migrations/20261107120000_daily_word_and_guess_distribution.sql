-- The daily word, and the guess distribution on the profile.
-- Run this once in the Supabase SQL editor, after the earlier migrations.

-- ---------------------------------------------------------------------------
-- Guess distribution
-- ---------------------------------------------------------------------------

-- How many guesses each solved word in a game took, in order. Games from before
-- this column have an empty list, so they don't count towards the distribution.
alter table public.games
  add column solved_in smallint[] not null default '{}';

-- ---------------------------------------------------------------------------
-- Daily word
-- ---------------------------------------------------------------------------

-- One row per player, day and language: the guesses so far, and once the word is
-- solved, how many it took. The row is what stops a day's word being played twice.
-- `day` is the player's own calendar day, which the server checks is within a day
-- of UTC. `revision` stops parallel requests from each getting a free guess.
create table public.daily_games (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  language text not null check (language in ('en', 'nl', 'de', 'fr', 'es')),
  guesses text[] not null default '{}' check (cardinality(guesses) <= 6),
  solved_in smallint check (solved_in between 1 and 6),
  revision integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day, language)
);

alter table public.daily_games enable row level security;

-- Only server route handlers, using the service role, write daily games. Players
-- can read their own, which the distribution below relies on.
revoke all on public.daily_games from public, anon, authenticated;
grant all on public.daily_games to service_role;
grant select on public.daily_games to authenticated;

create policy "Users can read their own daily games"
  on public.daily_games for select to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- The caller's guess distribution
-- ---------------------------------------------------------------------------

-- Solved words by the number of guesses they took, across endless games and daily
-- words. Runs with the caller's rights, so RLS limits it to their own rows.
create function public.get_my_guess_distribution()
returns table (guesses integer, words bigint)
language sql
stable
set search_path = ''
as $$
  select s.guesses, count(*)
  from (
    select unnest(g.solved_in)::integer as guesses
    from public.games g
    where g.user_id = (select auth.uid())
    union all
    select d.solved_in::integer
    from public.daily_games d
    where d.user_id = (select auth.uid()) and d.solved_in is not null
  ) s
  group by s.guesses
  order by s.guesses;
$$;

revoke all on function public.get_my_guess_distribution() from public, anon;
grant execute on function public.get_my_guess_distribution() to authenticated;
