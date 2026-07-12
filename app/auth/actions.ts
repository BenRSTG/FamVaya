"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Alle Actions laufen über den session-gebundenen Client (anon-Key +
// Cookies), NICHT über lib/supabase/admin.ts — das ist genau der
// Unterscheidungspunkt aus DECISIONS.md: admin.ts nur für öffentliche
// Content-Reads, Auth-Operationen laufen als der Nutzer selbst.

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/konto");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/anmelden?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });

  if (error) {
    redirect(`/registrieren?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/registrieren?success=1");
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });

  if (error) {
    redirect(`/anmelden?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/anmelden?magicLinkSent=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
