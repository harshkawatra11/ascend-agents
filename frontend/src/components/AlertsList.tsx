import { facilityById, type Alert } from "@/data/district";
import { EmptyState } from "@/components/ui/EmptyState";
import { BellOff } from "lucide-react";

const severityColor = {
  info: "var(--color-accent-brass)",
  warning: "var(--color-risk-monitor)",
  critical: "var(--color-risk-critical)",
} as const;

export function AlertsList({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <EmptyState icon={BellOff} title="No active alerts" detail="The district is currently within safe operating thresholds." />
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((a) => (
        <div
          key={a.id}
          className="border-l-2 pl-4 py-1"
          style={{ borderColor: severityColor[a.severity] }}
        >
          <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft">
            {facilityById(a.facilityId)?.name ?? a.facilityId} ·{" "}
            <span style={{ color: severityColor[a.severity] }}>{a.severity}</span>
          </p>
          <p className="font-serif-display text-base text-ink mt-0.5">{a.title}</p>
          {a.detail && <p className="text-sm text-ink-soft">{a.detail}</p>}
        </div>
      ))}
    </div>
  );
}
