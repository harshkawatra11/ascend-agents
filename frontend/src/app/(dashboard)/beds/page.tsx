"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getBedsForecast } from "@/lib/api";
import { facilityById } from "@/data/district";
import { BedDouble } from "lucide-react";

interface BedRow {
  facility_id: string;
  occupied: number;
  occupancy_pct: number;
  predicted_tomorrow_pct: number;
  predicted_next_week_pct: number;
  confidence: number;
}

export default function BedsPage() {
  const [beds, setBeds] = useState<BedRow[] | null>(null);

  useEffect(() => {
    getBedsForecast().then((data) => setBeds((data.beds as unknown as BedRow[]) ?? []));
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Bed Prediction" title="Bed Occupancy" />

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Occupancy Forecast
        </p>
        {beds === null ? (
          <SkeletonBlock rows={4} />
        ) : beds.length === 0 ? (
          <EmptyState
            icon={BedDouble}
            title="No bed data"
            detail="Start the FastAPI backend to see live occupancy forecasts here."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {beds.map((b) => (
              <div key={b.facility_id} className="border border-hairline bg-paper-dim/40 p-4">
                <p className="text-sm font-medium text-ink mb-2">
                  {facilityById(b.facility_id)?.name ?? b.facility_id}
                </p>
                <div className="flex items-baseline gap-4 text-sm">
                  <div>
                    <p className="text-[10px] uppercase text-ink-soft">Today</p>
                    <p className="font-serif-display text-xl tabular text-ink">
                      {b.occupancy_pct}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-ink-soft">Tomorrow</p>
                    <p className="font-serif-display text-xl tabular text-ink">
                      {b.predicted_tomorrow_pct}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-ink-soft">Next Week</p>
                    <p className="font-serif-display text-xl tabular text-accent-clay">
                      {b.predicted_next_week_pct}%
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-ink-soft">{b.confidence}% conf.</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Bed Redirect Recommendations
        </p>
        <RecommendationsPanel filterType="bed_redirect" />
      </section>
    </div>
  );
}
