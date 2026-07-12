import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminUser, UserRole } from "@/lib/types";

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
