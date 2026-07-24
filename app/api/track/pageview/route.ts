import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Öffentlich erreichbar (anonyme Besucher, kein Login) — wird nur vom
// consent-gated components/visitor-tracker.tsx aufgerufen, siehe
// DECISIONS.md Phase 12. Minimal validiert, keine personenbezogenen
// Daten außer der clientseitig erzeugten, zufälligen session_id.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { session_id, path, referrer, utm_source, utm_medium, utm_campaign } =
    (body as Record<string, unknown>) ?? {};

  if (typeof session_id !== "string" || typeof path !== "string") {
    return NextResponse.json({ error: "session_id and path required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase.from("page_views").insert({
    session_id,
    path,
    referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
    utm_source: typeof utm_source === "string" ? utm_source.slice(0, 200) : null,
    utm_medium: typeof utm_medium === "string" ? utm_medium.slice(0, 200) : null,
    utm_campaign: typeof utm_campaign === "string" ? utm_campaign.slice(0, 200) : null,
  });

  return NextResponse.json({ ok: true });
}
