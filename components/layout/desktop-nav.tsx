"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DESKTOP_NAV_ITEMS } from "@/components/layout/nav-items";

export function isActiveNavItem(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center justify-center gap-5 lg:flex xl:gap-7">
      {DESKTOP_NAV_ITEMS.map((item) => {
        const active = isActiveNavItem(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b-2 py-1 text-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-foreground hover:text-primary"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
