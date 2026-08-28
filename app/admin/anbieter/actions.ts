"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import {
  addProviderGalleryImages,
  createProviderRow,
  setProviderLogo,
  updateProviderRow,
  type ProviderInput,
} from "@/lib/data/providers";
import { uploadMediaFile } from "@/lib/data/media";
import { requiredString, stringOrNull } from "@/lib/form-utils";
import type { Provider } from "@/lib/types";

function parseProviderInput(formData: FormData): ProviderInput {
  return {
    name: requiredString(formData, "name"),
    slug: requiredString(formData, "slug"),
    description: stringOrNull(formData, "description"),
    website: stringOrNull(formData, "website"),
    affiliate_network: stringOrNull(formData, "affiliate_network"),
    contact_email: stringOrNull(formData, "contact_email"),
    status: requiredString(formData, "status") as Provider["status"],
  };
}

async function saveMedia(providerId: string, formData: FormData) {
  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    const mediaId = await uploadMediaFile(logo, stringOrNull(formData, "logo_alt") ?? undefined);
    await setProviderLogo(providerId, mediaId);
  }

  const galleryFiles = formData.getAll("gallery_images").filter((f) => f instanceof File && f.size > 0) as File[];
  if (galleryFiles.length > 0) {
    const mediaIds = await Promise.all(galleryFiles.map((file) => uploadMediaFile(file)));
    await addProviderGalleryImages(providerId, mediaIds);
  }
}

export async function createProvider(formData: FormData) {
  await requireAdminOrEditor();
  const input = parseProviderInput(formData);
  const id = await createProviderRow(input);
  await saveMedia(id, formData);
  revalidatePath("/admin/anbieter");
  redirect(`/admin/anbieter/${id}`);
}

export async function updateProvider(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const input = parseProviderInput(formData);
  await updateProviderRow(id, input);
  await saveMedia(id, formData);
  revalidatePath("/admin/anbieter");
  revalidatePath(`/admin/anbieter/${id}`);
  redirect(`/admin/anbieter/${id}?saved=1`);
}
