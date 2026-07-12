import { filterInputClass } from "@/components/filter-field";
import { STATUS_LABEL } from "@/components/admin/status-badge";
import type { ContentStatus } from "@/lib/types";

const STATUSES: ContentStatus[] = [
  "draft",
  "in_review",
  "published",
  "paused",
  "archived",
];

export function StatusSelect({
  defaultValue = "draft",
  name = "status",
}: {
  defaultValue?: ContentStatus;
  name?: string;
}) {
  return (
    <select name={name} defaultValue={defaultValue} className={filterInputClass}>
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABEL[status]}
        </option>
      ))}
    </select>
  );
}
