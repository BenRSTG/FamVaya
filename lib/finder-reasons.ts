import type { FinderInput } from "@/lib/types";

// Reine Funktion (keine DB-Zugriffe) — leitet die "warum passt das zur
// Familie"-Begründung (Spec §13) aus den aktiv gewählten Finder-Kriterien
// her, nicht pro Treffer einzeln gegen die DB zurückverifiziert (siehe
// DECISIONS.md).
export function buildFinderReasons(
  input: FinderInput,
  area: "unterkunft" | "aktivitaet" | "mikroabenteuer"
): string[] {
  const reasons: string[] = [];

  if (area === "unterkunft" && input.adults + input.children > 0) {
    reasons.push(
      `Bietet Platz für ${input.adults} Erwachsene und ${input.children} Kinder`
    );
  }
  if (input.maxBudget != null) {
    reasons.push(
      input.maxBudget === 0
        ? "Kostenlos"
        : `Passt zu eurem Budget von bis zu ${input.maxBudget} €`
    );
  }
  if (area === "mikroabenteuer" && input.spontaneous) {
    reasons.push("Spontan umsetzbar");
  }
  if (input.interestTags.length > 0) {
    reasons.push(
      `Passt zu euren Interessen: ${input.interestTags.map((t) => t.name).join(", ")}`
    );
  }
  if (reasons.length === 0) {
    reasons.push("Empfohlen von FamVaya");
  }

  return reasons;
}
