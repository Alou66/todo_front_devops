import type { TaskLabel } from "@/features/labels/types"

export function LabelChip({ label }: { label: TaskLabel }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${label.color}1a`,
        color: label.color,
      }}
    >
      {label.name}
    </span>
  )
}
