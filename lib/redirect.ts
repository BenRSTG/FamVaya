// Reine Entscheidungslogik der /go/-Redirect-Route, extrahiert für
// Testbarkeit (Spec §34: "externe Weiterleitung") — siehe lib/redirect.test.ts.
export interface RedirectRow {
  slug: string;
  affiliate_url: string | null;
  external_url: string | null;
  provider_id?: string | null;
}

export interface RedirectDecision {
  /** Ziel-URL für den Redirect, oder null falls keine externe URL hinterlegt ist. */
  targetUrl: string | null;
  /** Ob ein outbound_clicks-Eintrag protokolliert werden soll. */
  shouldLog: boolean;
}

export function resolveRedirectTarget(row: RedirectRow | null): RedirectDecision {
  if (!row) return { targetUrl: null, shouldLog: false };

  const targetUrl = row.affiliate_url ?? row.external_url ?? null;
  return { targetUrl, shouldLog: targetUrl != null };
}
