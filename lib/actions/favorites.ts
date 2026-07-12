"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { toggleFavorite } from "@/lib/data/favorites";
import type { ContentType } from "@/lib/types";

// Von components/favorite-button.tsx auf allen drei Detailseiten aufgerufen.
// requireUser() leitet nicht eingeloggte Nutzer:innen automatisch zu
// /anmelden weiter (Server Actions dürfen redirect() auslösen).
export async function toggleFavoriteAction(
  contentType: ContentType,
  contentId: string,
  currentPath: string
): Promise<boolean> {
  const user = await requireUser(currentPath);
  const nowFavorited = await toggleFavorite(user.id, contentType, contentId);

  revalidatePath(currentPath);
  revalidatePath("/merkliste");

  return nowFavorited;
}
