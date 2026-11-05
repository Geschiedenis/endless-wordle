import { z } from "zod";
import { findUsernameProblem } from "@/lib/username";

/** bcrypt, which Supabase uses, only reads the first 72 bytes. */
const PASSWORD_MAX_LENGTH = 72;
export const PASSWORD_MIN_LENGTH = 8;

const email = z.string().trim().toLowerCase().max(254).pipe(z.email());

const newPassword = z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH);

export const loginSchema = z.strictObject({
  email,
  password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
});

export const signupSchema = z.strictObject({ email, password: newPassword });

export const emailSchema = z.strictObject({ email });

export const updatePasswordSchema = z.strictObject({ password: newPassword });

export const usernameSchema = z.strictObject({
  username: z.string().refine((value) => findUsernameProblem(value) === null),
});

export const deleteAccountSchema = z.strictObject({ confirm: z.string().min(1).max(32) });

