import type { Metadata } from "next";
import { unsubscribeByToken } from "@/lib/data/newsletter-campaigns";

export const metadata: Metadata = {
  title: "Newsletter abbestellen",
};

// Öffentliche Seite ohne Auth — Abmeldung ist bewusst mit einem Klick auf
// den Link erledigt (kein zusätzlicher Bestätigungsschritt), gleiches
// Vorgehen wie bei den meisten Newsletter-Abmeldelinks. Idempotent: ein
// erneuter Aufruf desselben Tokens ändert nichts mehr.
export default async function NewsletterUnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const success = await unsubscribeByToken(token);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="mb-3 text-2xl font-semibold text-foreground">
        {success ? "Abgemeldet" : "Link nicht gültig"}
      </h1>
      <p className="text-muted-foreground">
        {success
          ? "Ihr seid vom FamVaya-Newsletter abgemeldet und erhaltet keine weiteren E-Mails mehr."
          : "Dieser Abmelde-Link ist nicht mehr gültig. Falls ihr weiterhin E-Mails erhaltet, meldet euch gerne bei uns."}
      </p>
    </div>
  );
}
