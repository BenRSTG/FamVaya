// Schwellenwerte aus Spec §21 (Großfamilien-Eignung).

export type FamilyRatingTier =
  | "excellent"
  | "very_good"
  | "good"
  | "limited"
  | "not_suitable";

export interface FamilyRatingInfo {
  tier: FamilyRatingTier;
  label: string;
}

export function getFamilyRatingLabel(score: number): FamilyRatingInfo {
  if (score >= 90) return { tier: "excellent", label: "Hervorragend für große Familien" };
  if (score >= 75) return { tier: "very_good", label: "Sehr gut geeignet" };
  if (score >= 60) return { tier: "good", label: "Gut geeignet" };
  if (score >= 40) return { tier: "limited", label: "Mit Einschränkungen geeignet" };
  return { tier: "not_suitable", label: "Eher ungeeignet" };
}
