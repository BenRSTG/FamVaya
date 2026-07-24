"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackFamvayaEvent } from "@/lib/client-events";

// Nur gerendert, wenn Consent bereits erteilt ist (siehe app/layout.tsx) —
// trackFamvayaEvent() prüft den Consent-Cookie zusätzlich selbst noch
// einmal zentral (siehe DECISIONS.md Phase 13).
export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackFamvayaEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
