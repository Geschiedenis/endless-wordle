# Endless Wordle

A Wordle that never stops. Solve a word and the next one starts straight away, with your unused guesses rolling over as a bonus. The game ends the first time you fail to solve a word.

Built with Next.js (App Router, TypeScript), Tailwind CSS and shadcn/ui. V1 is play-only, with no accounts and no database.

## Setup

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run dev` works without any configuration, using a temporary secret. To keep games across dev server restarts, set a real one:

```bash
cp .env.example .env.local
# then set GAME_SECRET in .env.local, using: openssl rand -base64 32
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm start` | Serves the production build (needs `GAME_SECRET`) |
| `npm test` | Runs the unit tests once |
| `npm run test:watch` | Runs the unit tests in watch mode |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Generates route types and runs the TypeScript compiler |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GAME_SECRET` | In production | Encrypts the game cookie. At least 32 characters. |

### Deploying to Vercel

1. Import this GitHub repo in Vercel. The framework preset and build settings work as detected.
2. Under **Settings > Environment Variables**, add `GAME_SECRET`, with a value from `openssl rand -base64 32`. Enable it for **Production** and **Preview**. Preview deployments run in production mode, so the game API returns errors there without it.
3. Deploy, or redeploy if the first build ran before the variable existed.

Changing `GAME_SECRET` later is safe. Games in progress become unreadable and players simply get a new game.

## Swapping in the real logo

Put the file at `public/logo.svg` and redeploy. The landing page uses it automatically and the placeholder disappears. No code changes are needed. It displays at 112 x 112 pixels, which you can change in `src/components/logo.tsx`.

## Game rules

- Each word starts with 6 guesses, plus any bonus.
- Solving a word carries every unused guess into the next word as bonus guesses, up to a cap of 6. Solving in 4 of 6 gives +2, so the next word has 8. Solving that one in 4 of 8 gives +4.
- Failing to solve a word ends the game. The word is revealed and your score is the number of words solved.

The numbers are in [`src/lib/game/constants.ts`](src/lib/game/constants.ts). `MAX_BONUS_GUESSES` is the only place the cap is set.

## Project structure

```
data/                  Word lists (server only)
scripts/               Regenerates the word lists
src/lib/game/          Pure game logic and shared types, with unit tests
src/lib/server/        Server-only code: tokens, rate limiting, words, extension points
src/app/api/game/      Route handlers: new, guess, state
src/hooks/use-game.ts  Client game state and timing
src/components/game/   Grid, keyboard, stats, game over
```

## How the answer stays private

The browser never receives the answer until the game is lost.

- The server picks the word and keeps it in an httpOnly cookie, encrypted with AES-256-GCM. Signing alone wouldn't be enough, because a signed cookie can still be read in the browser's developer tools. GCM also detects tampering, so a modified cookie simply counts as "no game".
- `toGameView` in `src/lib/game/engine.ts` is the only path from game state to an API response. It includes the answer only after a loss.
- The word lists are imported only from `server-only` code, so they can't end up in the browser bundle. The build fails if client code tries.
- All input is validated on the server, and errors use fixed, generic messages. Internal errors are logged on the server only.

### Known limitations

**Cookie replay.** Because V1 keeps state in a cookie and has no server storage, a determined player could save the cookie before a guess and restore it afterwards, which gives them extra attempts on a word. They still never see the answer. This doesn't matter for a game with no shared scores, but **it must be fixed before public highscores**, by moving game state to the database (see below).

**Rate limiting is per server instance.** The limits (per minute, per IP: 60 guesses, 30 new games, 60 state reads) are held in memory. On Vercel, each instance counts separately and resets when recycled, so they slow abuse rather than enforce a hard global limit. For strict limits, implement the `RateLimiter` interface in `src/lib/server/rate-limit.ts` on a shared store such as Upstash Redis.

## Adding accounts and highscores (V2)

The routes depend on small interfaces, so these can be filled in without a rewrite:

| Where | What to do |
| --- | --- |
| `src/lib/server/game-store.ts` | Implement `GameStore` on the database (Supabase or Vercel Postgres) and return it from `getGameStore()`. This also closes the replay gap above. |
| `src/lib/server/auth.ts` | Make `getCurrentUser()` return the signed-in user. |
| `src/lib/server/scores.ts` | Write to the highscores table in `recordFinalScore()`. It's already called once at the end of each game, from `src/app/api/game/guess/route.ts`. |
| `src/app/login/page.tsx` | Replace the "Coming soon" page with the sign-in flow. |
| `src/lib/server/rate-limit.ts` | Implement `RateLimiter` on a shared store if needed. |

## Word lists

| File | Contents | Sources |
| --- | --- | --- |
| `data/answers.json` | 2,002 common words the game can pick | [SCOWL](http://wordlist.aspell.net/) levels 10 to 35, filtered |
| `data/valid-guesses.json` | 8,680 words accepted as guesses | The answers, plus [ENABLE](https://github.com/dolph/dictionary) and SCOWL up to level 50 |

SCOWL is freely usable under a permissive licence and ENABLE is in the public domain. The required notices are in [`data/WORD-LISTS-LICENSE.txt`](data/WORD-LISTS-LICENSE.txt).

To keep answers fair and fun, the script removes simple plurals and past tenses, along with the words in `scripts/answer-blocklist.txt` (offensive or very obscure ones). Blocked words are still accepted as guesses.

To regenerate the lists, for example after editing the blocklist:

```bash
mkdir -p /tmp/words && cd /tmp/words
npm pack wordlist-english@1.2.1 && tar xzf wordlist-english-1.2.1.tgz
curl -sSLO https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt
cd -
node scripts/build-word-lists.mjs /tmp/words/package /tmp/words/enable1.txt
```

## Accessibility

- Tiles and keys have `aria-label`s that include their letter and feedback, and each result is announced to screen readers.
- The whole game can be played from a physical keyboard, and all controls have visible focus states.
- High-contrast mode swaps green and yellow for orange and blue, adds a check mark and dot to the tiles and keys, and strikes through used-up keys, so feedback doesn't depend on colour.
- Animations are turned off under `prefers-reduced-motion`.
- All text colour pairs in the game meet a WCAG contrast ratio of at least 4.5:1.
