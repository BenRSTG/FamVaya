import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-foreground">
        Seite nicht gefunden
      </h1>
      <p className="text-muted-foreground">
        Diese Seite gibt es nicht oder der Inhalt wurde entfernt.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        Zurück zur Startseite
      </Button>
    </div>
  );
}
