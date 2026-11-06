# Endless Wordle

A Wordle that never stops. Solve a word and the next one starts straight away, with your unused guesses rolling over as a bonus. The game ends the first time you fail to solve a word.

Play as a guest, or create an account to save your scores.

Built with Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui and Supabase (Auth and Postgres).

## Setup

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. **Guest play works with no configuration**, using a temporary game secret. Logging in needs a Supabase project: see [Supabase setup](#supabase-setup), then:

```bash
cp .env.example .env.local
# then fill in .env.local
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

| Variable | Where to find it | Used by |
| --- | --- | --- |
| `GAME_SECRET` | Generate with `openssl rand -base64 32`. At least 32 characters. | Server only. Encrypts game state. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase: Project Settings > API. Just `https://<project-ref>.supabase.co`, with no `/rest/v1/`. | Server code |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page: the `anon`/`public` key (`publishable` on newer projects) | Server code |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page: the `service_role` key (`secret` on newer projects) | Server only. **Bypasses all Row Level Security. Never expose it.** |
| `NEXT_PUBLIC_GA_ID` | Optional. Google Analytics: Admin > Data streams > your stream, the Measurement ID (`G-...`). Set it for Production only. | Google Analytics, which only loads after a visitor accepts analytics cookies. Read at build time, so redeploy after changing it. |
| `NEXT_PUBLIC_SITE_URL` | Optional. Your live address, such as `https://endlesswordle.app`, which is also the default. | Search results, link previews, the sitemap and shared results |

**Locally:** put them in `.env.local`, which git ignores. Restart `npm run dev` afterwards. All are optional for guest play.

**In production:** the first four are required. `npm run build` stops with a message naming whatever is missing, and on Vercel a failed build leaves the previous deployment running.

Changing `GAME_SECRET` later ends games in progress, for guests and logged-in players, and they start a new one. Saved scores aren't affected.

## Supabase setup

Do these in order, **before deploying V2**.

### 1. Create a project and run the migration

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of every file in [`supabase/migrations`](supabase/migrations), oldest first, and click **Run**. There are currently three files, and each file only needs to run once.

To check it worked, **Table Editor** should list `profiles`, `games` and `active_games`, each marked as protected by RLS.

### 2. Set the sign-in URLs

In **Authentication > URL Configuration**:

- **Site URL:** your production URL, such as `https://your-domain.com`.
- **Redirect URLs:** add each of these:
  - `http://localhost:3000/auth/callback**`
  - `https://your-domain.com/auth/callback**`
  - `https://*-your-vercel-team.vercel.app/auth/callback**` if you want login on Vercel previews

### 3. Set up email

Email confirmation is on by default, so new users get a confirmation link. Supabase's built-in email service is limited to a few messages per hour and is meant for testing. **For real users, add your own SMTP provider** under **Project Settings > Authentication > SMTP Settings**.

The branded email templates are in [`supabase/email-templates`](supabase/email-templates), with instructions for adding them.

### 4. Add the variables to Vercel

Under **Settings > Environment Variables**, add all four variables for **Production** and **Preview**. Mark `SUPABASE_SERVICE_ROLE_KEY` as sensitive. `NEXT_PUBLIC_` values are read at build time, so redeploy after changing them.

Then deploy. If a variable is missing, the build fails with its name and your live site keeps running.

## Search engines and sharing

- **Language versions.** Every page names its address and lists the same page in the other languages (`hreflang`), so search engines show visitors their own language. The helper is `pageMetadata` in [`src/i18n/server.ts`](src/i18n/server.ts).
- **Sitemap and robots.** `/sitemap.xml` lists every public page in every language, and `/robots.txt` points to it. Account pages carry a `noindex` tag instead of being blocked, so search engines can read it.
- **Previews.** Each language has its own preview image for shared links and search results, built from [`src/app/[lang]/opengraph-image.tsx`](src/app/[lang]/opengraph-image.tsx). Each page has its own title and description, written in `meta` in the dictionaries.
- **Structured data.** The home page describes the site as a free browser game in schema.org terms.
- **Sharing results.** After a game, Share copies a coloured grid with one line per word, with no letters, or opens the share sheet on phones.

After deploying, add the site to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), and submit `https://endlesswordle.app/sitemap.xml` to both.

## Logo

The originals are in `logos/`. To change the logo, replace these copies and redeploy: `public/logo.svg` (landing page and headers), `public/logo.png` (emails), `src/app/icon.svg` (browser tab) and `src/app/apple-icon.png` (iPhone home screen, 180 x 180 with no transparency).

## Game rules

- Each word starts with 6 guesses, plus any bonus.
- Solving a word carries every unused guess into the next word as bonus guesses, up to a cap of 3. Solving in 4 of 6 gives +2, so the next word has 8. Solving that one in 4 of 8 would give +4, which is capped to +3.
- Failing to solve a word ends the game. The word is revealed and your score is the number of words solved.

The numbers are in [`src/lib/game/constants.ts`](src/lib/game/constants.ts). `MAX_BONUS_GUESSES` is the only place the cap is set.

## Languages

The site and the game come in English, Dutch, German, French and Spanish. Each language has its own word lists and keyboard, and a game keeps its language from start to finish.

- **Addresses.** Pages live under `src/app/[lang]/`. English is at the plain paths (`/play`), and the others under their code (`/nl/play`). `src/proxy.ts` rewrites plain paths to English, redirects `/en/...` to the plain path, and sends visitors who chose a language to it. On a first visit to the home page, it uses the browser's language.
- **Choosing.** The flag menu at the top left saves the choice in the `ew-lang` cookie and reloads the page in that language. If a game in another language is under way, the game page asks before starting a new one, because that ends the streak.
- **Text.** Everything on the site is in `src/i18n/dictionaries/`, one file per language. TypeScript checks that every language has every key. The privacy notice and terms are English only, with a note in the other languages.
- **Letters.** German keeps Ä, Ö and Ü as letters with their own keys, and Spanish keeps Ñ. Other accents are dropped, so typing É counts as E. The letters and keyboards are in [`src/lib/game/languages.ts`](src/lib/game/languages.ts).
- **Scores.** Each saved game records its language, which the profile shows with a flag.
- **Emails.** Sign-up stores the language on the account, and the templates in [`supabase/email-templates`](supabase/email-templates) pick their language from it.

To add a language: add it to `LOCALES` in [`src/i18n/config.ts`](src/i18n/config.ts), add a dictionary, its letters and keyboard, word lists in `data/<lang>/`, an example in [`src/lib/game/examples.ts`](src/lib/game/examples.ts), a flag in [`src/components/flag.tsx`](src/components/flag.tsx), and the code to the `games.language` check in a new migration. The tests point out anything missing.

## Project structure

```
data/                   Word lists (server only)
scripts/                Regenerates the word lists
supabase/migrations/    Database schema and Row Level Security
src/proxy.ts            Routes languages, refreshes sessions and redirects guests from account pages
src/i18n/               Languages, dictionaries and translation helpers
src/app/[lang]/         Pages, once per language
src/lib/game/           Pure game logic and shared types, with unit tests
src/lib/server/         Server-only code: Supabase clients, game stores, scores, rate limiting
src/lib/*.ts            Username rules and input schemas, shared with the browser
src/app/api/            Route handlers: game, auth, profile
src/app/auth/callback/  Where email links land
src/hooks/              Client state for the game and session
src/components/         Game, account and shared UI
```

## How it stays private and fair

**The answer.** The browser never receives it until the game is lost. It's encrypted with AES-256-GCM wherever it's stored, and `toGameView` in `src/lib/game/engine.ts` is the only path from game state to an API response. The word lists are imported only from `server-only` code, so the build fails if client code tries to use them.

**Scores.** `calculateFinalScore` in `src/lib/game/score.ts` works only from game state held on the server, and the score is saved by the guess route when the game ends. No route accepts a score from the browser.

**Replay.** Guests keep their game in an encrypted cookie. Logged-in players' games live in the `active_games` table instead, because their scores are saved. The browser holds nothing it could restore, and a revision check means that when parallel requests race, only one guess counts and the others get no feedback. Game state is never in `profiles` or `games`, and only the service role can read `active_games`.

**Database access.** Every table has Row Level Security. Users can read and update only their own profile (only the username column) and read only their own games. Only the server, using the service role, can insert games. The database enforces the username rules itself, since users can update their own row directly.

**Sessions.** Sessions are in httpOnly cookies, and the browser has no Supabase client: every call goes through a route handler. That's why the Content Security Policy allows no outside connections.

**Requests.** All input is validated with Zod. State-changing requests must come from the site's own origin (CSRF protection). Errors use fixed, generic messages. Logs contain only an error's name, code and message, never emails, tokens or request data.

### Known limitations

**Rate limiting is per server instance.** Limits are held in memory, so on Vercel each instance counts separately and resets when recycled. They slow abuse rather than enforce a hard global limit. Supabase applies its own limits to sign-in attempts as well. For strict limits, implement the `RateLimiter` interface in `src/lib/server/rate-limit.ts` on a shared store such as Upstash Redis.

**The Content Security Policy allows inline scripts.** Pages are prerendered and Next.js adds inline scripts to them. The stricter nonce approach requires rendering every page per request, which removes the static pages. All other directives are strict.

**Guest games can't be claimed after logging in.** Guest cookies can be replayed, so accepting them would let players save inflated scores. Only games played while logged in count, and the game-over prompt says so.

**A score can occasionally fail to save.** The game state and the score are written separately. If the second write fails, the game-over screen says the score couldn't be saved.

**Time ranges use UTC.** "Today" and "This week" reset at midnight UTC, and weeks start on Monday.

## Troubleshooting

| What you see | Likely cause and fix |
| --- | --- |
| Build fails with "Missing required environment variables" | Add the named variables. On Vercel, check they're enabled for that environment (Production or Preview). |
| "Accounts aren't available right now" | Locally, the Supabase variables aren't set in `.env.local`, or the dev server hasn't been restarted since. |
| "Accounts aren't available right now", or a build error about the URL | `NEXT_PUBLIC_SUPABASE_URL` must be just `https://<project-ref>.supabase.co`, without `/rest/v1/`. |
| Login gives "Something went wrong", with `relation does not exist` or `function does not exist` in the server logs | The migration hasn't been run. See step 1 of the setup. |
| "That link didn't work" after clicking an email link | The link must be opened in the same browser that requested it, and it can only be used once. An email confirmation may still have worked, so try logging in. Otherwise, request a new link. |
| Email links go to the wrong site, or to localhost | Check the Site URL and Redirect URLs in step 2. |
| Confirmation or reset emails don't arrive | Check spam. The built-in email service allows only a few per hour, so add SMTP (step 3). |
| An outside script, font or image is blocked after you add one | Add its origin to the Content Security Policy in `next.config.ts`. |

## Testing

`npm test` includes tests that run the real migrations on [PGlite](https://pglite.dev/), an in-process Postgres, with Supabase's roles stubbed in. They cover Row Level Security, the username rules and account deletion, with no Supabase project needed.

## Word lists

Each language has `data/<lang>/answers.json`, the words the game can pick, and `data/<lang>/valid-guesses.json`, the words accepted as guesses. The sources and licence notices for each are in `data/<lang>/WORD-LISTS-LICENSE.txt`.

| Language | Answers | Valid guesses | Sources |
| --- | --- | --- | --- |
| English | 2,002 | 8,680 | [SCOWL](http://wordlist.aspell.net/) levels 10 to 35 for answers, plus [ENABLE](https://github.com/dolph/dictionary) and SCOWL up to level 50 for guesses |
| Dutch | 1,630 | 5,861 | OpenTaal (BSD or CC BY 3.0) |
| German | 1,230 | 4,510 | igerman98 (GPL) |
| French | 1,517 | 7,013 | Dicollecte (MPL 2.0) |
| Spanish | 1,324 | 8,753 | RLA-ES (GPL, LGPL or MPL) |

For the four non-English languages, the guesses are every five-letter word their Hunspell dictionary produces, and the answers are its most common base forms, ranked by [FrequencyWords](https://github.com/hermitdave/FrequencyWords) (CC BY-SA 4.0). Names, abbreviations and the words in `scripts/blocklists/<lang>.txt` are left out of the answers. The blocklists cover offensive, crude or sensitive words, English loanwords, and odd forms such as bare verb stems. The word lists stay on the server and are never sent to the browser.

To keep English answers fair and fun, its script removes simple plurals and past tenses, along with the words in `scripts/answer-blocklist.txt` (offensive or very obscure ones). Blocked words are still accepted as guesses, in every language.

To regenerate the other four languages, for example after editing a blocklist:

```bash
mkdir -p /tmp/words && cd /tmp/words
for l in nl de fr es; do
  npm pack dictionary-$l && mkdir -p dictionary-$l && tar xzf dictionary-$l-*.tgz -C dictionary-$l --strip-components 1
  curl -sSL -o freq-$l.txt https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/$l/${l}_50k.txt
done
cd -
node scripts/build-intl-word-lists.mjs /tmp/words
```

To regenerate English:

```bash
mkdir -p /tmp/words && cd /tmp/words
npm pack wordlist-english@1.2.1 && tar xzf wordlist-english-1.2.1.tgz
curl -sSLO https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt
cd -
node scripts/build-word-lists.mjs /tmp/words/package /tmp/words/enable1.txt
```

## Accessibility

- The page's `lang` attribute follows the chosen language, and the language menu marks each option with its own language, so screen readers pronounce them correctly.
- Tiles and keys have `aria-label`s that include their letter and feedback, and each result is announced to screen readers.
- The whole game can be played from a physical keyboard, and all controls have visible focus states.
- High-contrast mode swaps green and yellow for orange and blue, adds a check mark and dot to the tiles and keys, and strikes through used-up keys, so feedback doesn't depend on colour.
- Animations are turned off under `prefers-reduced-motion`.
- All text colour pairs in the game meet a WCAG contrast ratio of at least 4.5:1.
