import { requireAdmin } from "@/lib/auth";
import { getAllUsersForAdmin } from "@/lib/data/users";
import { filterInputClass } from "@/components/filter-field";
import { Button } from "@/components/ui/button";
import { updateUserRole, inviteUserAction } from "@/app/admin/nutzer/actions";
import { toStringParam, type SearchParams } from "@/lib/search-params";

const ROLE_LABEL: Record<string, string> = {
  user: "Nutzer",
  editor: "Redakteur",
  admin: "Admin",
  provider: "Anbieter",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin("/admin/nutzer");
  const users = await getAllUsersForAdmin();
  const params = await searchParams;
  const tempEmail = toStringParam(params.tempEmail);
  const tempPassword = toStringParam(params.tempPassword);
  const error = toStringParam(params.error);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Nutzer</h1>

      {tempEmail && tempPassword && (
        <div className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-foreground">
          <p className="font-medium">Zugangsdaten für {tempEmail}</p>
          <p className="mt-1">
            Passwort: <span className="font-mono font-semibold">{tempPassword}</span>
          </p>
          <p className="mt-1 text-muted-foreground">
            Bitte jetzt weitergeben — wird nicht erneut angezeigt. Muss nach der ersten Anmeldung
            geändert werden.
          </p>
        </div>
      )}
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="rounded-2xl border border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Nutzer einladen</h2>
        <form action={inviteUserAction} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-sm">
            E-Mail
            <input type="email" name="email" required className={filterInputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Rolle
            <select name="role" defaultValue="editor" className={filterInputClass}>
              {Object.entries(ROLE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="sm">
            Einladen
          </Button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">E-Mail</th>
              <th className="px-4 py-3">Registriert am</th>
              <th className="px-4 py-3">Rolle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{user.email}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("de-DE")}
                </td>
                <td className="px-4 py-3">
                  <form action={updateUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={user.id} />
                    <select name="role" defaultValue={user.role} className={filterInputClass}>
                      {Object.entries(ROLE_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                    >
                      Speichern
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
