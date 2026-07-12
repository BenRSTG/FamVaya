import { Home, FerrisWheel, TreePine, Newspaper, ImageOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderKind = "accommodation" | "activity" | "micro_adventure" | "article";

const ICON_BY_KIND: Record<PlaceholderKind, LucideIcon> = {
  accommodation: Home,
  activity: FerrisWheel,
  micro_adventure: TreePine,
  article: Newspaper,
};

export function PlaceholderImage({
  kind,
  className,
}: {
  kind: PlaceholderKind;
  className?: string;
}) {
  const Icon = ICON_BY_KIND[kind];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/15 via-accent/25 to-secondary/10 text-muted-foreground",
        className
      )}
    >
      <Icon className="size-10 text-primary/60" strokeWidth={1.5} aria-hidden />
      <span className="flex items-center gap-1 text-xs">
        <ImageOff className="size-3.5" aria-hidden />
        Kein Foto hinterlegt
      </span>
    </div>
  );
}
