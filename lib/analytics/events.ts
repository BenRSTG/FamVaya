// Geteiltes Event-Vokabular für die abstrahierte Analytics-Anbindung
// (Spec §27) — Client- und Server-Wrapper (lib/analytics/client.ts,
// lib/analytics/server.ts) exportieren dieselbe trackEvent(name, props)-
// Signatur, sodass der Anbieter (aktuell @vercel/analytics) austauschbar
// bleibt, ohne Call-Sites anzufassen.
export type AnalyticsEvent =
  | "search_performed"
  | "filter_applied"
  | "content_opened"
  | "content_favorited"
  | "outbound_redirect"
  | "newsletter_signup"
  | "finder_completed"
  | "account_created"
  | "favorites_shared";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;
