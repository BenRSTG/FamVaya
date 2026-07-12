"use server";

import { getPublishedAccommodations } from "@/lib/data/accommodations";
import { getPublishedActivities } from "@/lib/data/activities";
import { getPublishedMicroAdventures } from "@/lib/data/micro-adventures";
import { buildFinderReasons } from "@/lib/finder-reasons";
import type { FinderInput, FinderResults } from "@/lib/types";

// Regelbasiertes Matching (Bauplan_2.md Phase 3): bildet die Wizard-Eingaben
// auf die bestehenden Übersichts-Filter ab, statt eine eigene
// Empfehlungslogik zu bauen. Bewusst so geschnitten, dass diese Funktion
// später durch einen KI-gestützten Berater ersetzt werden kann, ohne dass
// sich Wizard-UI oder Ergebnis-Rendering ändern müssten — Signatur
// (FinderInput -> FinderResults) bleibt stabil.
const RESULT_LIMIT = 6;

export async function findMatches(input: FinderInput): Promise<FinderResults> {
  const tagSlugs = input.interestTags.map((t) => t.slug);
  const totalGuests = input.adults + input.children;

  const wantsAccommodation = input.area === "unterkunft" || input.area === "unentschlossen";
  const wantsActivity = input.area === "aktivitaet" || input.area === "unentschlossen";
  const wantsMicroAdventure =
    input.area === "mikroabenteuer" || input.area === "unentschlossen";

  const [accommodations, activities, microAdventures] = await Promise.all([
    wantsAccommodation
      ? getPublishedAccommodations({
          minGuests: totalGuests > 0 ? totalGuests : undefined,
          minChildren: input.children > 0 ? input.children : undefined,
          maxPrice: input.maxBudget,
          tagSlugs: tagSlugs.length > 0 ? tagSlugs : undefined,
        })
      : Promise.resolve([]),
    wantsActivity
      ? getPublishedActivities({
          maxPrice: input.maxBudget,
          tagSlugs: tagSlugs.length > 0 ? tagSlugs : undefined,
        })
      : Promise.resolve([]),
    wantsMicroAdventure
      ? getPublishedMicroAdventures({
          // "spontan" schließt nur "moderate" Vorbereitung aus, nicht "light"
          // (z. B. Taschenlampe holen zählt noch als spontan machbar).
          preparationLevel: input.spontaneous ? ["none", "light"] : undefined,
          maxPrice: input.maxBudget,
          tagSlugs: tagSlugs.length > 0 ? tagSlugs : undefined,
        })
      : Promise.resolve([]),
  ]);

  return {
    accommodations: accommodations.slice(0, RESULT_LIMIT).map((item) => ({
      item,
      reasons: buildFinderReasons(input, "unterkunft"),
    })),
    activities: activities.slice(0, RESULT_LIMIT).map((item) => ({
      item,
      reasons: buildFinderReasons(input, "aktivitaet"),
    })),
    microAdventures: microAdventures.slice(0, RESULT_LIMIT).map((item) => ({
      item,
      reasons: buildFinderReasons(input, "mikroabenteuer"),
    })),
  };
}
