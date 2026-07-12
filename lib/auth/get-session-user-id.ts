import type { ServerClient } from "@/lib/supabase/create-server-client";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";

/** V1 single-user auth — uses the first user in the database (dev mode). */
export async function getSessionUserId(supabase: ServerClient): Promise<string> {
  return getDefaultUserId(supabase);
}

export function isDevAuthMode(): boolean {
  return process.env.TEENEE_AUTH_MODE !== "supabase";
}
