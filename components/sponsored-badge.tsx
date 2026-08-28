import { cn } from "@/lib/utils";

// Rechtliche Kennzeichnungspflicht bei bezahlten Partnerschaften — fest,
// nicht wegkonfigurierbar (siehe DECISIONS.md). Wird nur gerendert, wenn
// der Aufrufer is_sponsored bereits geprüft hat.
export function SponsoredBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background shadow-sm",
        className
      )}
    >
      Anzeige
    </span>
  );
}
