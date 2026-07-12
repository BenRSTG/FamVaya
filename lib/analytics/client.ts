import { track } from "@vercel/analytics";
import type { AnalyticsEvent, AnalyticsProps } from "@/lib/analytics/events";

// Für Client Components (Merken-Button, Suchformular, Finder-Abschluss,
// Merkliste-Freigabe).
export function trackEvent(name: AnalyticsEvent, props?: AnalyticsProps): void {
  track(name, props);
}
