"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useCompare } from "@/components/compare/compare-context";
import { serializeCompareItems } from "@/lib/compare";

export function CompareTray() {
  const { items, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-card py-2 pl-4 pr-2 shadow-lg">
      <Scale className="size-4 shrink-0 text-primary" aria-hidden />
      <Link
        href={`/vergleichen?items=${encodeURIComponent(serializeCompareItems(items))}`}
        className="text-sm font-medium text-foreground hover:underline"
      >
        {items.length} {items.length === 1 ? "Angebot" : "Angebote"} vergleichen
      </Link>
      <button
        type="button"
        aria-label="Vergleich leeren"
        title="Vergleich leeren"
        onClick={clear}
        className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
