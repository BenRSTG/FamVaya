"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import {
  createMicroAdventureRow,
  deleteMicroAdventureRow,
  duplicateMicroAdventureRow,
  updateMicroAdventureRow,
  type MicroAdventureInput,
} from "@/lib/data/micro-adventures";
import { replaceContentAgeGroups, replaceContentTags } from "@/lib/data/shared";
import { setCoverImage, uploadMediaFile } from "@/lib/data/media";
import { checkboxOn, commaSeparatedList, numberOrNull, requiredString, stringList, stringOrNull } from "@/lib/form-utils";
import type { ContentStatus } from "@/lib/types";

function parseMicroAdventureInput(formData: FormData): MicroAdventureInput {
  return {
    title: requiredString(formData, "title"),
    slug: requiredString(formData, "slug"),
    short_description: stringOrNull(formData, "short_description"),
    full_description: stringOrNull(formData, "full_description"),
    category_id: stringOrNull(formData, "category_id"),
    duration_min: numberOrNull(formData, "duration_min"),
    duration_max: numberOrNull(formData, "duration_max"),
    cost_level: (stringOrNull(formData, "cost_level") as MicroAdventureInput["cost_level"]) ?? null,
    estimated_total_cost: numberOrNull(formData, "estimated_total_cost"),
    preparation_level:
      (stringOrNull(formData, "preparation_level") as MicroAdventureInput["preparation_level"]) ?? null,
    difficulty_level: (stringOrNull(formData, "difficulty_level") as MicroAdventureInput["difficulty_level"]) ?? null,
    indoor: checkboxOn(formData, "indoor"),
    outdoor: checkboxOn(formData, "outdoor"),
    seasonal_tags: commaSeparatedList(formData, "seasonal_tags"),
    weather_tags: commaSeparatedList(formData, "weather_tags"),
    materials: commaSeparatedList(formData, "materials"),
    instructions: stringOrNull(formData, "instructions"),
    safety_notes: stringOrNull(formData, "safety_notes"),
    location_optional: checkboxOn(formData, "location_optional"),
    external_url: stringOrNull(formData, "external_url"),
    affiliate_url: stringOrNull(formData, "affiliate_url"),
    status: requiredString(formData, "status") as ContentStatus,
    featured: checkboxOn(formData, "featured"),
    family_rating: numberOrNull(formData, "family_rating"),
    pros: commaSeparatedList(formData, "pros"),
    cons: commaSeparatedList(formData, "cons"),
  };
}

async function saveRelationsAndMedia(id: string, formData: FormData) {
  await Promise.all([
    replaceContentAgeGroups("micro_adventure", id, stringList(formData, "age_group_ids")),
    replaceContentTags("micro_adventure", id, stringList(formData, "tag_ids")),
  ]);

  const file = formData.get("cover_image");
  if (file instanceof File && file.size > 0) {
    const mediaId = await uploadMediaFile(file, stringOrNull(formData, "cover_image_alt") ?? undefined);
    await setCoverImage("micro_adventure", id, mediaId);
  }
}

export async function createMicroAdventure(formData: FormData) {
  await requireAdminOrEditor();
  const input = parseMicroAdventureInput(formData);
  const id = await createMicroAdventureRow(input);
  await saveRelationsAndMedia(id, formData);
  revalidatePath("/admin/mikro-abenteuer");
  redirect(`/admin/mikro-abenteuer/${id}`);
}

export async function updateMicroAdventure(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const input = parseMicroAdventureInput(formData);
  await updateMicroAdventureRow(id, input);
  await saveRelationsAndMedia(id, formData);
  revalidatePath("/admin/mikro-abenteuer");
  revalidatePath(`/admin/mikro-abenteuer/${id}`);
  redirect(`/admin/mikro-abenteuer/${id}?saved=1`);
}

export async function deleteMicroAdventure(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  await deleteMicroAdventureRow(id);
  revalidatePath("/admin/mikro-abenteuer");
}

export async function duplicateMicroAdventure(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const newId = await duplicateMicroAdventureRow(id);
  revalidatePath("/admin/mikro-abenteuer");
  redirect(`/admin/mikro-abenteuer/${newId}`);
}
