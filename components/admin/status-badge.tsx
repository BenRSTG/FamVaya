import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/types";

const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "Entwurf",
  in_review: "Zur Prüfung",
  published: "Veröffentlicht",
  paused: "Pausiert",
  archived: "Archiviert",
};

const STATUS_CLASS: Record<ContentStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  in_review: "bg-warning/15 text-warning",
  published: "bg-success/15 text-success",
  paused: "bg-warning/15 text-warning",
  archived: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_CLASS[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export { STATUS_LABEL };
