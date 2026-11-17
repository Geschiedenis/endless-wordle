-- Anonymous play statistics: every finished word and endless game, from every
-- player, logged in or not. Nothing in these tables identifies a player: no user
-- id, IP address or device, only the language, the word and how it went. So they
-- need no consent, and they count every game, where Google Analytics only sees
-- visitors who accepted analytics cookies.
-- Run this once in the Supabase SQL editor, after the earlier migrations.

-- One row per finished word, endless or daily: solved, or out of guesses.
-- Endless words can take up to 9 guesses (6 plus up to 3 bonus).
create table public.word_plays (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  mode text not null check (mode in ('endless', 'daily')),
  language text not null check (language in ('en', 'nl', 'de', 'fr', 'es')),
  word text not null check (char_length(word) between 1 and 10),
  guesses smallint not null check (guesses between 1 and 20),
  solved boolean not null
);

-- One row per finished endless game.
create table public.game_plays (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  language text not null check (language in ('en', 'nl', 'de', 'fr', 'es')),
  words_solved integer not null check (words_solved >= 0),
  total_guesses integer not null check (total_guesses >= 0)
);

-- Statistics over time, and per word.
create index word_plays_created_at_idx on public.word_plays (created_at);
create index word_plays_word_idx on public.word_plays (language, word);
create index game_plays_created_at_idx on public.game_plays (created_at);

-- Only server route handlers, using the service role, write them, and only the
-- service role (the dashboard's SQL editor) reads them. Players can't do either.
alter table public.word_plays enable row level security;
alter table public.game_plays enable row level security;
revoke all on public.word_plays, public.game_plays from public, anon, authenticated;
grant all on public.word_plays, public.game_plays to service_role;
