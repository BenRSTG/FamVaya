"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { setConsent } from "@/lib/actions/consent";
import type { ConsentValue } from "@/lib/consent";

export function CookieConsentBanner({ initialConsent }: { initialConsent: ConsentValue }) {
  const [dismissed, setDismissed] = useState(false);
  const [, startTransition] = useTransition();

  if (initialConsent !== null || dismissed) return null;

  function respond(accepted: boolean) {
    setDismissed(true);
    startTransition(async () => {
      await setConsent(accepted);
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-4 shadow-lg sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Wir verwenden nur technisch notwendige Cookies. Anonyme, cookie-freie
          Nutzungsstatistiken (Vercel Analytics) erfassen wir erst nach eurer
          Zustimmung. Mehr dazu in der{" "}
          <Link href="/datenschutz" className="underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => respond(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => respond(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Annehmen
          </button>
        </div>
      </div>
    </div>
  );
}
