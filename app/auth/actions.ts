"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/analytics/server";
import { requireUser } from "@/lib/auth";

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
  await trackEvent("account_created");
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

// Absichtlich immer derselbe Erfolgs-Redirect, unabhängig davon, ob die
// E-Mail existiert oder Supabase intern einen Fehler wirft (z. B. das
// eingebaute Rate-Limit ohne eigenes SMTP, siehe DECISIONS.md Phase 15) —
// verhindert User-Enumeration und vermeidet eine verwirrende Fehlermeldung
// für ein Problem, das der Nutzer eh nicht selbst beheben kann.
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "");

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/recovery`,
  });

  redirect("/passwort-vergessen?success=1");
}

export async function setNewPassword(formData: FormData) {
  const user = await requireUser();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const next = String(formData.get("next") ?? "/konto");

  if (password.length < 8) {
    redirect(
      `/konto/passwort-setzen?error=${encodeURIComponent("Das Passwort muss mindestens 8 Zeichen lang sein.")}&next=${encodeURIComponent(next)}`
    );
  }
  if (password !== passwordConfirm) {
    redirect(
      `/konto/passwort-setzen?error=${encodeURIComponent("Die Passwörter stimmen nicht überein.")}&next=${encodeURIComponent(next)}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(
      `/konto/passwort-setzen?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    );
  }

  await supabase.from("users").update({ must_change_password: false }).eq("id", user.id);

  redirect(next);
}
