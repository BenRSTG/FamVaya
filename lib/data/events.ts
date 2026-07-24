import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getConsent } from "@/lib/consent";

export type EventType =
  | "page_view"
  | "matcher_submit"
  | "filter_applied"
  | "listing_viewed"
  | "cta_clicked"
  | "zero_result_search"
  | "newsletter_signup"
  | "favorite_added";

export interface LogEventParams {
  eventType: EventType;
  sessionId?: string | null;
  pagePath?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  referrerDomain?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  deviceType?: "mobile" | "tablet" | "desktop" | null;
  country?: string | null;
}

export async function logEvent(params: LogEventParams): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("events").insert({
    event_type: params.eventType,
    session_id: params.sessionId ?? null,
    page_path: params.pagePath ?? null,
    entity_type: params.entityType ?? null,
    entity_id: params.entityId ?? null,
    metadata: params.metadata ?? {},
    referrer_domain: params.referrerDomain ?? null,
    utm_source: params.utmSource ?? null,
    utm_medium: params.utmMedium ?? null,
    utm_campaign: params.utmCampaign ?? null,
    device_type: params.deviceType ?? null,
    country: params.country ?? null,
  });
}

// Serverseitig ausgelöste Events (Listen-/Suchseiten, Newsletter) haben
// keinen Zugriff auf sessionStorage, daher kein session_id — siehe
// DECISIONS.md Phase 13. Consent wird hier geprüft, da diese Aufrufe
// nicht über /api/events (und damit lib/client-events.ts) laufen.
export async function logFilterApplied(
  pagePath: string,
  filters: Record<string, unknown>
): Promise<void> {
  if ((await getConsent()) !== "accepted") return;
  await logEvent({ eventType: "filter_applied", pagePath, metadata: filters });
}

export async function logZeroResultSearch(
  pagePath: string,
  metadata: Record<string, unknown>
): Promise<void> {
  if ((await getConsent()) !== "accepted") return;
  await logEvent({ eventType: "zero_result_search", pagePath, metadata });
}
