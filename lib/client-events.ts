import type { EventType } from "@/lib/data/events";

const SESSION_KEY = "famvaya-session-id";
// Muss mit CONSENT_COOKIE_NAME in lib/consent.ts übereinstimmen — hier
// bewusst dupliziert statt importiert, da lib/consent.ts "next/headers"
// lädt und damit nicht in Client-Bundles importierbar ist.
const CONSENT_COOKIE_NAME = "famvaya-consent";

// Sitzungs-ID lebt bewusst in sessionStorage, nicht in einem Cookie —
// der Cookie-Consent-Banner verspricht "cookie-freie Nutzungsstatistiken",
// das soll wörtlich stimmen (siehe DECISIONS.md, Phase 12/13).
export function getSessionId(): string {
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function hasAnalyticsConsent(): boolean {
  return document.cookie
    .split("; ")
    .some((entry) => entry === `${CONSENT_COOKIE_NAME}=accepted`);
}

export interface ClientEventProps {
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

// Zentraler Consent-Check statt pro Tracking-Komponente — siehe
// DECISIONS.md Phase 13. Sendet per sendBeacon (überlebt Navigation/
// Tab-Schließen zuverlässiger als fetch), Fallback auf fetch+keepalive.
export function trackFamvayaEvent(eventType: EventType, props?: ClientEventProps): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  const payload = JSON.stringify({
    event_type: eventType,
    session_id: getSessionId(),
    page_path: window.location.pathname,
    entity_type: props?.entityType ?? null,
    entity_id: props?.entityId ?? null,
    metadata: props?.metadata ?? {},
    referrer: document.referrer || null,
    utm_source: new URLSearchParams(window.location.search).get("utm_source"),
    utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
    utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    const ok = navigator.sendBeacon("/api/events", blob);
    if (ok) return;
  }

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
