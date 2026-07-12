"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getOrCreateDefaultCollection } from "@/lib/data/favorites";
import { createClient } from "@/lib/supabase/server";

export async function toggleListSharing() {
  const user = await requireUser("/merkliste");
  const collection = await getOrCreateDefaultCollection(user.id);

  const supabase = await createClient();
  await supabase
    .from("favorite_collections")
    .update({ is_public: !collection.is_public })
    .eq("id", collection.id);

  revalidatePath("/merkliste");
}
