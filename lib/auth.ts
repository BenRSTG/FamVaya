import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAccessAdmin, isAdmin } from "@/lib/roles";
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

// Für den Admin-Bereich (Phase 5). Content-Tabellen bekommen bewusst keine
// eigenen RLS-Policies (siehe DECISIONS.md) — dieser Check ist die einzige
// Durchsetzung, JEDE Admin-Server-Action muss ihn zuerst aufrufen, bevor sie
// lib/supabase/admin.ts anfasst.
export async function requireAdminOrEditor(next?: string): Promise<User> {
  const user = await requireUser(next);

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canAccessAdmin(profile?.role)) {
    redirect("/");
  }

  return user;
}

// Für die Vorschau (?preview=1) auf den öffentlichen Detailseiten (Phase 5):
// rein lesende Sichtbarkeitsprüfung, kein redirect wie bei requireUser().
export async function canPreview(): Promise<boolean> {
  const user = await getOptionalUser();
  if (!user) return false;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return canAccessAdmin(profile?.role);
}

// Strenger als requireAdminOrEditor(): für Aktionen, bei denen ein Editor zu
// viel Macht hätte (z. B. Nutzerrollen ändern — sonst könnte sich ein Editor
// selbst zum Admin befördern).
export async function requireAdmin(next?: string): Promise<User> {
  const user = await requireUser(next);

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!isAdmin(profile?.role)) {
    redirect("/");
  }

  return user;
}
