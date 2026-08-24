"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createUserWithTempPassword, updateUserRoleRow } from "@/lib/data/users";
import { requiredString } from "@/lib/form-utils";
import type { UserRole } from "@/lib/types";

export async function updateUserRole(formData: FormData) {
  await requireAdmin();
  const id = requiredString(formData, "id");
  const role = requiredString(formData, "role") as UserRole;
  await updateUserRoleRow(id, role);
  revalidatePath("/admin/nutzer");
}

export async function inviteUserAction(formData: FormData) {
  await requireAdmin();
  const email = requiredString(formData, "email");
  const role = requiredString(formData, "role") as UserRole;

  // redirect() wirft intern einen speziellen Kontrollfluss-Error — darf
  // deshalb nicht innerhalb des try/catch aufgerufen werden, sonst würde
  // catch() den Redirect selbst als Fehlschlag behandeln.
  let tempPassword: string;
  try {
    ({ tempPassword } = await createUserWithTempPassword(email, role));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Nutzer konnte nicht angelegt werden.";
    redirect(`/admin/nutzer?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/nutzer");
  redirect(
    `/admin/nutzer?tempEmail=${encodeURIComponent(email)}&tempPassword=${encodeURIComponent(tempPassword)}`
  );
}
