import Link from "next/link";
import { notFound } from "next/navigation";
import { getMicroAdventureByIdForAdmin, getMicroAdventureCategories } from "@/lib/data/micro-adventures";
import { getAllAgeGroups, getAllTags } from "@/lib/data/shared";
import { MicroAdventureForm } from "@/app/admin/mikro-abenteuer/micro-adventure-form";
import { updateMicroAdventure } from "@/app/admin/mikro-abenteuer/actions";

export default async function EditMicroAdventurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [microAdventure, categories, ageGroups, tags] = await Promise.all([
    getMicroAdventureByIdForAdmin(id),
    getMicroAdventureCategories(),
    getAllAgeGroups(),
    getAllTags(),
  ]);

  if (!microAdventure) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{microAdventure.title}</h1>
        <Link
          href={`/mikro-familienabenteuer/${microAdventure.slug}?preview=1`}
          target="_blank"
          className="text-sm text-primary hover:underline"
        >
          Vorschau ansehen
        </Link>
      </div>
      <MicroAdventureForm
        microAdventure={microAdventure}
        categories={categories}
        ageGroups={ageGroups}
        tags={tags}
        action={updateMicroAdventure}
      />
    </div>
  );
}
