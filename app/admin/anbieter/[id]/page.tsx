import { notFound } from "next/navigation";
import { getProviderByIdForAdmin } from "@/lib/data/providers";
import { ProviderForm } from "@/app/admin/anbieter/provider-form";
import { updateProvider } from "@/app/admin/anbieter/actions";

export default async function EditProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await getProviderByIdForAdmin(id);
  if (!provider) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">{provider.name}</h1>
      <ProviderForm provider={provider} action={updateProvider} />
    </div>
  );
}
