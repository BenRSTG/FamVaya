"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import {
  createArticleRow,
  deleteArticleRow,
  duplicateArticleRow,
  updateArticleRow,
  type ArticleInput,
} from "@/lib/data/articles";
import { uploadMediaFile } from "@/lib/data/media";
import { dateOrNull, requiredString, stringOrNull } from "@/lib/form-utils";
import type { ContentStatus } from "@/lib/types";

async function resolveCoverMediaId(formData: FormData, existing: string | null): Promise<string | null> {
  const file = formData.get("cover_image");
  if (file instanceof File && file.size > 0) {
    return uploadMediaFile(file, stringOrNull(formData, "cover_image_alt") ?? undefined);
  }
  return existing;
}

export async function createArticle(formData: FormData) {
  const user = await requireAdminOrEditor();

  const input: ArticleInput = {
    title: requiredString(formData, "title"),
    slug: requiredString(formData, "slug"),
    excerpt: stringOrNull(formData, "excerpt"),
    content: stringOrNull(formData, "content"),
    author_id: user.id,
    category_id: stringOrNull(formData, "category_id"),
    cover_media_id: null,
    status: requiredString(formData, "status") as ContentStatus,
    published_at: dateOrNull(formData, "published_at"),
  };
  input.cover_media_id = await resolveCoverMediaId(formData, null);

  const id = await createArticleRow(input);
  revalidatePath("/admin/magazin");
  redirect(`/admin/magazin/${id}`);
}

export async function updateArticle(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const existingCoverMediaId = stringOrNull(formData, "existing_cover_media_id");

  const input: ArticleInput = {
    title: requiredString(formData, "title"),
    slug: requiredString(formData, "slug"),
    excerpt: stringOrNull(formData, "excerpt"),
    content: stringOrNull(formData, "content"),
    author_id: stringOrNull(formData, "author_id"),
    category_id: stringOrNull(formData, "category_id"),
    cover_media_id: existingCoverMediaId,
    status: requiredString(formData, "status") as ContentStatus,
    published_at: dateOrNull(formData, "published_at"),
  };
  input.cover_media_id = await resolveCoverMediaId(formData, existingCoverMediaId);

  await updateArticleRow(id, input);
  revalidatePath("/admin/magazin");
  revalidatePath(`/admin/magazin/${id}`);
  redirect(`/admin/magazin/${id}?saved=1`);
}

export async function deleteArticle(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  await deleteArticleRow(id);
  revalidatePath("/admin/magazin");
}

export async function duplicateArticle(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const newId = await duplicateArticleRow(id);
  revalidatePath("/admin/magazin");
  redirect(`/admin/magazin/${newId}`);
}
