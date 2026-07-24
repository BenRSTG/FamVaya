import { NextResponse, type NextRequest } from "next/server";
import { logEvent, type EventType } from "@/lib/data/events";

// Öffentlich erreichbar (anonyme Besucher, kein Login), aufgerufen von
// lib/client-events.ts#trackFamvayaEvent() — Consent wird dort bereits
// geprüft, bevor überhaupt gesendet wird (siehe DECISIONS.md Phase 13).
// Nur die client-seitig auslösbaren Event-Typen sind hier erlaubt;
// filter_applied/zero_result_search/newsletter_signup laufen serverseitig
// direkt über lib/data/events.ts#logEvent(), nicht über diese Route.
const CLIENT_EVENT_TYPES: readonly EventType[] = [
  "page_view",
  "matcher_submit",
  "listing_viewed",
  "cta_clicked",
  "favorite_added",
];

function classifyDeviceType(userAgent: string | null): "mobile" | "tablet" | "desktop" | null {
  if (!userAgent) return null;
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

function referrerDomain(referrer: unknown): string | null {
  if (typeof referrer !== "string" || !referrer) return null;
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function optionalString(value: unknown, maxLength = 200): string | null {
  return typeof value === "string" && value ? value.slice(0, maxLength) : null;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const data = (body as Record<string, unknown>) ?? {};
  const eventType = data.event_type;

  if (
    typeof eventType !== "string" ||
    !CLIENT_EVENT_TYPES.includes(eventType as EventType)
  ) {
    return NextResponse.json({ error: "invalid event_type" }, { status: 400 });
  }

  await logEvent({
    eventType: eventType as EventType,
    sessionId: optionalString(data.session_id, 100),
    pagePath: optionalString(data.page_path, 500),
    entityType: optionalString(data.entity_type, 50),
    entityId: optionalString(data.entity_id, 100),
    metadata:
      data.metadata && typeof data.metadata === "object"
        ? (data.metadata as Record<string, unknown>)
        : {},
    referrerDomain: referrerDomain(data.referrer),
    utmSource: optionalString(data.utm_source),
    utmMedium: optionalString(data.utm_medium),
    utmCampaign: optionalString(data.utm_campaign),
    deviceType: classifyDeviceType(request.headers.get("user-agent")),
    country: optionalString(request.headers.get("x-vercel-ip-country"), 10),
  });

  return NextResponse.json({ ok: true });
}
