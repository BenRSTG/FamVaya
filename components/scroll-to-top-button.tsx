"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Etwas höher als bottom-4, damit der Button nicht mit der Vergleichs-Leiste
// (components/compare/compare-tray.tsx, ebenfalls fixed bottom-4 right-4)
// kollidiert, falls beide gleichzeitig sichtbar sind.
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Nach oben scrollen"
      className="fixed bottom-20 right-4 z-40 flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg hover:bg-secondary"
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
