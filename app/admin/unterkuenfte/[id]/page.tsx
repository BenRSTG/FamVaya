import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccommodationByIdForAdmin, getAccommodationTypes } from "@/lib/data/accommodations";
import { getAllAgeGroups, getAllAmenities, getAllProviders, getAllRegions, getAllTags } from "@/lib/data/shared";
import { AccommodationForm } from "@/app/admin/unterkuenfte/accommodation-form";
import { updateAccommodation } from "@/app/admin/unterkuenfte/actions";

export default async function EditAccommodationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [accommodation, accommodationTypes, providers, regions, amenities, ageGroups, tags] =
    await Promise.all([
      getAccommodationByIdForAdmin(id),
      getAccommodationTypes(),
      getAllProviders(),
      getAllRegions(),
      getAllAmenities(),
      getAllAgeGroups(),
      getAllTags(),
    ]);

  if (!accommodation) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{accommodation.title}</h1>
        <Link
          href={`/familienunterkuenfte/${accommodation.slug}?preview=1`}
          target="_blank"
          className="text-sm text-primary hover:underline"
        >
          Vorschau ansehen
        </Link>
      </div>
      <AccommodationForm
        accommodation={accommodation}
        accommodationTypes={accommodationTypes}
        providers={providers}
        regions={regions}
        amenities={amenities}
        ageGroups={ageGroups}
        tags={tags}
        action={updateAccommodation}
      />
    </div>
  );
}
