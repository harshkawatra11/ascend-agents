"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDoctorAttendance } from "@/lib/api";
import { facilityById } from "@/data/district";
import { Stethoscope } from "lucide-react";

interface DoctorRow {
  facility_id: string;
  doctor_name: string;
  specialty: string;
  absence_pattern: string | null;
  risk_level: string;
  patient_delay_pct: number;
}

const riskTextClass: Record<string, string> = {
  high: "text-risk-critical",
  medium: "text-risk-monitor",
  low: "text-risk-healthy",
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorRow[] | null>(null);

  useEffect(() => {
    getDoctorAttendance().then((data) =>
      setDoctors((data.doctors as unknown as DoctorRow[]) ?? [])
    );
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Doctor Attendance Intelligence" title="Doctors" />

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Attendance Risk
        </p>
        {doctors === null ? (
          <SkeletonBlock rows={3} />
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No doctor data"
            detail="Start the FastAPI backend to see live attendance risk here."
          />
        ) : (
          <div className="space-y-2">
            {doctors.map((d, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-2 border border-hairline bg-paper-dim/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{d.doctor_name}</p>
                  <p className="text-xs text-ink-soft">
                    {d.specialty} · {facilityById(d.facility_id)?.name ?? d.facility_id}
                  </p>
                </div>
                {d.absence_pattern && (
                  <p className="text-xs text-ink-soft italic">{d.absence_pattern}</p>
                )}
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs uppercase font-medium ${riskTextClass[d.risk_level] ?? "text-ink-soft"}`}
                  >
                    {d.risk_level} risk
                  </span>
                  <span className="text-xs text-ink-soft">
                    {d.patient_delay_pct}% delay
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Staff Transfer Recommendations
        </p>
        <RecommendationsPanel filterType="staff_transfer" />
      </section>
    </div>
  );
}
