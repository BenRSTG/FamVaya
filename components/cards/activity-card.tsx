import Link from "next/link";
import Image from "next/image";
import { Clock, Leaf, MapPin, Sun } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FamilyFitBadge } from "@/components/family-fit-badge";
import { formatPrice } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import type { Activity } from "@/lib/types";

function formatDuration(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  const toHours = (m: number) => (m % 60 === 0 ? `${m / 60} Std.` : `${(m / 60).toFixed(1)} Std.`);
  if (min && max && min !== max) return `${toHours(min)} – ${toHours(max)}`;
  return toHours(min ?? max ?? 0);
}

export function ActivityCard({ activity }: { activity: Activity }) {
  const imageUrl = resolveMediaUrl(activity.cover_media);
  const duration = formatDuration(activity.duration_min, activity.duration_max);
  const location = [activity.city, activity.country?.name].filter(Boolean).join(", ");

  return (
    <Link
      href={`/familienaktivitaeten/${activity.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={activity.cover_media?.alt_text ?? activity.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage kind="activity" className="h-full w-full" />
        )}
        {activity.large_family_discount && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground shadow-sm">
            Großfamilienrabatt
          </span>
        )}
        <FamilyFitBadge
          score={activity.family_rating}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {(activity.category || location) && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {location && (
                <>
                  <MapPin className="size-3" aria-hidden />
                  {location}
                </>
              )}
              {activity.category && location && " · "}
              {activity.category?.name}
            </p>
          )}
          <h3 className="text-lg font-semibold text-foreground">{activity.title}</h3>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden />
              {duration}
            </span>
          )}
          {activity.indoor && !activity.outdoor && (
            <span className="flex items-center gap-1.5">
              <Leaf className="size-4 shrink-0" aria-hidden />
              Indoor
            </span>
          )}
          {activity.outdoor && !activity.indoor && (
            <span className="flex items-center gap-1.5">
              <Sun className="size-4 shrink-0" aria-hidden />
              Outdoor
            </span>
          )}
          {activity.indoor && activity.outdoor && (
            <span className="flex items-center gap-1.5">Indoor &amp; Outdoor</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {activity.example_total_price ? (
              <>
                <p className="text-xs text-muted-foreground">Beispiel-Gesamtpreis</p>
                <p className="text-base font-semibold text-foreground">
                  {formatPrice(activity.example_total_price)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Preis beim Anbieter prüfen</p>
            )}
          </div>
          <span className="text-sm font-medium text-primary group-hover:underline">
            Details ansehen
          </span>
        </div>
      </div>
    </Link>
  );
}
