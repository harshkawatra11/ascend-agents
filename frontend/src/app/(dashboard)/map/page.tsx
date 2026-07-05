"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { DistrictMapClient } from "@/components/DistrictMapClient";
import { RiskHeatmap } from "@/components/RiskHeatmap";
import { FacilityDrawer } from "@/components/FacilityDrawer";
import { useLiveFacilities } from "@/lib/store";
import { riskColor, riskLabel, type Facility, type RiskLevel } from "@/data/district";
import { SkeletonBlock } from "@/components/ui/Skeleton";

const legend: RiskLevel[] = ["healthy", "monitor", "stress", "critical"];

export default function MapPage() {
  const { facilities, loading } = useLiveFacilities();
  const [selected, setSelected] = useState<Facility | null>(null);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Every Facility, One View"
        title="District Map"
        action={
          <div className="flex items-center gap-4">
            {legend.map((level) => (
              <div key={level} className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: riskColor[level] }}
                />
                {riskLabel[level]}
              </div>
            ))}
          </div>
        }
      />

      {loading ? (
        <SkeletonBlock rows={10} />
      ) : (
        <>
          <DistrictMapClient facilities={facilities} height={480} onSelect={setSelected} />

          <section>
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
              Risk Heatmap
            </p>
            <RiskHeatmap facilities={facilities} />
          </section>
        </>
      )}

      <FacilityDrawer facility={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
