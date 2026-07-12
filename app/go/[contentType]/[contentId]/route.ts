import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isContentType,
  OVERVIEW_PATH_BY_CONTENT_TYPE,
  TABLE_BY_CONTENT_TYPE,
} from "@/lib/content-type";
import { resolveRedirectTarget, type RedirectRow } from "@/lib/redirect";
import { trackEvent } from "@/lib/analytics/server";

// Affiliate-Redirect-Route (Spec §23): Klick protokollieren, dann zum
// Anbieter weiterleiten. service_role-Client nötig, da outbound_clicks
// RLS aktiv ohne Policies hat (siehe DECISIONS.md). Die Entscheidungslogik
// (Ziel-URL/Logging) steckt in lib/redirect.ts, damit sie ohne Route-
// Handler-Mocking testbar ist (siehe lib/redirect.test.ts).

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/go/[contentType]/[contentId]">
) {
  const { contentType, contentId } = await ctx.params;

  if (!isContentType(contentType)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = createAdminClient();
  // micro_adventures hat keine provider_id-Spalte (Spec §20).
  const hasProvider = contentType !== "micro_adventure";
  const columns = hasProvider
    ? "slug, affiliate_url, external_url, provider_id"
    : "slug, affiliate_url, external_url";

  const { data: row } = await supabase
    .from(TABLE_BY_CONTENT_TYPE[contentType])
    .select(columns)
    .eq("id", contentId)
    .maybeSingle();

  const overviewUrl = new URL(OVERVIEW_PATH_BY_CONTENT_TYPE[contentType], request.url);
  if (!row) {
    return NextResponse.redirect(overviewUrl);
  }

  const typedRow = row as unknown as RedirectRow;
  const decision = resolveRedirectTarget(typedRow);

  if (!decision.targetUrl) {
    // Kein externer Link hinterlegt -> zurück zur Detailseite statt totem Link.
    return NextResponse.redirect(
      new URL(`${OVERVIEW_PATH_BY_CONTENT_TYPE[contentType]}/${typedRow.slug}`, request.url)
    );
  }

  if (decision.shouldLog) {
    await supabase.from("outbound_clicks").insert({
      content_type: contentType,
      content_id: contentId,
      provider_id: hasProvider ? (typedRow.provider_id ?? null) : null,
      target_url: decision.targetUrl,
    });
    await trackEvent("outbound_redirect", { contentType, contentId });
  }

  return NextResponse.redirect(decision.targetUrl, { status: 307 });
}
