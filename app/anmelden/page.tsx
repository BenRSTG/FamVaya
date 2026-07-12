import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { signInWithPassword, signInWithMagicLink } from "@/app/auth/actions";
import { toStringParam, type SearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Anmelden",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = toStringParam(params.error);
  const magicLinkSent = toStringParam(params.magicLinkSent);
  const next = toStringParam(params.next) ?? "/konto";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Anmelden</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Noch kein Konto?{" "}
          <Link href="/registrieren" className="text-primary underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {magicLinkSent && (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Magic Link verschickt — prüfe dein Postfach.
        </p>
      )}

      <form action={signInWithPassword} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next} />
        <label className="flex flex-col gap-1 text-sm">
          E-Mail
          <input type="email" name="email" required className={filterInputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Passwort
          <input type="password" name="password" required className={filterInputClass} />
        </label>
        <Button type="submit">Mit Passwort anmelden</Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        oder
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={signInWithMagicLink} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          E-Mail für Magic Link
          <input type="email" name="email" required className={filterInputClass} />
        </label>
        <Button type="submit" variant="outline">
          Magic Link senden
        </Button>
      </form>
    </div>
  );
}
