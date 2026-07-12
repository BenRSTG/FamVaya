import "server-only";
import { track } from "@vercel/analytics/server";
import type { AnalyticsEvent, AnalyticsProps } from "@/lib/analytics/events";

// Für Server Actions / Route Handler (z. B. /go/-Redirect, Newsletter-
// Anmeldung, Account-Erstellung).
export async function trackEvent(name: AnalyticsEvent, props?: AnalyticsProps): Promise<void> {
  await track(name, props);
}
