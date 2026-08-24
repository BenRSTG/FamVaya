import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { setNewPassword } from "@/app/auth/actions";
import { requireUser } from "@/lib/auth";
import { toStringParam, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Neues Passwort festlegen",
};

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireUser("/konto/passwort-setzen");
  const params = await searchParams;
  const error = toStringParam(params.error);
  const forced = toStringParam(params.forced);
  const next = toStringParam(params.next) ?? "/konto";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Neues Passwort festlegen</h1>
        {forced && (
          <p className="mt-2 text-sm text-muted-foreground">
            Bitte lege ein neues Passwort fest, bevor du fortfährst.
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <form action={setNewPassword} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        <label className="flex flex-col gap-1 text-sm">
          Neues Passwort
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className={filterInputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Passwort bestätigen
          <input
            type="password"
            name="passwordConfirm"
            required
            minLength={8}
            className={filterInputClass}
          />
        </label>
        <Button type="submit">Passwort speichern</Button>
      </form>
    </div>
  );
}
