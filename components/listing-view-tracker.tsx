"use client";

import { useEffect } from "react";
import { trackFamvayaEvent } from "@/lib/client-events";

// Auf Detailseiten platziert (Unterkunft/Aktivität/Mikro-Abenteuer/Magazin),
// feuert einmalig beim Mount — siehe DECISIONS.md Phase 13.
export function ListingViewTracker({
  entityType,
  entityId,
}: {
  entityType: string;
  entityId: string;
}) {
  useEffect(() => {
    trackFamvayaEvent("listing_viewed", { entityType, entityId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId]);

  return null;
}
