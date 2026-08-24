import { randomInt } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminUser, UserRole } from "@/lib/types";

// Ohne verwechselbare Zeichen (0/O, 1/I/l).
const TEMP_PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generateTempPassword(length = 12): string {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += TEMP_PASSWORD_CHARS[randomInt(TEMP_PASSWORD_CHARS.length)];
  }
  return password;
}

// Legt einen neuen Nutzer-Account per Admin-API mit einem Einmalpasswort an
// (Phase 15) — der Trigger handle_new_user() (0013_auth.sql) erstellt dabei
// automatisch die public.users-Zeile mit role: 'user', die hier nur noch auf
// die gewünschte Rolle + must_change_password: true gebracht wird.
export async function createUserWithTempPassword(
  email: string,
  role: UserRole
): Promise<{ email: string; tempPassword: string }> {
  const supabase = createAdminClient();
  const tempPassword = generateTempPassword();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });
  if (error) throw error;

  const { error: updateError } = await supabase
    .from("users")
    .update({ role, must_change_password: true })
    .eq("id", data.user.id);
  if (updateError) throw updateError;

  return { email, tempPassword };
}

export async function getAllUsersForAdmin(): Promise<AdminUser[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("users")
    .select("id, email, role, display_name, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function updateUserRoleRow(id: string, role: UserRole): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("users").update({ role }).eq("id", id);
  if (error) throw error;
}
