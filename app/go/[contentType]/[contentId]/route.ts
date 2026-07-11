import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContentType } from "@/lib/types";

// Affiliate-Redirect-Route (Spec §23): Klick protokollieren, dann zum
// Anbieter weiterleiten. service_role-Client nötig, da outbound_clicks
// RLS aktiv ohne Policies hat (siehe DECISIONS.md).

const TABLE_BY_CONTENT_TYPE: Record<ContentType, string> = {
  accommodation: "accommodations",
  activity: "activities",
  micro_adventure: "micro_adventures",
};

const DETAIL_PATH_BY_CONTENT_TYPE: Record<ContentType, string> = {
  accommodation: "/familienunterkuenfte",
  activity: "/familienaktivitaeten",
  micro_adventure: "/mikro-familienabenteuer",
};

function isContentType(value: string): value is ContentType {
  return Object.prototype.hasOwnProperty.call(TABLE_BY_CONTENT_TYPE, value);
}

interface RedirectTargetRow {
  slug: string;
  affiliate_url: string | null;
  external_url: string | null;
  provider_id?: string | null;
}

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

  const overviewUrl = new URL(DETAIL_PATH_BY_CONTENT_TYPE[contentType], request.url);
  if (!row) {
    return NextResponse.redirect(overviewUrl);
  }

  const typedRow = row as unknown as RedirectTargetRow;
  const targetUrl = typedRow.affiliate_url ?? typedRow.external_url;

  if (!targetUrl) {
    // Kein externer Link hinterlegt -> zurück zur Detailseite statt totem Link.
    return NextResponse.redirect(
      new URL(`${DETAIL_PATH_BY_CONTENT_TYPE[contentType]}/${typedRow.slug}`, request.url)
    );
  }

  await supabase.from("outbound_clicks").insert({
    content_type: contentType,
    content_id: contentId,
    provider_id: hasProvider ? (typedRow.provider_id ?? null) : null,
    target_url: targetUrl,
  });

  return NextResponse.redirect(targetUrl, { status: 307 });
}
