-- The leaderboard is gone for now, so nothing may read usernames and scores in bulk.
-- Scores stay in public.games for each player's own profile. To bring the leaderboard
-- back, recreate these functions from 20261105120000_accounts_and_scores.sql.
drop function if exists public.get_leaderboard(text, integer, integer);
drop function if exists public.get_my_rank(text);
drop function if exists public.leaderboard_ranked(text);
drop function if exists public.leaderboard_range_start(text);
