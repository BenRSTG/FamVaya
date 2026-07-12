import { getAccommodationTypes } from "@/lib/data/accommodations";
import { getAllAgeGroups, getAllAmenities, getAllProviders, getAllRegions, getAllTags } from "@/lib/data/shared";
import { AccommodationForm } from "@/app/admin/unterkuenfte/accommodation-form";
import { createAccommodation } from "@/app/admin/unterkuenfte/actions";

export default async function NewAccommodationPage() {
  const [accommodationTypes, providers, regions, amenities, ageGroups, tags] = await Promise.all([
    getAccommodationTypes(),
    getAllProviders(),
    getAllRegions(),
    getAllAmenities(),
    getAllAgeGroups(),
    getAllTags(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Neue Unterkunft</h1>
      <AccommodationForm
        accommodation={null}
        accommodationTypes={accommodationTypes}
        providers={providers}
        regions={regions}
        amenities={amenities}
        ageGroups={ageGroups}
        tags={tags}
        action={createAccommodation}
      />
    </div>
  );
}
