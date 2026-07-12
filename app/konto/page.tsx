import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAllAgeGroups, getAllTags } from "@/lib/data/shared";
import { updateFamilyProfile } from "@/app/konto/actions";
import { signOut } from "@/app/auth/actions";
import { toStringParam, type SearchParams } from "@/lib/search-params";
import type { FamilyProfile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mein Konto",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireUser("/konto");
  const params = await searchParams;
  const saved = toStringParam(params.saved);
  const error = toStringParam(params.error);

  const supabase = await createClient();
  const [{ data: profile }, ageGroups, tags] = await Promise.all([
    supabase
      .from("family_profiles")
      .select(
        "user_id, adults_count, children_count, children_age_groups, city, postal_code, max_budget, preferred_distance, interests, accessibility_needs, has_pet"
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    getAllAgeGroups(),
    getAllTags(),
  ]);

  const p = profile as FamilyProfile | null;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mein Konto
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Abmelden
          </Button>
        </form>
      </div>

      {saved && (
        <p className="mb-6 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Familienprofil gespeichert.
        </p>
      )}
      {error && (
        <p className="mb-6 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <p className="mb-6 text-sm text-muted-foreground">
        <Link href="/merkliste" className="text-primary underline">
          Zur Merkliste →
        </Link>
      </p>

      <form action={updateFamilyProfile} className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-foreground">
          Familienprofil
        </h2>

        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Erwachsene
            <input
              type="number"
              name="adults_count"
              min={1}
              defaultValue={p?.adults_count ?? 2}
              className={filterInputClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Kinder
            <input
              type="number"
              name="children_count"
              min={0}
              defaultValue={p?.children_count ?? 3}
              className={filterInputClass}
            />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm text-muted-foreground">
            Altersgruppen der Kinder
          </legend>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((group) => (
              <label
                key={group.id}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent/40"
              >
                <input
                  type="checkbox"
                  name="children_age_groups"
                  value={group.name}
                  defaultChecked={p?.children_age_groups?.includes(group.name)}
                  className="size-4"
                />
                {group.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Wohnort
            <input
              type="text"
              name="city"
              defaultValue={p?.city ?? ""}
              className={filterInputClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Postleitzahl
            <input
              type="text"
              name="postal_code"
              defaultValue={p?.postal_code ?? ""}
              className={filterInputClass}
            />
          </label>
        </div>

        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Maximales Budget (€)
            <input
              type="number"
              name="max_budget"
              min={0}
              defaultValue={p?.max_budget ?? ""}
              className={filterInputClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Bevorzugte Entfernung (km)
            <input
              type="number"
              name="preferred_distance"
              min={0}
              defaultValue={p?.preferred_distance ?? ""}
              className={filterInputClass}
            />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm text-muted-foreground">
            Interessen
          </legend>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent/40"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={tag.name}
                  defaultChecked={p?.interests?.includes(tag.name)}
                  className="size-4"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="has_pet"
            defaultChecked={p?.has_pet ?? false}
            className="size-4"
          />
          Wir reisen mit Haustier
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Barrierefreiheitsbedarf (optional)
          <textarea
            name="accessibility_needs"
            defaultValue={p?.accessibility_needs ?? ""}
            rows={3}
            className={filterInputClass + " h-auto py-2"}
          />
        </label>

        <Button type="submit" size="lg">
          Profil speichern
        </Button>
      </form>
    </div>
  );
}
