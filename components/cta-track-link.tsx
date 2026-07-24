"use client";

import type { ComponentPropsWithoutRef } from "react";
import { trackFamvayaEvent } from "@/lib/client-events";

// Wird als Button-`render`-Prop übergeben (Base UI klont das Element und
// injiziert className/children) — feuert cta_clicked, bevor die native
// Navigation weiterläuft. outbound_clicks (lib/redirect.ts) bleibt die
// maßgebliche Server-Klick-Quelle für /go/, dies ist nur das client-
// seitige Begleit-Event fürs Funnel-Tracking (siehe DECISIONS.md Phase 13).
interface CtaTrackLinkProps extends ComponentPropsWithoutRef<"a"> {
  entityType: string;
  entityId: string;
}

export function CtaTrackLink({
  entityType,
  entityId,
  onClick,
  ...props
}: CtaTrackLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackFamvayaEvent("cta_clicked", { entityType, entityId });
        onClick?.(event);
      }}
    />
  );
}
