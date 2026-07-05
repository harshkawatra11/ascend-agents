"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { getFacilityDetail, type FacilityDetail } from "@/lib/api";
import { riskColor, riskLabel, type Facility } from "@/data/district";

export function FacilityDrawer({
  facility,
  onClose,
}: {
  facility: Facility | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<FacilityDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!facility) return;
    setLoading(true);
    setDetail(null);
    getFacilityDetail(facility.id)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [facility]);

  return (
    <Drawer
      open={!!facility}
      onClose={onClose}
      eyebrow={facility?.type}
      title={facility?.name ?? ""}
    >
      {facility && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: riskColor[facility.riskLevel] }}
            />
            <span className="text-sm font-medium" style={{ color: riskColor[facility.riskLevel] }}>
              {riskLabel[facility.riskLevel]}
            </span>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-2">
              Performance Scorecard
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {Object.entries(facility.performance).map(([key, value]) => (
                <div key={key} className="border border-hairline px-3 py-2">
                  <p className="text-[10px] uppercase text-ink-soft tracking-wider">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="font-serif-display text-lg tabular text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {loading && <SkeletonBlock rows={4} />}

          {!loading && detail && detail.medicine_stock.length > 0 && (
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-2">
                Medicine Stock
              </p>
              <div className="space-y-2">
                {detail.medicine_stock.map((m) => (
                  <div key={m.medicine_name} className="border border-hairline px-3 py-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ink font-medium">{m.medicine_name}</span>
                      <span className="text-ink-soft">{m.days_remaining} days left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && (!detail || detail.medicine_stock.length === 0) && (
            <p className="text-xs text-ink-soft italic">
              Live inventory/bed/doctor detail loads once the backend is reachable — start
              `uvicorn app.main:app --port 8080` to see it here.
            </p>
          )}
        </div>
      )}
    </Drawer>
  );
}
