"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { FacilityDrawer } from "@/components/FacilityDrawer";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { useLiveFacilities } from "@/lib/store";
import { riskColor, riskLabel, type Facility } from "@/data/district";
import { ArrowUpDown } from "lucide-react";

type SortKey = "name" | "overall" | "riskLevel";

const riskWeight: Record<Facility["riskLevel"], number> = {
  critical: 0,
  stress: 1,
  monitor: 2,
  healthy: 3,
};

export default function FacilitiesPage() {
  const { facilities, loading } = useLiveFacilities();
  const [selected, setSelected] = useState<Facility | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("riskLevel");

  const sorted = useMemo(() => {
    return [...facilities].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "overall") return a.performance.overall - b.performance.overall;
      return riskWeight[a.riskLevel] - riskWeight[b.riskLevel];
    });
  }, [facilities, sortKey]);

  function SortButton({ label, k }: { label: string; k: SortKey }) {
    return (
      <button
        onClick={() => setSortKey(k)}
        className={`flex items-center gap-1 text-xs uppercase tracking-wider ${
          sortKey === k ? "text-accent-clay font-medium" : "text-ink-soft"
        }`}
      >
        {label} <ArrowUpDown size={12} />
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Facility Directory" title="Facilities" />

      <div className="flex gap-6 border-b border-hairline pb-3">
        <SortButton label="Risk" k="riskLevel" />
        <SortButton label="Name" k="name" />
        <SortButton label="Score" k="overall" />
      </div>

      {loading ? (
        <SkeletonBlock rows={8} />
      ) : (
        <div className="divide-y divide-hairline border border-hairline">
          {sorted.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelected(f)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-paper-dim/40 transition"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: riskColor[f.riskLevel] }}
                />
                <div>
                  <p className="text-sm font-medium text-ink">{f.name}</p>
                  <p className="text-xs text-ink-soft">{f.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: riskColor[f.riskLevel] }}
                >
                  {riskLabel[f.riskLevel]}
                </span>
                <span className="font-serif-display text-lg tabular text-ink w-10 text-right">
                  {f.performance.overall}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <FacilityDrawer facility={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
