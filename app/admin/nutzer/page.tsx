import { requireAdmin } from "@/lib/auth";
import { getAllUsersForAdmin } from "@/lib/data/users";
import { filterInputClass } from "@/components/filter-field";
import { updateUserRole } from "@/app/admin/nutzer/actions";

const ROLE_LABEL: Record<string, string> = {
  user: "Nutzer",
  editor: "Redakteur",
  admin: "Admin",
  provider: "Anbieter",
};

export default async function AdminUsersPage() {
  await requireAdmin("/admin/nutzer");
  const users = await getAllUsersForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Nutzer</h1>
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
