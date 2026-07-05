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

export interface KpiData {
  todaysRisk: { value: string; detail: string };
  footfall: { value: number; confidence: number };
  bedOccupancy: { value: string; nextWeek: string };
  doctorsAbsent: { value: number; detail: string };
  medicineRisk: { value: number; detail: string };
}

export function KpiStrip({ kpis }: { kpis: KpiData }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Kpi label="Today's Risk" value={kpis.todaysRisk.value} detail={kpis.todaysRisk.detail} />
      <Kpi
        label="Footfall (Tomorrow)"
        value={kpis.footfall.value}
        detail={`${kpis.footfall.confidence}% confidence`}
      />
      <Kpi
        label="Bed Occupancy"
        value={kpis.bedOccupancy.value}
        detail={`Next week: ${kpis.bedOccupancy.nextWeek}`}
      />
      <Kpi label="Doctors Absent" value={kpis.doctorsAbsent.value} detail={kpis.doctorsAbsent.detail} />
      <Kpi label="Medicine at Risk" value={kpis.medicineRisk.value} detail={kpis.medicineRisk.detail} />
    </div>
  );
}
