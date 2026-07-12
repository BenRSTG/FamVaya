"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import { createProviderRow, updateProviderRow, type ProviderInput } from "@/lib/data/providers";
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

export async function createProvider(formData: FormData) {
  await requireAdminOrEditor();
  const input = parseProviderInput(formData);
  const id = await createProviderRow(input);
  revalidatePath("/admin/anbieter");
  redirect(`/admin/anbieter/${id}`);
}

export async function updateProvider(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const input = parseProviderInput(formData);
  await updateProviderRow(id, input);
  revalidatePath("/admin/anbieter");
  revalidatePath(`/admin/anbieter/${id}`);
  redirect(`/admin/anbieter/${id}?saved=1`);
}
