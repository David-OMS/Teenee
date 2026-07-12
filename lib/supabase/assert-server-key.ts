import type { SupabaseEnv } from "@/lib/supabase/read-supabase-env";

/** Warns when server accidentally uses the publishable (anon) key. */
export function assertServerKeyIsNotPublishable(env: SupabaseEnv) {
  if (env.secretKey === env.publishableKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY must be the service_role key — not the publishable/anon key. Check Supabase → Project Settings → API.",
    );
  }
}
