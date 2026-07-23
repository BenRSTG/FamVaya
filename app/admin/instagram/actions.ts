"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import { createInstagramPost, publishInstagramPost, updateInstagramPostCaption } from "@/lib/data/instagram";
import type { InstagramContentType } from "@/lib/instagram/types";
import { requiredString } from "@/lib/form-utils";

export async function generatePostAction(formData: FormData) {
  await requireAdminOrEditor();
  const contentType = requiredString(formData, "contentType") as InstagramContentType;
  const contentId = requiredString(formData, "contentId");
  const post = await createInstagramPost(contentType, contentId);
  revalidatePath("/admin/instagram");
  redirect(`/admin/instagram/${post.id}`);
}

export async function updateCaptionAction(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const caption = requiredString(formData, "caption");
  await updateInstagramPostCaption(id, caption);
  revalidatePath(`/admin/instagram/${id}`);
}

export async function publishAction(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  await publishInstagramPost(id);
  revalidatePath("/admin/instagram");
  revalidatePath(`/admin/instagram/${id}`);
}
