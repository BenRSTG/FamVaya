import { requireAdminOrEditor } from "@/lib/auth";
import { SpotlightForm } from "@/app/admin/spotlights/spotlight-form";
import { createSpotlightAction } from "@/app/admin/spotlights/actions";

export default async function NewSpotlightPage() {
  await requireAdminOrEditor("/admin/spotlights/neu");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Neuer Spotlight</h1>
      <SpotlightForm spotlight={null} action={createSpotlightAction} />
    </div>
  );
}
