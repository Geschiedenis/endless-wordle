-- The site is now Endless Lingle, so its names are reserved too. Same rules as
-- before, with 'endlesslingle' and 'lingle' added. Keep in step with
-- RESERVED_USERNAMES in src/lib/username.ts: a test fails if they drift apart.
create or replace function public.enforce_username_rules()
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
    'admin', 'administrator', 'anonymous', 'endlesslingle', 'endlesswordle', 'guest', 'help',
    'lingle', 'login', 'logout', 'mod', 'moderator', 'null', 'official', 'owner', 'privacy',
    'profile', 'root', 'staff', 'support', 'system', 'terms', 'undefined', 'wordle'
  ]) or normalized ~ '(bitch|cunt|fag|fuck|hitler|nazi|nigg|penis|pussy|rape|shit|slut|whore)' then
    raise exception 'username not allowed' using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_username_rules() from public, anon, authenticated;
