"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Von der Admin-API erzeugte Recovery-Links (lib/data/users.ts, ad-hoc-
// Support-Skripte) übergeben die Session als URL-Fragment
// (#access_token=...), nicht als ?code= wie signup/magiclink — ein Fragment
// wird nie an den Server geschickt, /auth/callback (Route Handler) kann es
// also nicht lesen. Diese Client-Seite lässt den Supabase-Browser-Client das
// Fragment automatisch verarbeiten (detectSessionInUrl, Default true) und
// die Session in die Cookies schreiben, bevor sie zu /konto/passwort-setzen
// weiterleitet, wo requireUser() sie dann serverseitig sieht.
export default function RecoveryBridgePage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/konto/passwort-setzen");
      } else {
        setFailed(true);
      }
    });
  }, [router]);

  if (failed) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-16 text-center sm:px-6">
        <p className="text-sm text-destructive">Link ungültig oder abgelaufen.</p>
        <Link href="/passwort-vergessen" className="text-sm text-primary underline">
          Neuen Link anfordern
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-16 text-center sm:px-6">
      <p className="text-sm text-muted-foreground">Einen Moment …</p>
    </div>
  );
}
