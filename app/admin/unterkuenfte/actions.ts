"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import {
  createAccommodationRow,
  deleteAccommodationRow,
  duplicateAccommodationRow,
  replaceAccommodationAmenities,
  updateAccommodationRow,
  type AccommodationInput,
} from "@/lib/data/accommodations";
import { getAllRegions, replaceContentAgeGroups, replaceContentTags } from "@/lib/data/shared";
import { setCoverImage, uploadMediaFile } from "@/lib/data/media";
import { checkboxOn, commaSeparatedList, dateOrNull, numberOrNull, requiredString, stringList, stringOrNull } from "@/lib/form-utils";
import type { ContentStatus } from "@/lib/types";

async function parseAccommodationInput(formData: FormData): Promise<AccommodationInput> {
  const regionId = stringOrNull(formData, "region_id");
  const region = regionId ? (await getAllRegions()).find((r) => r.id === regionId) : undefined;

  return {
    title: requiredString(formData, "title"),
    slug: requiredString(formData, "slug"),
    short_description: stringOrNull(formData, "short_description"),
    full_description: stringOrNull(formData, "full_description"),
    accommodation_type_id: stringOrNull(formData, "accommodation_type_id"),
    provider_id: stringOrNull(formData, "provider_id"),
    region_id: regionId,
    country_id: region?.country_id ?? null,
    city: stringOrNull(formData, "city"),
    postal_code: stringOrNull(formData, "postal_code"),
    max_guests: numberOrNull(formData, "max_guests"),
    max_adults: numberOrNull(formData, "max_adults"),
    max_children: numberOrNull(formData, "max_children"),
    bedrooms: numberOrNull(formData, "bedrooms"),
    bathrooms: numberOrNull(formData, "bathrooms"),
    beds: numberOrNull(formData, "beds"),
    living_area: numberOrNull(formData, "living_area"),
    price_from: numberOrNull(formData, "price_from"),
    price_type: (stringOrNull(formData, "price_type") as AccommodationInput["price_type"]) ?? null,
    currency: stringOrNull(formData, "currency") ?? "EUR",
    example_family_size: stringOrNull(formData, "example_family_size"),
    example_total_price: numberOrNull(formData, "example_total_price"),
    affiliate_url: stringOrNull(formData, "affiliate_url"),
    external_url: stringOrNull(formData, "external_url"),
    status: requiredString(formData, "status") as ContentStatus,
    featured: checkboxOn(formData, "featured"),
    family_rating: numberOrNull(formData, "family_rating"),
    expires_at: dateOrNull(formData, "expires_at"),
    pros: commaSeparatedList(formData, "pros"),
    cons: commaSeparatedList(formData, "cons"),
  };
}

async function saveRelationsAndMedia(id: string, formData: FormData) {
  await Promise.all([
    replaceAccommodationAmenities(id, stringList(formData, "amenity_ids")),
    replaceContentAgeGroups("accommodation", id, stringList(formData, "age_group_ids")),
    replaceContentTags("accommodation", id, stringList(formData, "tag_ids")),
  ]);

  const file = formData.get("cover_image");
  if (file instanceof File && file.size > 0) {
    const mediaId = await uploadMediaFile(file, stringOrNull(formData, "cover_image_alt") ?? undefined);
    await setCoverImage("accommodation", id, mediaId);
  }
}

export async function createAccommodation(formData: FormData) {
  await requireAdminOrEditor();
  const input = await parseAccommodationInput(formData);
  const id = await createAccommodationRow(input);
  await saveRelationsAndMedia(id, formData);
  revalidatePath("/admin/unterkuenfte");
  redirect(`/admin/unterkuenfte/${id}`);
}

export async function updateAccommodation(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const input = await parseAccommodationInput(formData);
  await updateAccommodationRow(id, input);
  await saveRelationsAndMedia(id, formData);
  revalidatePath("/admin/unterkuenfte");
  revalidatePath(`/admin/unterkuenfte/${id}`);
  redirect(`/admin/unterkuenfte/${id}?saved=1`);
}

export async function deleteAccommodation(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  await deleteAccommodationRow(id);
  revalidatePath("/admin/unterkuenfte");
}

export async function duplicateAccommodation(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const newId = await duplicateAccommodationRow(id);
  revalidatePath("/admin/unterkuenfte");
  redirect(`/admin/unterkuenfte/${newId}`);
}
