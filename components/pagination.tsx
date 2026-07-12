import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE = 12;

// Reine Server-Komponente mit <Link>-Navigation (kein Client-JS) — sauber
// crawlbar für Suchmaschinen (Spec §25: "Pagination mit sauberer
// Indexierungsstrategie").
export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Seiten" className="mt-10 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Zurück
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground/50">
          <ChevronLeft className="size-4" aria-hidden />
          Zurück
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        Seite {currentPage} von {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"
        >
          Weiter
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground/50">
          Weiter
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}

export function paginate<T>(items: T[], page: number, pageSize: number = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
