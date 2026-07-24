import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_AREAS = ["unterkunft", "aktivitaet", "mikroabenteuer", "unentschlossen"];

// Öffentlich erreichbar, kein Consent-Gate nötig — es werden nur Zahlen
// (Erwachsene/Kinder) und eine Kategorie gespeichert, keine Kennung, die
// eine Person oder ein Gerät identifizierbar macht (siehe DECISIONS.md
// Phase 12).
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { adults, children, area } = (body as Record<string, unknown>) ?? {};

  if (
    typeof adults !== "number" ||
    typeof children !== "number" ||
    typeof area !== "string" ||
    !VALID_AREAS.includes(area)
  ) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase.from("matcher_submissions").insert({ adults, children, area });

  return NextResponse.json({ ok: true });
}
