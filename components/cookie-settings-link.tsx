"use client";

import { useTransition } from "react";
import { resetConsent } from "@/lib/actions/consent";

export function CookieSettingsLink() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => resetConsent())}
      className="underline-offset-2 hover:underline disabled:opacity-50"
    >
      Cookie-Einstellungen
    </button>
  );
}
