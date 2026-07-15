import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholder-image";
import { FamilyFitBadge } from "@/components/family-fit-badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPublishedAccommodations } from "@/lib/data/accommodations";
import { getPublishedActivities } from "@/lib/data/activities";
import { parseCompareItemsParam } from "@/lib/compare";
import { formatPrice } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { toStringParam, type SearchParams } from "@/lib/search-params";
import type { Accommodation, Activity } from "@/lib/types";

export const metadata: Metadata = {
  title: "Vergleich",
  robots: { index: false },
};

interface CompareRow {
  key: string;
  title: string;
  detailHref: string;
  imageUrl: string | null;
  imageAlt: string;
  placeholderKind: "accommodation" | "activity";
  location: string;
  totalPrice: string;
  maxGuests: string;
  bedrooms: string;
  bathrooms: string;
  familyRating: number | null;
  realityPoints: string[];
  freePerks: string;
}

function accommodationToRow(a: Accommodation): CompareRow {
  const location = [a.city, a.country?.name].filter(Boolean).join(", ") || "–";
  const totalPrice = a.example_total_price
    ? formatPrice(a.example_total_price, a.currency)
    : a.price_from
      ? `ab ${formatPrice(a.price_from, a.currency)}`
      : "–";

  return {
    key: `accommodation:${a.id}`,
    title: a.title,
    detailHref: `/familienunterkuenfte/${a.slug}`,
    imageUrl: resolveMediaUrl(a.cover_media),
    imageAlt: a.cover_media?.alt_text ?? a.title,
    placeholderKind: "accommodation",
    location,
    totalPrice,
    maxGuests: a.max_guests != null ? String(a.max_guests) : "–",
    bedrooms: a.bedrooms != null ? String(a.bedrooms) : "–",
    bathrooms: a.bathrooms != null ? String(a.bathrooms) : "–",
    familyRating: a.family_rating,
    realityPoints: a.pros.slice(0, 2),
    freePerks: "–",
  };
}

function activityToRow(a: Activity): CompareRow {
  const location = [a.city, a.country?.name].filter(Boolean).join(", ") || "–";
  const totalPrice = a.example_total_price ? formatPrice(a.example_total_price) : "–";
  const freePerks = [
    a.family_ticket ? "Familienticket" : null,
    a.large_family_discount ? "Großfamilienrabatt" : null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    key: `activity:${a.id}`,
    title: a.title,
    detailHref: `/familienaktivitaeten/${a.slug}`,
    imageUrl: resolveMediaUrl(a.cover_media),
    imageAlt: a.cover_media?.alt_text ?? a.title,
    placeholderKind: "activity",
    location,
    totalPrice,
    maxGuests: "–",
    bedrooms: "–",
    bathrooms: "–",
    familyRating: a.family_rating,
    realityPoints: a.pros.slice(0, 2),
    freePerks: freePerks || "–",
  };
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const itemsParam = toStringParam(params.items);
  const compareItems = parseCompareItemsParam(itemsParam);

  const accommodationIds = compareItems
    .filter((item) => item.contentType === "accommodation")
    .map((item) => item.id);
  const activityIds = compareItems
    .filter((item) => item.contentType === "activity")
    .map((item) => item.id);

  const [accommodations, activities] = await Promise.all([
    accommodationIds.length > 0
      ? getPublishedAccommodations({ ids: accommodationIds })
      : Promise.resolve([]),
    activityIds.length > 0 ? getPublishedActivities({ ids: activityIds }) : Promise.resolve([]),
  ]);

  const rowsByKey = new Map<string, CompareRow>();
  for (const a of accommodations) rowsByKey.set(`accommodation:${a.id}`, accommodationToRow(a));
  for (const a of activities) rowsByKey.set(`activity:${a.id}`, activityToRow(a));

  const rows = compareItems
    .map((item) => rowsByKey.get(`${item.contentType}:${item.id}`))
    .filter((row): row is CompareRow => row != null);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Vergleich" }]} />
      <h1 className="mb-6 text-3xl font-semibold text-foreground">Vergleich</h1>

      {rows.length < 2 ? (
        <p className="text-muted-foreground">
          Für einen Vergleich braucht ihr mindestens zwei Angebote. Fügt
          Unterkünfte oder Aktivitäten über den Vergleichs-Button auf den
          Karten hinzu.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40 p-3 text-left text-sm font-medium text-muted-foreground" />
                {rows.map((row) => (
                  <th key={row.key} className="min-w-52 p-3 text-left align-top">
                    <Link href={row.detailHref} className="group flex flex-col gap-2">
                      <div className="relative h-32 w-full overflow-hidden rounded-xl">
                        {row.imageUrl ? (
                          <Image
                            src={row.imageUrl}
                            alt={row.imageAlt}
                            fill
                            sizes="220px"
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <PlaceholderImage kind={row.placeholderKind} className="h-full w-full" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover:underline">
                        {row.title}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareTableRow label="Ort" rows={rows} render={(row) => row.location} />
              <CompareTableRow label="Gesamtpreis" render={(row) => row.totalPrice} rows={rows} />
              <CompareTableRow label="Max. Personenzahl" render={(row) => row.maxGuests} rows={rows} />
              <CompareTableRow label="Schlafzimmer" render={(row) => row.bedrooms} rows={rows} />
              <CompareTableRow label="Badezimmer" render={(row) => row.bathrooms} rows={rows} />
              <CompareTableRow
                label="FamVaya Family Fit"
                rows={rows}
                render={(row) => <FamilyFitBadge score={row.familyRating} />}
              />
              <CompareTableRow
                label="Das spricht dafür"
                rows={rows}
                render={(row) =>
                  row.realityPoints.length > 0 ? (
                    <ul className="space-y-1">
                      {row.realityPoints.map((point) => (
                        <li key={point} className="flex items-start gap-1.5 text-sm">
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "–"
                  )
                }
              />
              <CompareTableRow
                label="Kostenlose Leistungen / Rabatte"
                rows={rows}
                render={(row) => row.freePerks}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CompareTableRow({
  label,
  rows,
  render,
}: {
  label: string;
  rows: CompareRow[];
  render: (row: CompareRow) => React.ReactNode;
}) {
  return (
    <tr className="border-t border-border">
      <th className="w-40 p-3 text-left text-sm font-medium text-muted-foreground">{label}</th>
      {rows.map((row) => (
        <td key={row.key} className="p-3 text-sm text-foreground">
          {render(row)}
        </td>
      ))}
    </tr>
  );
}
