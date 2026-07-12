import Link from "next/link";
import { MapPin } from "lucide-react";
import { OVERVIEW_PATH_BY_CONTENT_TYPE } from "@/lib/content-type";
import type { SearchResultRow } from "@/lib/types";

export function SearchResultItem({ result }: { result: SearchResultRow }) {
  const href = `${OVERVIEW_PATH_BY_CONTENT_TYPE[result.content_type]}/${result.slug}`;

  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="font-semibold text-foreground">{result.title}</h3>
      {result.city && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" aria-hidden />
          {result.city}
        </p>
      )}
      {result.short_description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {result.short_description}
        </p>
      )}
    </Link>
  );
}
