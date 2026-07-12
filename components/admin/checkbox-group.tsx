export function CheckboxGroup({
  name,
  options,
  selectedIds,
}: {
  name: string;
  options: { id: string; name: string }[];
  selectedIds: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent/40"
        >
          <input
            type="checkbox"
            name={name}
            value={option.id}
            defaultChecked={selectedIds.includes(option.id)}
            className="size-4"
          />
          {option.name}
        </label>
      ))}
    </div>
  );
}
