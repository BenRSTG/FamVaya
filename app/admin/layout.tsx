import Link from "next/link";
import { requireAdminOrEditor } from "@/lib/auth";
import { ADMIN_NAV_ITEMS } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminOrEditor("/admin");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:flex-row sm:px-6">
      <aside className="flex shrink-0 flex-row gap-1 overflow-x-auto sm:w-56 sm:flex-col sm:overflow-visible">
        <div className="mb-2 hidden text-xs text-muted-foreground sm:block">
          Angemeldet als
          <br />
          <span className="text-foreground">{user.email}</span>
        </div>
        {ADMIN_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
