import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * service_role client for public, read-only content queries in Server
 * Components (accommodations/activities/micro_adventures have no RLS
 * policies yet — see DECISIONS.md). Never import this from a 'use client'
 * file; the "server-only" import throws at build time if that happens.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
