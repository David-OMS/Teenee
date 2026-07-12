import type { ServerClient } from "@/lib/supabase/create-server-client";

export function formatSupabaseError(context: string, error: { message: string } | null) {
  return error ? `${context}: ${error.message}` : context;
}

export async function querySingle<T>(
  query: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  context: string,
): Promise<T> {
  const { data, error } = await query;
  if (error || !data) {
    throw new Error(formatSupabaseError(context, error));
  }
  return data;
}

export type { ServerClient };
