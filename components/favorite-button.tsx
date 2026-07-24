"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/lib/actions/favorites";
import { trackFamvayaEvent } from "@/lib/client-events";
import type { ContentType } from "@/lib/types";

export function FavoriteButton({
  contentType,
  contentId,
  initialFavorited,
  currentPath,
}: {
  contentType: ContentType;
  contentId: string;
  initialFavorited: boolean;
  currentPath: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleFavoriteAction(contentType, contentId, currentPath);
      setFavorited(result);
      if (result) {
        trackFamvayaEvent("favorite_added", { entityType: contentType, entityId: contentId });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={favorited}
      aria-label={favorited ? "Von Merkliste entfernen" : "Zur Merkliste hinzufügen"}
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
    >
      <Heart
        className={favorited ? "size-4 fill-destructive text-destructive" : "size-4"}
        aria-hidden
      />
      {favorited ? "Gemerkt" : "Merken"}
    </button>
  );
}
