import { getMicroAdventureCategories } from "@/lib/data/micro-adventures";
import { getAllAgeGroups, getAllTags } from "@/lib/data/shared";
import { MicroAdventureForm } from "@/app/admin/mikro-abenteuer/micro-adventure-form";
import { createMicroAdventure } from "@/app/admin/mikro-abenteuer/actions";

export default async function NewMicroAdventurePage() {
  const [categories, ageGroups, tags] = await Promise.all([
    getMicroAdventureCategories(),
    getAllAgeGroups(),
    getAllTags(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Neues Mikro-Abenteuer</h1>
      <MicroAdventureForm
        microAdventure={null}
        categories={categories}
        ageGroups={ageGroups}
        tags={tags}
        action={createMicroAdventure}
      />
    </div>
  );
}
