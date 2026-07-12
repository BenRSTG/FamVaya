import Image from "next/image";
import Link from "next/link";
import { CookieSettingsLink } from "@/components/cookie-settings-link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6">
        <Image
          src="/brand/famvaya-logo.svg"
          alt="FamVaya"
          width={120}
          height={68}
        />
        <p className="max-w-md text-sm text-muted-foreground">
          Abenteuer für die ganze Familie. Wirklich die ganze.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <Link href="/impressum" className="underline-offset-2 hover:underline">
            Impressum
          </Link>
          <Link href="/datenschutz" className="underline-offset-2 hover:underline">
            Datenschutz
          </Link>
          <CookieSettingsLink />
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} FamVaya
        </p>
      </div>
    </footer>
  );
}
