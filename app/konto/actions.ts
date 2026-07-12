"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function updateFamilyProfile(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const maxBudgetRaw = String(formData.get("max_budget") ?? "");
  const preferredDistanceRaw = String(formData.get("preferred_distance") ?? "");

  const { error } = await supabase.from("family_profiles").upsert(
    {
      user_id: user.id,
      adults_count: Number(formData.get("adults_count") ?? 2),
      children_count: Number(formData.get("children_count") ?? 0),
      children_age_groups: formData.getAll("children_age_groups").map(String),
      city: String(formData.get("city") ?? "").trim() || null,
      postal_code: String(formData.get("postal_code") ?? "").trim() || null,
      max_budget: maxBudgetRaw ? Number(maxBudgetRaw) : null,
      preferred_distance: preferredDistanceRaw ? Number(preferredDistanceRaw) : null,
      interests: formData.getAll("interests").map(String),
      accessibility_needs: String(formData.get("accessibility_needs") ?? "").trim() || null,
      has_pet: formData.get("has_pet") === "on",
    },
    { onConflict: "user_id" }
  );

  if (error) {
    redirect(`/konto?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/konto");
  redirect("/konto?saved=1");
}
