import type { ContentType } from "@/lib/types";

// Geteilte Konstanten für die drei Content-Typen — genutzt von der
// /go/-Redirect-Route und der globalen Suche, um Duplizierung zu vermeiden.

export const TABLE_BY_CONTENT_TYPE: Record<ContentType, string> = {
  accommodation: "accommodations",
  activity: "activities",
  micro_adventure: "micro_adventures",
};

export const OVERVIEW_PATH_BY_CONTENT_TYPE: Record<ContentType, string> = {
  accommodation: "/familienunterkuenfte",
  activity: "/familienaktivitaeten",
  micro_adventure: "/mikro-familienabenteuer",
};

export function isContentType(value: string): value is ContentType {
  return Object.prototype.hasOwnProperty.call(TABLE_BY_CONTENT_TYPE, value);
}
