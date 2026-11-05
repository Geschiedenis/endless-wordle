import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { OFFENSIVE_USERNAME_TERMS, RESERVED_USERNAMES } from "@/lib/username";

/**
 * Runs the real migrations on an in-process Postgres, with just enough of
 * Supabase stubbed around them: the three roles, auth.users and auth.uid().
 */
const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;

  create schema auth;
  grant usage on schema auth to anon, authenticated, service_role;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
`;

const ALICE = "00000000-0000-4000-8000-00000000000a";
const BOB = "00000000-0000-4000-8000-00000000000b";
const CAROL = "00000000-0000-4000-8000-00000000000c";
const DAVE = "00000000-0000-4000-8000-00000000000d";

let db: PGlite;

/** Runs SQL as a role and returns the rows, leaving the session as superuser. */
async function as<T>(role: string, uid: string | null, sql: string, params: unknown[] = []) {
  await db.exec(`set role ${role}; select set_config('test.uid', '${uid ?? ""}', false);`);
  try {
    return (await db.query<T>(sql, params)).rows;
  } finally {
    await db.exec("reset role;");
  }
}

async function addGame(userId: string, wordsSolved: number, totalGuesses: number, age = "1 minute") {
  await db.query(
    `insert into public.games (user_id, words_solved, total_guesses, created_at)
     values ($1, $2, $3, now() - $4::interval)`,
    [userId, wordsSolved, totalGuesses, age],
  );
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(SUPABASE_STUB);
  const dir = path.join(process.cwd(), "supabase", "migrations");
  for (const file of readdirSync(dir).sort()) {
    await db.exec(readFileSync(path.join(dir, file), "utf8"));
  }
}, 60_000);

afterAll(async () => {
  await db.close();
});

beforeEach(async () => {
  await db.exec("truncate auth.users cascade;");
  for (const [id, name] of [
    [ALICE, "alice"],
    [BOB, "bob"],
    [CAROL, "carol"],
    [DAVE, "dave"],
  ]) {
    await db.query("insert into auth.users (id) values ($1)", [id]);
    await db.query("insert into public.profiles (id, username) values ($1, $2)", [id, name]);
  }
});

describe("row level security", () => {
  it("is enabled on every public table", async () => {
    const { rows } = await db.query<{ tablename: string; rowsecurity: boolean }>(
      "select tablename, rowsecurity from pg_tables where schemaname = 'public'",
    );
    expect(rows.length).toBeGreaterThanOrEqual(3);
    expect(rows.filter((table) => !table.rowsecurity)).toEqual([]);
  });

  it("lets users read only their own profile", async () => {
    const rows = await as<{ username: string }>("authenticated", ALICE, "select username from public.profiles");
    expect(rows).toEqual([{ username: "alice" }]);
  });

  it("lets users change only their own username", async () => {
    await as("authenticated", ALICE, "update public.profiles set username = 'alice2' where id = $1", [ALICE]);
    await as("authenticated", ALICE, "update public.profiles set username = 'hacked' where id = $1", [BOB]);
    const { rows } = await db.query<{ username: string }>("select username from public.profiles order by username");
    expect(rows.map((row) => row.username)).toEqual(["alice2", "bob", "carol", "dave"]);
  });

  it("stops users changing anything else on their profile", async () => {
    await expect(
      as("authenticated", ALICE, "update public.profiles set created_at = now() where id = $1", [ALICE]),
    ).rejects.toThrow(/permission denied/);
  });

  it("stops users creating or deleting profiles directly", async () => {
    await expect(
      as("authenticated", ALICE, "insert into public.profiles (id, username) values ($1, 'x_y_z')", [ALICE]),
    ).rejects.toThrow(/permission denied/);
    await expect(as("authenticated", ALICE, "delete from public.profiles")).rejects.toThrow(/permission denied/);
  });

  it("lets users read only their own games", async () => {
    await addGame(ALICE, 3, 10);
    await addGame(BOB, 9, 30);
    const rows = await as<{ words_solved: number }>("authenticated", ALICE, "select words_solved from public.games");
    expect(rows).toEqual([{ words_solved: 3 }]);
  });

  it.each(["insert", "update", "delete"])("blocks %s on games from the browser", async (operation) => {
    const sql = {
      insert: `insert into public.games (user_id, words_solved, total_guesses) values ('${ALICE}', 999, 1)`,
      update: "update public.games set words_solved = 999",
      delete: "delete from public.games",
    }[operation]!;
    await expect(as("authenticated", ALICE, sql)).rejects.toThrow(/permission denied/);
    await expect(as("anon", null, sql)).rejects.toThrow(/permission denied/);
  });

  it("gives guests no table access at all", async () => {
    for (const table of ["profiles", "games", "active_games"]) {
      await expect(as("anon", null, `select * from public.${table}`)).rejects.toThrow(/permission denied/);
    }
  });

  it("hides game state from everyone but the service role", async () => {
    await db.query("insert into public.active_games (user_id, state) values ($1, 'sealed')", [ALICE]);
    await expect(as("authenticated", ALICE, "select * from public.active_games")).rejects.toThrow(/permission denied/);
    const rows = await as<{ state: string }>("service_role", null, "select state from public.active_games");
    expect(rows).toEqual([{ state: "sealed" }]);
  });

  it("lets the service role insert games", async () => {
    await as("service_role", null, "insert into public.games (user_id, words_solved, total_guesses) values ($1, 4, 12)", [ALICE]);
    const { rows } = await db.query("select * from public.games");
    expect(rows).toHaveLength(1);
  });

  it("keeps the internal leaderboard functions private", async () => {
    await expect(as("anon", null, "select * from public.leaderboard_ranked('all')")).rejects.toThrow(/permission denied/);
    await expect(as("authenticated", ALICE, "select * from public.leaderboard_ranked('all')")).rejects.toThrow(/permission denied/);
  });
});

describe("username rules in the database", () => {
  const setName = (name: string) =>
    as("authenticated", ALICE, "update public.profiles set username = $1 where id = $2", [name, ALICE]);

  it("rejects bad formats, even with a user's own token", async () => {
    for (const name of ["ab", "a".repeat(21), "john doe", "a-b-c", "josé"]) {
      await expect(setName(name)).rejects.toThrow(/not allowed/);
    }
  });

  it("rejects every reserved name in the app's list", async () => {
    for (const name of RESERVED_USERNAMES) {
      if (name.length < 3) continue;
      await expect(setName(name), name).rejects.toThrow(/not allowed/);
    }
  });

  it("rejects every offensive term in the app's list, with lookalikes", async () => {
    for (const term of OFFENSIVE_USERNAME_TERMS) {
      await expect(setName(`x${term}x`), term).rejects.toThrow(/not allowed/);
    }
    await expect(setName("sh1t_lord")).rejects.toThrow(/not allowed/);
    await expect(setName("A_d_m_1_n")).rejects.toThrow(/not allowed/);
  });

  it("treats names as unique regardless of case", async () => {
    await expect(setName("BOB")).rejects.toThrow(/duplicate key|unique/);
  });

  it("allows a normal change", async () => {
    await setName("Alice_99");
    const { rows } = await db.query("select 1 from public.profiles where username = 'Alice_99'");
    expect(rows).toHaveLength(1);
  });
});

describe("get_leaderboard", () => {
  type Row = { rank: string | number; username: string; words_solved: number };
  const board = (range: string, limit = 25, offset = 0) =>
    as<Row>("anon", null, "select * from public.get_leaderboard($1, $2, $3)", [range, limit, offset]);
  const names = (rows: Row[]) => rows.map((row) => row.username);

  it("is readable by guests and exposes only rank, username and score", async () => {
    await addGame(ALICE, 5, 20);
    const rows = await board("all");
    expect(Object.keys(rows[0]).sort()).toEqual(["rank", "username", "words_solved"]);
  });

  it("counts only each user's best game", async () => {
    await addGame(ALICE, 3, 10);
    await addGame(ALICE, 8, 30);
    await addGame(ALICE, 5, 20);
    await addGame(BOB, 6, 25);
    const rows = await board("all");
    expect(rows.map((row) => [row.username, row.words_solved])).toEqual([
      ["alice", 8],
      ["bob", 6],
    ]);
  });

  it("gives ties the same rank and lists fewer guesses first", async () => {
    await addGame(ALICE, 5, 30);
    await addGame(BOB, 5, 20);
    await addGame(CAROL, 2, 5);
    const rows = await board("all");
    expect(names(rows)).toEqual(["bob", "alice", "carol"]);
    expect(rows.map((row) => Number(row.rank))).toEqual([1, 1, 3]);
  });

  it("leaves out games with no words solved", async () => {
    await addGame(ALICE, 0, 6);
    expect(await board("all")).toEqual([]);
  });

  it("leaves out users who haven't chosen a username", async () => {
    await db.query("delete from public.profiles where id = $1", [ALICE]);
    await addGame(ALICE, 5, 20);
    expect(await board("all")).toEqual([]);
  });

  it("filters by time range", async () => {
    await addGame(ALICE, 9, 30, "60 days");
    await addGame(BOB, 3, 10, "1 minute");
    await db.exec(`
      insert into public.games (user_id, words_solved, total_guesses, created_at)
      values ('${CAROL}', 7, 20, public.leaderboard_range_start('today') - interval '1 second'),
             ('${DAVE}', 6, 20, public.leaderboard_range_start('week') - interval '1 second');
    `);
    expect(names(await board("all"))).toEqual(["alice", "carol", "dave", "bob"]);
    expect(names(await board("today"))).toEqual(["bob"]);
    // Carol's game was just before today, which only counts this week if today isn't Monday.
    const { rows } = await db.query<{ monday: boolean }>(
      "select public.leaderboard_range_start('week') = public.leaderboard_range_start('today') as monday",
    );
    expect(names(await board("week"))).toEqual(rows[0].monday ? ["bob"] : ["carol", "bob"]);
  });

  it("uses the best game inside the range, not the all-time best", async () => {
    await addGame(ALICE, 9, 30, "60 days");
    await addGame(ALICE, 2, 8, "1 minute");
    expect((await board("today"))[0].words_solved).toBe(2);
  });

  it("rejects an unknown range", async () => {
    await expect(board("forever")).rejects.toThrow(/invalid range/);
  });

  describe("paging", () => {
    beforeEach(async () => {
      await db.exec(`
        insert into auth.users (id)
          select ('00000000-0000-4000-9000-' || lpad(n::text, 12, '0'))::uuid from generate_series(1, 60) n;
        insert into public.profiles (id, username)
          select ('00000000-0000-4000-9000-' || lpad(n::text, 12, '0'))::uuid, 'player' || n from generate_series(1, 60) n;
        insert into public.games (user_id, words_solved, total_guesses)
          select ('00000000-0000-4000-9000-' || lpad(n::text, 12, '0'))::uuid, 100 + n, 10 from generate_series(1, 60) n;
      `);
    });

    it("pages through without gaps or overlaps", async () => {
      const first = await board("all", 25, 0);
      const second = await board("all", 25, 25);
      expect(first).toHaveLength(25);
      expect(second).toHaveLength(25);
      expect(new Set(names([...first, ...second])).size).toBe(50);
      expect(Number(second[0].rank)).toBe(26);
    });

    it("never returns anyone past the top 50, however it's asked", async () => {
      expect(await board("all", 1000, 0)).toHaveLength(50);
      expect(await board("all", 25, 40)).toHaveLength(10);
      expect(await board("all", 25, 50)).toEqual([]);
      expect(await board("all", 25, 5000)).toEqual([]);
    });

    it("treats a negative offset or limit as harmless", async () => {
      expect(await board("all", 5, -10)).toHaveLength(5);
      expect(await board("all", -5, 0)).toEqual([]);
    });
  });
});

describe("get_my_rank", () => {
  it("returns the caller's own rank, even outside the top 50", async () => {
    await db.exec(`
      insert into auth.users (id)
        select ('00000000-0000-4000-9000-' || lpad(n::text, 12, '0'))::uuid from generate_series(1, 60) n;
      insert into public.profiles (id, username)
        select ('00000000-0000-4000-9000-' || lpad(n::text, 12, '0'))::uuid, 'player' || n from generate_series(1, 60) n;
      insert into public.games (user_id, words_solved, total_guesses)
        select ('00000000-0000-4000-9000-' || lpad(n::text, 12, '0'))::uuid, 100 + n, 10 from generate_series(1, 60) n;
    `);
    await addGame(ALICE, 1, 6);
    const rows = await as<{ rank: string | number; words_solved: number }>(
      "authenticated",
      ALICE,
      "select * from public.get_my_rank('all')",
    );
    expect(Number(rows[0].rank)).toBe(61);
    expect(rows[0].words_solved).toBe(1);
  });

  it("returns nothing for a user with no ranked game", async () => {
    expect(await as("authenticated", ALICE, "select * from public.get_my_rank('all')")).toEqual([]);
  });

  it("is not available to guests", async () => {
    await expect(as("anon", null, "select * from public.get_my_rank('all')")).rejects.toThrow(/permission denied/);
  });
});

describe("get_my_stats", () => {
  type Stats = { games_played: string | number; best_score: number; average_words: string | number };

  it("summarizes only the caller's games", async () => {
    await addGame(ALICE, 2, 10);
    await addGame(ALICE, 5, 20);
    await addGame(BOB, 50, 200);
    const [stats] = await as<Stats>("authenticated", ALICE, "select * from public.get_my_stats()");
    expect(Number(stats.games_played)).toBe(2);
    expect(stats.best_score).toBe(5);
    expect(Number(stats.average_words)).toBe(3.5);
  });

  it("returns zeros for a new user", async () => {
    const [stats] = await as<Stats>("authenticated", ALICE, "select * from public.get_my_stats()");
    expect(Number(stats.games_played)).toBe(0);
    expect(stats.best_score).toBe(0);
    expect(Number(stats.average_words)).toBe(0);
  });
});

describe("deleting an account", () => {
  it("removes all of the user's data and nobody else's", async () => {
    await addGame(ALICE, 3, 10);
    await addGame(BOB, 4, 10);
    await db.query("insert into public.active_games (user_id, state) values ($1, 'sealed')", [ALICE]);

    await db.query("delete from auth.users where id = $1", [ALICE]);

    const count = async (sql: string) => (await db.query(sql, [ALICE])).rows.length;
    expect(await count("select 1 from public.profiles where id = $1")).toBe(0);
    expect(await count("select 1 from public.games where user_id = $1")).toBe(0);
    expect(await count("select 1 from public.active_games where user_id = $1")).toBe(0);
    expect((await db.query("select 1 from public.games")).rows).toHaveLength(1);
  });
});
