import type { DateRange } from "@/lib/data/reporting";
import { toStringParam, type SearchParams } from "@/lib/search-params";

const PRESET_DAYS: Record<string, number> = { today: 1, "7d": 7, "30d": 30 };
export const PRESET_LABEL: Record<string, string> = {
  today: "Heute",
  "7d": "7 Tage",
  "30d": "30 Tage",
};

export function resolveReportRange(params: SearchParams): { range: DateRange; preset: string } {
  const from = toStringParam(params.from);
  const to = toStringParam(params.to);
  if (from && to) {
    const toEnd = new Date(to);
    toEnd.setDate(toEnd.getDate() + 1);
    return { range: { from: new Date(from).toISOString(), to: toEnd.toISOString() }, preset: "custom" };
  }
  const preset = toStringParam(params.preset) ?? "7d";
  const days = PRESET_DAYS[preset] ?? 7;
  const now = new Date();
  const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { range: { from: fromDate.toISOString(), to: now.toISOString() }, preset };
}

// Für Query-Strings, die den aktuellen Zeitraum an CSV-Export/Unterseiten
// weiterreichen (Preset ODER from/to, je nachdem was aktiv ist).
export function rangeQueryString(params: SearchParams): string {
  const from = toStringParam(params.from);
  const to = toStringParam(params.to);
  if (from && to) return `from=${from}&to=${to}`;
  const preset = toStringParam(params.preset) ?? "7d";
  return `preset=${preset}`;
}
