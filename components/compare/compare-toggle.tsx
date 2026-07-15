"use client";

import { Check, Scale } from "lucide-react";
import { useCompare } from "@/components/compare/compare-context";
import type { CompareContentType } from "@/lib/compare";
import { cn } from "@/lib/utils";

export function CompareToggle({
  contentType,
  id,
  className,
}: {
  contentType: CompareContentType;
  id: string;
  className?: string;
}) {
  const { isSelected, toggle, isFull } = useCompare();
  const selected = isSelected(contentType, id);
  const disabled = !selected && isFull;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={selected ? "Aus Vergleich entfernen" : "Zum Vergleich hinzufügen"}
      title={
        disabled
          ? "Maximal 4 Angebote vergleichbar"
          : selected
            ? "Aus Vergleich entfernen"
            : "Zum Vergleich hinzufügen"
      }
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(contentType, id);
      }}
      className={cn(
        "flex size-8 items-center justify-center rounded-full shadow-sm transition-colors",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-background/90 text-foreground hover:bg-background",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {selected ? <Check className="size-4" aria-hidden /> : <Scale className="size-4" aria-hidden />}
    </button>
  );
}
