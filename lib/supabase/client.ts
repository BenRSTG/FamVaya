import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Foundation for Phase 0 — not yet consumed by
 * any component, wired up so later phases (auth, favorites, ...) can import
 * it directly.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
