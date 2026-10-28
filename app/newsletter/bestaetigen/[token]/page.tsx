import type { Metadata } from "next";
import { confirmSubscriptionByToken } from "@/lib/data/newsletter-campaigns";
import { trackEvent } from "@/lib/analytics/server";
import { logEvent } from "@/lib/data/events";
import { getConsent } from "@/lib/consent";

export const metadata: Metadata = {
  title: "Newsletter bestätigen",
  robots: { index: false },
};

// Ziel des Links aus der Double-Opt-in-Mail. Öffentlich ohne Auth; der
// zufällige Token (UUID) ist der Nachweis, dass jemand Zugriff auf das
// Postfach hat. Idempotent: ein zweiter Aufruf ändert nichts mehr.
export default async function NewsletterConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await confirmSubscriptionByToken(token);

  if (result === "confirmed") {
    await trackEvent("newsletter_signup");
    // Bewusst ohne E-Mail-Adresse im metadata — siehe DECISIONS.md Phase 13.
    if ((await getConsent()) === "accepted") {
      await logEvent({ eventType: "newsletter_signup" });
    }
  }

  const ok = result === "confirmed" || result === "already_confirmed";

  return (
    <div className="mx-auto w-full max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="mb-3 text-2xl font-semibold text-foreground">
        {ok ? "Anmeldung bestätigt" : "Link nicht gültig"}
      </h1>
      <p className="text-muted-foreground">
        {result === "confirmed" &&
          "Danke! Ihr bekommt ab jetzt neue Familienideen von FamVaya. Abmelden könnt ihr euch jederzeit über den Link in jeder E-Mail."}
        {result === "already_confirmed" && "Eure Anmeldung war schon bestätigt, ihr müsst nichts weiter tun."}
        {result === "invalid" &&
          "Dieser Bestätigungslink ist nicht gültig. Bitte meldet euch auf der Startseite noch einmal an."}
      </p>
    </div>
  );
}
