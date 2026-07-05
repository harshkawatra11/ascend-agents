import { alerts, facilityById } from "@/data/district";

const severityColor = {
  info: "var(--color-accent-brass)",
  warning: "var(--color-risk-monitor)",
  critical: "var(--color-risk-critical)",
} as const;

export function AlertsList() {
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
          <p className="text-sm text-ink-soft">{a.detail}</p>
        </div>
      ))}
    </div>
  );
}
