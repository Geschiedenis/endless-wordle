-- Games can be played in several languages. Earlier games were all English.
alter table public.games
  add column language text not null default 'en'
  check (language in ('en', 'nl', 'de', 'fr', 'es'));
