export type CompareContentType = "accommodation" | "activity";

export interface CompareItem {
  contentType: CompareContentType;
  id: string;
}

export const COMPARE_MAX_ITEMS = 4;

const CONTENT_TYPES: CompareContentType[] = ["accommodation", "activity"];

export function serializeCompareItems(items: CompareItem[]): string {
  return items.map((item) => `${item.contentType}:${item.id}`).join(",");
}

export function parseCompareItemsParam(param: string | undefined | null): CompareItem[] {
  if (!param) return [];
  return param
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [contentType, id] = entry.split(":");
      return { contentType, id } as CompareItem;
    })
    .filter((item) => CONTENT_TYPES.includes(item.contentType) && item.id)
    .slice(0, COMPARE_MAX_ITEMS);
}
