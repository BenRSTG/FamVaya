import { NextResponse, type NextRequest } from "next/server";
import { requireAdminOrEditor } from "@/lib/auth";
import { getOverviewStats, getContentPerformanceStats } from "@/lib/data/reporting";
import { resolveReportRange } from "@/lib/report-range";
import type { SearchParams } from "@/lib/search-params";

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

// Nur für Übersicht + Content-Performance (Abnahme-Check-Minimum, siehe
// DECISIONS.md Phase 13) — requireAdminOrEditor() schützt wie jede andere
// Admin-Route.
export async function GET(request: NextRequest) {
  await requireAdminOrEditor("/admin/reporting");

  const url = new URL(request.url);
  const params: SearchParams = Object.fromEntries(url.searchParams.entries());
  const view = url.searchParams.get("view");
  const { range } = resolveReportRange(params);

  let csv: string;
  let filename: string;

  if (view === "content") {
    const stats = await getContentPerformanceStats(range);
    csv = toCsv([
      ["Typ", "Titel", "Aufrufe", "CTA-Klicks", "CTR"],
      ...stats.top.map((row) => [
        row.entityType,
        row.title,
        row.views,
        row.clicks,
        row.ctr != null ? `${(row.ctr * 100).toFixed(1)}%` : "",
      ]),
    ]);
    filename = "famvaya-reporting-content.csv";
  } else {
    const stats = await getOverviewStats(range);
    csv = toCsv([
      ["Kennzahl", "Wert"],
      ["Besucher", stats.visitors],
      ["Seitenaufrufe", stats.pageViews],
      ["Matcher-Nutzungen", stats.matcherSubmits],
      ["Suchen ohne Treffer", stats.zeroResultCount],
      ["Zero-Result-Anteil", stats.zeroResultRate != null ? `${(stats.zeroResultRate * 100).toFixed(1)}%` : ""],
      ["CTA-Klicks", stats.ctaClicks],
      ["Conversion-Rate", stats.conversionRate != null ? `${(stats.conversionRate * 100).toFixed(1)}%` : ""],
    ]);
    filename = "famvaya-reporting-overview.csv";
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
