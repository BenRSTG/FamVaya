import { notFound } from "next/navigation";
import { requireAdminOrEditor } from "@/lib/auth";
import { getSpotlightById } from "@/lib/data/spotlights";
import { SpotlightForm } from "@/app/admin/spotlights/spotlight-form";
import { updateSpotlightAction, deleteSpotlightAction } from "@/app/admin/spotlights/actions";

export default async function EditSpotlightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminOrEditor("/admin/spotlights");
  const { id } = await params;
  const spotlight = await getSpotlightById(id);
  if (!spotlight) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">{spotlight.title}</h1>
      <SpotlightForm spotlight={spotlight} action={updateSpotlightAction} />

      <form action={deleteSpotlightAction} className="self-start">
        <input type="hidden" name="id" value={spotlight.id} />
        <button
          type="submit"
          className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          Spotlight löschen
        </button>
      </form>
    </div>
  );
}
