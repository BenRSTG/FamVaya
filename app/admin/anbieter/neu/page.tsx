import { ProviderForm } from "@/app/admin/anbieter/provider-form";
import { createProvider } from "@/app/admin/anbieter/actions";

export default function NewProviderPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Neuer Anbieter</h1>
      <ProviderForm provider={null} action={createProvider} />
    </div>
  );
}
