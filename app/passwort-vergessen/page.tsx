import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { requestPasswordReset } from "@/app/auth/actions";
import { toStringParam, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Passwort vergessen",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const success = toStringParam(params.success);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Passwort vergessen</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Doch wieder eingefallen?{" "}
          <Link href="/anmelden" className="text-primary underline">
            Zur Anmeldung
          </Link>
        </p>
      </div>

      {success ? (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir einen
          Link zum Zurücksetzen verschickt — prüfe dein Postfach.
        </p>
      ) : (
        <form action={requestPasswordReset} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            E-Mail
            <input type="email" name="email" required className={filterInputClass} />
          </label>
          <Button type="submit">Link zum Zurücksetzen senden</Button>
        </form>
      )}
    </div>
  );
}
