"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMedicineForecast } from "@/lib/api";
import { Pill } from "lucide-react";

interface MedicineRow {
  facility_id: string;
  medicine_name: string;
  units_remaining: number;
  days_remaining: number;
  risk: string;
  confidence: number;
  factors: string[];
}

const riskTextClass: Record<string, string> = {
  high: "text-risk-critical",
  medium: "text-risk-monitor",
  low: "text-risk-healthy",
};

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<MedicineRow[] | null>(null);

  useEffect(() => {
    getMedicineForecast().then((data) =>
      setMedicines((data.medicines as unknown as MedicineRow[]) ?? [])
    );
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Stock Monitoring" title="Inventory Intelligence" />

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Medicine Stock — Days Remaining
        </p>
        {medicines === null ? (
          <SkeletonBlock rows={6} />
        ) : medicines.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="No medicine data"
            detail="Start the FastAPI backend (uvicorn app.main:app --port 8080) to see live stock forecasts here."
          />
        ) : (
          <div className="overflow-x-auto border border-hairline">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hairline bg-paper-dim/60">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-ink-soft">
                    Facility
                  </th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-ink-soft">
                    Medicine
                  </th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-ink-soft">
                    Units
                  </th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-ink-soft">
                    Days Remaining
                  </th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-ink-soft">
                    Risk
                  </th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-ink-soft">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m, i) => (
                  <tr key={i} className="border-b border-hairline last:border-0">
                    <td className="px-4 py-3 text-ink">{m.facility_id}</td>
                    <td className="px-4 py-3 text-ink font-medium">{m.medicine_name}</td>
                    <td className="px-4 py-3 text-right tabular text-ink-soft">
                      {m.units_remaining}
                    </td>
                    <td className="px-4 py-3 text-right tabular text-ink">{m.days_remaining}</td>
                    <td
                      className={`px-4 py-3 text-right uppercase text-xs font-medium ${riskTextClass[m.risk] ?? "text-ink-soft"}`}
                    >
                      {m.risk}
                    </td>
                    <td className="px-4 py-3 text-right tabular text-ink-soft">
                      {m.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Stock Transfer Recommendations
        </p>
        <RecommendationsPanel filterType="stock_transfer" />
      </section>
    </div>
  );
}
