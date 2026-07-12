"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getOrCreateDefaultCollection } from "@/lib/data/favorites";
import { createClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/analytics/server";

export async function toggleListSharing() {
  const user = await requireUser("/merkliste");
  const collection = await getOrCreateDefaultCollection(user.id);
  const nowPublic = !collection.is_public;

  const supabase = await createClient();
  await supabase
    .from("favorite_collections")
    .update({ is_public: nowPublic })
    .eq("id", collection.id);

  if (nowPublic) {
    await trackEvent("favorites_shared");
  }

  revalidatePath("/merkliste");
}
