import { createAdminClient } from "@/lib/supabase/admin";
import type { Provider } from "@/lib/types";

export { getAllProviders as getAllProvidersForAdmin } from "@/lib/data/shared";

export type ProviderInput = Omit<Provider, "id" | "slug"> & { slug: string };

export async function getProviderByIdForAdmin(id: string): Promise<Provider | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("providers")
    .select("id, name, slug, description, website, affiliate_network, contact_email, status")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

export async function createProviderRow(input: ProviderInput): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("providers").insert(input).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function updateProviderRow(id: string, input: ProviderInput): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("providers").update(input).eq("id", id);
  if (error) throw error;
}
