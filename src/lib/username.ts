/**
 * Username rules, shared by the browser and the server. The database enforces
 * the same rules in supabase/migrations, because users can update their own
 * profile row directly. A test fails if the lists drift apart.
 */

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

/** Must match the whole name, after normalizing. */
export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "anonymous",
  "endlesslingle",
  "endlesswordle",
  "guest",
  "help",
  "lingle",
  "login",
  "logout",
  "mod",
  "moderator",
  "null",
  "official",
  "owner",
  "privacy",
  "profile",
  "root",
  "staff",
  "support",
  "system",
  "terms",
  "undefined",
  "wordle",
] as const;

/** Must not appear anywhere in the name, after normalizing. */
export const OFFENSIVE_USERNAME_TERMS = [
  "bitch",
  "cunt",
  "fag",
  "fuck",
  "hitler",
  "nazi",
  "nigg",
  "penis",
  "pussy",
  "rape",
  "shit",
  "slut",
  "whore",
] as const;

const USERNAME_PATTERN = new RegExp(`^[A-Za-z0-9_]{${USERNAME_MIN_LENGTH},${USERNAME_MAX_LENGTH}}$`);

const LOOKALIKES: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  $: "s",
};

/** Sees through "A_d_m_1_n". */
export function normalizeUsername(username: string): string {
  return username
    .toLowerCase()
    .replaceAll("_", "")
    .replace(/[013457$]/g, (character) => LOOKALIKES[character]);
}

export type UsernameProblem = "format" | "not_allowed";

export function findUsernameProblem(username: string): UsernameProblem | null {
  if (!USERNAME_PATTERN.test(username)) return "format";

  const normalized = normalizeUsername(username);
  const reserved = (RESERVED_USERNAMES as readonly string[]).includes(normalized);
  const offensive = OFFENSIVE_USERNAME_TERMS.some((term) => normalized.includes(term));
  return reserved || offensive ? "not_allowed" : null;
}

/** The message for a username problem, in the page's language. */
export function usernameProblemMessage(
  problem: UsernameProblem,
  dict: { username: { help: string; unavailable: string } },
): string {
  if (problem === "not_allowed") return dict.username.unavailable;
  return dict.username.help
    .replace("{min}", String(USERNAME_MIN_LENGTH))
    .replace("{max}", String(USERNAME_MAX_LENGTH));
}
