"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_KEY = "famvaya-session-id";

// Sitzungs-ID lebt bewusst in sessionStorage, nicht in einem Cookie —
// der Cookie-Consent-Banner verspricht "cookie-freie Nutzungsstatistiken",
// das soll wörtlich stimmen (siehe DECISIONS.md, Phase 12). Wird nur
// gerendert, wenn Consent bereits erteilt ist (siehe app/layout.tsx).
function getSessionId(): string {
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const payload = {
      session_id: getSessionId(),
      path: pathname,
      referrer: document.referrer || null,
      utm_source: searchParams.get("utm_source"),
      utm_medium: searchParams.get("utm_medium"),
      utm_campaign: searchParams.get("utm_campaign"),
    };
    fetch("/api/track/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
