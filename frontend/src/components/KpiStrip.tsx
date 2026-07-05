import { districtKpis } from "@/data/district";

function Kpi({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="flex-1 min-w-[150px] border border-hairline bg-paper-dim/60 px-5 py-4">
      <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-2">
        {label}
      </p>
      <p className="font-serif-display text-3xl tabular text-ink">{value}</p>
      {detail && <p className="text-xs text-ink-soft mt-1">{detail}</p>}
    </div>
  );
}

export function KpiStrip() {
  const k = districtKpis;
  return (
    <div className="flex flex-wrap gap-3">
      <Kpi label="Today's Risk" value={k.todaysRisk.value} detail={k.todaysRisk.detail} />
      <Kpi
        label="Footfall (Tomorrow)"
        value={k.footfall.value}
        detail={`${k.footfall.confidence}% confidence`}
      />
      <Kpi
        label="Bed Occupancy"
        value={k.bedOccupancy.value}
        detail={`Next week: ${k.bedOccupancy.nextWeek}`}
      />
      <Kpi label="Doctors Absent" value={k.doctorsAbsent.value} detail={k.doctorsAbsent.detail} />
      <Kpi label="Medicine at Risk" value={k.medicineRisk.value} detail={k.medicineRisk.detail} />
    </div>
  );
}
