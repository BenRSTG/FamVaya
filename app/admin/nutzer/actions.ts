"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { updateUserRoleRow } from "@/lib/data/users";
import { requiredString } from "@/lib/form-utils";
import type { UserRole } from "@/lib/types";

export async function updateUserRole(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  const role = requiredString(formData, "role") as UserRole;
  await updateUserRoleRow(id, role);
  revalidatePath("/admin/nutzer");
}
