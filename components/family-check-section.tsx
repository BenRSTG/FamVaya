import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFamilyRatingLabel, type FamilyRatingTier } from "@/lib/family-rating";
import { getChildSuitability } from "@/lib/family-check";

const TIER_CLASSES: Record<FamilyRatingTier, string> = {
  excellent: "bg-success/15 text-success",
  very_good: "bg-success/15 text-success",
  good: "bg-success/10 text-success",
  limited: "bg-warning/15 text-warning",
  not_suitable: "bg-destructive/15 text-destructive",
};

export function FamilyCheckSection({
  familyRating,
  maxChildren,
}: {
  familyRating: number | null;
  maxChildren?: number | null;
}) {
  if (familyRating == null && maxChildren === undefined) return null;

  const ratingInfo = familyRating != null ? getFamilyRatingLabel(familyRating) : null;
  const suitability =
    maxChildren !== undefined ? getChildSuitability(maxChildren) : null;

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        FamVaya-Familiencheck
      </h2>

      {ratingInfo && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              TIER_CLASSES[ratingInfo.tier]
            )}
          >
            {ratingInfo.label}
          </span>
          <span className="text-sm text-muted-foreground">
            FamVaya Family Fit: {familyRating}/100
          </span>
        </div>
      )}

      {ratingInfo && (
        <p className="mb-4 text-sm text-muted-foreground">
          Der Score fließt aus einer redaktionellen Einschätzung von Platz,
          getrennten Zimmern/Rückzugsmöglichkeiten, familientauglicher
          Ausstattung, Preis-Leistung und verfügbaren Rabatten für
          Großfamilien.
        </p>
      )}

      {suitability && (
        <ul className="space-y-2">
          {suitability.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              {item.suitable ? (
                <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
              ) : (
                <XCircle className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span className={item.suitable ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Der Score ist eine redaktionelle Orientierung, keine objektive
        Garantie.
      </p>
    </section>
  );
}
