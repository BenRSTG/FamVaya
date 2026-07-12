// Geteilte FormData-Parsing-Helper für die Admin-Server-Actions (Phase 5) —
// alle Content-Formulare (Unterkünfte/Aktivitäten/Mikro-Abenteuer/Magazin/
// Anbieter) folgen demselben Textfeld-/Zahl-/Checkbox-Muster.

export function stringOrNull(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export function requiredString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function numberOrNull(formData: FormData, key: string): number | null {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function checkboxOn(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export function dateOrNull(formData: FormData, key: string): string | null {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  return new Date(raw).toISOString();
}

export function stringList(formData: FormData, key: string): string[] {
  return formData.getAll(key).map(String);
}

// Für text[]-Spalten, die im Formular als ein kommagetrenntes Textfeld
// gepflegt werden (z. B. materials/seasonal_tags/weather_tags).
export function commaSeparatedList(formData: FormData, key: string): string[] {
  const raw = String(formData.get(key) ?? "");
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
