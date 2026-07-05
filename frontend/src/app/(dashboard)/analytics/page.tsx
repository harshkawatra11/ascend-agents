"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { AnalyticsAndTimeline } from "@/components/AnalyticsAndTimeline";
import { PerformanceScores, type PerformanceRow } from "@/components/PerformanceScores";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { getCausalChain, getPerformanceScores } from "@/lib/api";
import { causalChain as mockCausalChain } from "@/data/district";

export default function AnalyticsPage() {
  const [chain, setChain] = useState(mockCausalChain);
  const [performance, setPerformance] = useState<PerformanceRow[] | null>(null);

  useEffect(() => {
    getCausalChain("phc_18").then((c) => setChain(c as typeof mockCausalChain));
    getPerformanceScores().then(setPerformance);
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Why, Not Just What" title="Analytics" />

      <AnalyticsAndTimeline causalChain={chain} />

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Performance Scorecards
        </p>
        {performance === null ? (
          <SkeletonBlock rows={6} />
        ) : (
          <PerformanceScores rows={performance} />
        )}
      </section>
    </div>
  );
}
