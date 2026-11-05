import "server-only";

export interface User {
  id: string;
}

/**
 * V2 extension point: return the signed-in user from Supabase Auth or similar.
 * V1 has no accounts, so everyone is anonymous.
 */
export async function getCurrentUser(): Promise<User | null> {
  return null;
}
