import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Für geschützte Server Components (/konto, /merkliste): redirect statt Fehler.
export async function requireUser(next?: string): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/anmelden${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  }

  return user;
}

// Für Stellen, die den Login-Status nur anzeigen, aber nicht erzwingen
// (z. B. SiteHeader).
export async function getOptionalUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
