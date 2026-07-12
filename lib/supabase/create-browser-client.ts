import { createClient } from "@supabase/supabase-js";

import { readSupabaseEnv } from "@/lib/supabase/read-supabase-env";

/** Browser client — uses publishable key, respects RLS. */
export function createBrowserClient() {
  const env = readSupabaseEnv();

  return createClient(env.url, env.publishableKey);
}

export type BrowserClient = ReturnType<typeof createBrowserClient>;
