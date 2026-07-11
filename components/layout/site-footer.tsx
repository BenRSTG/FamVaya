import Image from "next/image";

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
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} FamVaya · Rechtliche Seiten (Impressum,
          Datenschutz) folgen in einer späteren Phase.
        </p>
      </div>
    </footer>
  );
}
