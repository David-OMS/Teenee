import { createClient } from "@supabase/supabase-js";

import { assertServerKeyIsNotPublishable } from "@/lib/supabase/assert-server-key";
import { readSupabaseEnv } from "@/lib/supabase/read-supabase-env";

/** Server-side client — uses secret key, bypasses RLS. For API routes + seed. */
export function createServerClient() {
  const env = readSupabaseEnv();
  assertServerKeyIsNotPublishable(env);

  return createClient(env.url, env.secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type ServerClient = ReturnType<typeof createServerClient>;
