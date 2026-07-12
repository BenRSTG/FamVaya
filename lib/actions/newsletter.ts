"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Läuft über den session-gebundenen (anon-Key-)Client, nicht über
// lib/supabase/admin.ts — die neue newsletter_subscribers-Insert-Policy
// (siehe supabase/migrations/0013_auth.sql) ist absichtlich öffentlich,
// das hier ist der reguläre Weg, sie zu nutzen.
export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim() || null;
  const childrenCountRaw = String(formData.get("children_count") ?? "");
  const childrenCount = childrenCountRaw ? Number(childrenCountRaw) : null;

  if (!email) {
    redirect("/?newsletter=error#newsletter");
  }

  const supabase = await createClient();
  // Vereinfachtes Single-Opt-in (confirmed=true sofort) statt Double-Opt-in,
  // da kein Resend-API-Key hinterlegt ist — siehe DECISIONS.md.
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    city,
    children_count: childrenCount,
    confirmed: true,
  });

  if (error) {
    if (error.code === "23505") {
      redirect("/?newsletter=duplicate#newsletter");
    }
    redirect("/?newsletter=error#newsletter");
  }

  redirect("/?newsletter=success#newsletter");
}
