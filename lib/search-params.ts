export type SearchParams = Record<string, string | string[] | undefined>;

export function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function toStringParam(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw || undefined;
}

export function toBoolean(value: string | string[] | undefined): boolean {
  return toStringParam(value) === "true";
}
