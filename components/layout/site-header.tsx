import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { MobileNav } from "@/components/layout/mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/famvaya-logo.svg"
            alt="FamVaya"
            width={140}
            height={79}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/suche"
            aria-label="Suche"
            className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
          >
            <Search className="size-5" aria-hidden />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
