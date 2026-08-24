import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function PersonallyTestedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1 text-xs font-medium text-success-foreground shadow-sm",
        className
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden />
      Persönlich getestet
    </span>
  );
}
