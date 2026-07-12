import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { signUpWithPassword } from "@/app/auth/actions";
import { toStringParam, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Registrieren",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = toStringParam(params.error);
  const success = toStringParam(params.success);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Registrieren</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Schon dabei?{" "}
          <Link href="/anmelden" className="text-primary underline">
            Jetzt anmelden
          </Link>
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {success ? (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Fast geschafft — wir haben dir eine Bestätigungs-E-Mail geschickt.
          Bitte klicke auf den Link darin, um dein Konto zu aktivieren.
        </p>
      ) : (
        <form action={signUpWithPassword} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            E-Mail
            <input type="email" name="email" required className={filterInputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Passwort
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className={filterInputClass}
            />
          </label>
          <Button type="submit">Konto erstellen</Button>
        </form>
      )}
    </div>
  );
}
