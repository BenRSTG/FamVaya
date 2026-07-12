"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import {
  createActivityRow,
  deleteActivityRow,
  duplicateActivityRow,
  replaceActivityFeatures,
  updateActivityRow,
  type ActivityInput,
} from "@/lib/data/activities";
import { getAllRegions, replaceContentAgeGroups, replaceContentTags } from "@/lib/data/shared";
import { setCoverImage, uploadMediaFile } from "@/lib/data/media";
import { checkboxOn, dateOrNull, numberOrNull, requiredString, stringList, stringOrNull } from "@/lib/form-utils";
import type { ContentStatus } from "@/lib/types";

async function parseActivityInput(formData: FormData): Promise<ActivityInput> {
  const regionId = stringOrNull(formData, "region_id");
  const region = regionId ? (await getAllRegions()).find((r) => r.id === regionId) : undefined;

  return {
    title: requiredString(formData, "title"),
    slug: requiredString(formData, "slug"),
    short_description: stringOrNull(formData, "short_description"),
    full_description: stringOrNull(formData, "full_description"),
    category_id: stringOrNull(formData, "category_id"),
    provider_id: stringOrNull(formData, "provider_id"),
    region_id: regionId,
    country_id: region?.country_id ?? null,
    city: stringOrNull(formData, "city"),
    duration_min: numberOrNull(formData, "duration_min"),
    duration_max: numberOrNull(formData, "duration_max"),
    indoor: checkboxOn(formData, "indoor"),
    outdoor: checkboxOn(formData, "outdoor"),
    weather_suitable: checkboxOn(formData, "weather_suitable"),
    adult_price: numberOrNull(formData, "adult_price"),
    child_price: numberOrNull(formData, "child_price"),
    example_total_price: numberOrNull(formData, "example_total_price"),
    family_ticket: checkboxOn(formData, "family_ticket"),
    large_family_discount: checkboxOn(formData, "large_family_discount"),
    booking_required: checkboxOn(formData, "booking_required"),
    affiliate_url: stringOrNull(formData, "affiliate_url"),
    external_url: stringOrNull(formData, "external_url"),
    status: requiredString(formData, "status") as ContentStatus,
    featured: checkboxOn(formData, "featured"),
    family_rating: numberOrNull(formData, "family_rating"),
    expires_at: dateOrNull(formData, "expires_at"),
  };
}

async function saveRelationsAndMedia(id: string, formData: FormData) {
  await Promise.all([
    replaceActivityFeatures(id, stringList(formData, "feature_ids")),
    replaceContentAgeGroups("activity", id, stringList(formData, "age_group_ids")),
    replaceContentTags("activity", id, stringList(formData, "tag_ids")),
  ]);

  const file = formData.get("cover_image");
  if (file instanceof File && file.size > 0) {
    const mediaId = await uploadMediaFile(file, stringOrNull(formData, "cover_image_alt") ?? undefined);
    await setCoverImage("activity", id, mediaId);
  }
}

export async function createActivity(formData: FormData) {
  await requireAdminOrEditor();
  const input = await parseActivityInput(formData);
  const id = await createActivityRow(input);
  await saveRelationsAndMedia(id, formData);
  revalidatePath("/admin/aktivitaeten");
  redirect(`/admin/aktivitaeten/${id}`);
}

export async function updateActivity(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const input = await parseActivityInput(formData);
  await updateActivityRow(id, input);
  await saveRelationsAndMedia(id, formData);
  revalidatePath("/admin/aktivitaeten");
  revalidatePath(`/admin/aktivitaeten/${id}`);
  redirect(`/admin/aktivitaeten/${id}?saved=1`);
}

export async function deleteActivity(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  await deleteActivityRow(id);
  revalidatePath("/admin/aktivitaeten");
}

export async function duplicateActivity(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const newId = await duplicateActivityRow(id);
  revalidatePath("/admin/aktivitaeten");
  redirect(`/admin/aktivitaeten/${newId}`);
}
