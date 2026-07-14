import { cn } from "@/lib/utils";
import { getFamilyRatingLabel, type FamilyRatingTier } from "@/lib/family-rating";

const TIER_CLASSES: Record<FamilyRatingTier, string> = {
  excellent: "bg-success text-success-foreground",
  very_good: "bg-success text-success-foreground",
  good: "bg-success/80 text-success-foreground",
  limited: "bg-warning text-warning-foreground",
  not_suitable: "bg-destructive text-destructive-foreground",
};

export function FamilyFitBadge({
  score,
  className,
}: {
  score: number | null | undefined;
  className?: string;
}) {
  if (score == null) return null;
  const { tier } = getFamilyRatingLabel(score);

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium shadow-sm",
        TIER_CLASSES[tier],
        className
      )}
    >
      Fit: {score}/100
    </span>
  );
}
