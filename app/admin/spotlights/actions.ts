"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import {
  createSpotlightRow,
  deleteSpotlightRow,
  toggleSpotlightActive,
  updateSpotlightRow,
  type SpotlightInput,
} from "@/lib/data/spotlights";
import { uploadMediaFile } from "@/lib/data/media";
import { checkboxOn, dateOrNull, numberOrNull, requiredString, stringOrNull } from "@/lib/form-utils";
import type { ContentType } from "@/lib/types";

function parseSpotlightInput(formData: FormData): SpotlightInput {
  const internalTarget = stringOrNull(formData, "internal_target");
  const externalUrl = stringOrNull(formData, "external_url");

  const isInternal = Boolean(internalTarget);
  if (!isInternal && !externalUrl) {
    throw new Error("Bitte entweder ein internes Ziel wählen oder eine externe URL eintragen.");
  }

  const [type, id] = internalTarget ? internalTarget.split(":") : [null, null];

  return {
    title: requiredString(formData, "title"),
    body_text: requiredString(formData, "body_text"),
    link_type: isInternal ? "internal" : "external",
    content_type: isInternal ? (type as ContentType) : null,
    content_id: isInternal ? id : null,
    external_url: isInternal ? null : externalUrl,
    is_active: checkboxOn(formData, "is_active"),
    is_sponsored: checkboxOn(formData, "is_sponsored"),
    starts_at: dateOrNull(formData, "starts_at"),
    ends_at: dateOrNull(formData, "ends_at"),
    sort_order: numberOrNull(formData, "sort_order") ?? 0,
  };
}

export async function createSpotlightAction(formData: FormData) {
  await requireAdminOrEditor();
  const input = parseSpotlightInput(formData);

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    throw new Error("Bitte ein Bild hochladen.");
  }
  const imageMediaId = await uploadMediaFile(image, stringOrNull(formData, "image_alt") ?? undefined);

  const id = await createSpotlightRow(input, imageMediaId);
  revalidatePath("/admin/spotlights");
  revalidatePath("/");
  redirect(`/admin/spotlights/${id}`);
}

export async function updateSpotlightAction(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const input = parseSpotlightInput(formData);

  const image = formData.get("image");
  let imageMediaId: string | undefined;
  if (image instanceof File && image.size > 0) {
    imageMediaId = await uploadMediaFile(image, stringOrNull(formData, "image_alt") ?? undefined);
  }

  await updateSpotlightRow(id, input, imageMediaId);
  revalidatePath("/admin/spotlights");
  revalidatePath(`/admin/spotlights/${id}`);
  revalidatePath("/");
  redirect(`/admin/spotlights/${id}?saved=1`);
}

export async function toggleSpotlightAction(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const isActive = formData.get("active") === "true";
  await toggleSpotlightActive(id, isActive);
  revalidatePath("/admin/spotlights");
  revalidatePath("/");
}

export async function deleteSpotlightAction(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  await deleteSpotlightRow(id);
  revalidatePath("/admin/spotlights");
  revalidatePath("/");
  redirect("/admin/spotlights");
}
