import Link from "next/link";
import Image from "next/image";
import { Clock, Sparkles, Wallet } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FamilyFitBadge } from "@/components/family-fit-badge";
import { formatPrice } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import type { MicroAdventure } from "@/lib/types";

const COST_LABEL: Record<NonNullable<MicroAdventure["cost_level"]>, string> = {
  free: "Kostenlos",
  low: "Günstig",
  medium: "Mittleres Budget",
  high: "Höheres Budget",
};

function formatDuration(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  if (min && max && min !== max) return `${min} – ${max} Min.`;
  return `${min ?? max} Min.`;
}

export function MicroAdventureCard({ adventure }: { adventure: MicroAdventure }) {
  const imageUrl = resolveMediaUrl(adventure.cover_media);
  const duration = formatDuration(adventure.duration_min, adventure.duration_max);

  return (
    <Link
      href={`/mikro-familienabenteuer/${adventure.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-40 w-full shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={adventure.cover_media?.alt_text ?? adventure.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage kind="micro_adventure" className="h-full w-full" />
        )}
        {adventure.preparation_level === "none" && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground shadow-sm">
            <Sparkles className="size-3" aria-hidden />
            Spontan umsetzbar
          </span>
        )}
        <FamilyFitBadge
          score={adventure.family_rating}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {adventure.category && (
            <p className="text-xs text-muted-foreground">{adventure.category.name}</p>
          )}
          <h3 className="text-lg font-semibold text-foreground">{adventure.title}</h3>
          {adventure.short_description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {adventure.short_description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden />
              {duration}
            </span>
          )}
          {adventure.cost_level && (
            <span className="flex items-center gap-1.5">
              <Wallet className="size-4 shrink-0" aria-hidden />
              {adventure.cost_level === "free" || !adventure.estimated_total_cost
                ? COST_LABEL[adventure.cost_level]
                : formatPrice(adventure.estimated_total_cost)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <span className="text-sm font-medium text-primary group-hover:underline">
            Abenteuer entdecken
          </span>
        </div>
      </div>
    </Link>
  );
}
