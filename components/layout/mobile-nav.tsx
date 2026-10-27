"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { isActiveNavItem } from "@/components/layout/desktop-nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Menü öffnen" className="lg:hidden" />
        }
      >
        <Menu aria-hidden />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>FamVaya</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          <Link
            href="/suche"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Search className="size-4" aria-hidden />
            Suche
          </Link>
          {NAV_ITEMS.map((item) => {
            const active = isActiveNavItem(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted",
                  active ? "bg-primary/10 text-primary" : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
