import { STATUS_LABEL } from "@/components/admin/status-badge";
import type { ContentStatus } from "@/lib/types";

export function PreviewBanner({ status }: { status: ContentStatus }) {
  if (status === "published") return null;

  return (
    <div className="mb-6 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning">
      Vorschau — dieser Inhalt ist noch nicht öffentlich sichtbar (Status: {STATUS_LABEL[status]}).
    </div>
  );
}
