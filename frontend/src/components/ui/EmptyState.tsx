import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center border border-dashed border-hairline py-14 px-6">
      <Icon size={28} strokeWidth={1.5} className="text-ink-soft/60 mb-3" />
      <p className="text-sm font-medium text-ink">{title}</p>
      {detail && <p className="text-xs text-ink-soft mt-1 max-w-xs">{detail}</p>}
    </div>
  );
}
