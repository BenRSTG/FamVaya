"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isResendConfigured, sendTransactionalEmail } from "@/lib/newsletter/resend";
import { renderConfirmationEmail } from "@/lib/newsletter/template";
import { getSiteUrl } from "@/lib/site-url";

// Mindestabstand zwischen zwei Bestätigungs-Mails an dieselbe Adresse,
// damit das Formular nicht zum Mail-Versand an Dritte missbraucht wird.
const RESEND_COOLDOWN_MS = 2 * 60 * 1000;

// Double-Opt-in: Die Anmeldung wird zunächst unbestätigt gespeichert und gilt
// erst nach Klick auf den Link in der Bestätigungs-Mail (siehe
// app/newsletter/bestaetigen/[token]). Läuft über den service_role-Client,
// weil der Bestätigungs-Token nicht an den anon-Client zurückgegeben werden
// darf (newsletter_subscribers hat keine öffentliche Select-Policy).
export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const city = String(formData.get("city") ?? "").trim() || null;
  const childrenCountRaw = String(formData.get("children_count") ?? "");
  const childrenCount = childrenCountRaw ? Number(childrenCountRaw) : null;

  if (!email || !email.includes("@")) {
    redirect("/?newsletter=error#newsletter");
  }

  // Ohne Mail-Versand kann niemand bestätigen — dann ehrlich ablehnen, statt
  // Adressen ohne Einwilligungsnachweis zu speichern.
  if (!isResendConfigured()) {
    redirect("/?newsletter=unavailable#newsletter");
  }

  const supabase = createAdminClient();
  const { data: existing, error: lookupError } = await supabase
    .from("newsletter_subscribers")
    .select("id, confirmed, confirmation_token, confirmation_sent_at")
    .eq("email", email)
    .maybeSingle();
  if (lookupError) redirect("/?newsletter=error#newsletter");

  if (existing?.confirmed) {
    redirect("/?newsletter=duplicate#newsletter");
  }

  let token: string;
  if (existing) {
    // Noch unbestätigt (oder früher abgemeldet): neue Bestätigungs-Mail, aber
    // nicht öfter als einmal pro Cooldown.
    const sentAt = existing.confirmation_sent_at
      ? new Date(existing.confirmation_sent_at).getTime()
      : 0;
    if (Date.now() - sentAt < RESEND_COOLDOWN_MS) {
      redirect("/?newsletter=pending#newsletter");
    }
    token = existing.confirmation_token;
  } else {
    const { data: created, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, city, children_count: childrenCount, confirmed: false })
      .select("confirmation_token")
      .single();
    if (error || !created) redirect("/?newsletter=error#newsletter");
    token = created.confirmation_token;
  }

  try {
    await sendTransactionalEmail({
      to: email,
      subject: "Bitte bestätigt eure FamVaya-Newsletter-Anmeldung",
      html: renderConfirmationEmail({
        confirmUrl: `${getSiteUrl()}/newsletter/bestaetigen/${token}`,
      }),
    });
  } catch {
    redirect("/?newsletter=error#newsletter");
  }

  await supabase
    .from("newsletter_subscribers")
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq("email", email);

  redirect("/?newsletter=pending#newsletter");
}
