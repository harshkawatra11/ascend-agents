"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shell/PageHeader";
import { KpiStrip, type KpiData } from "@/components/KpiStrip";
import { DistrictMapClient } from "@/components/DistrictMapClient";
import { RiskDonut } from "@/components/RiskDonut";
import { AlertsList } from "@/components/AlertsList";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { AgentStatusStrip } from "@/components/AgentStatusStrip";
import { useLiveFacilities, useRecommendations } from "@/lib/store";
import { getAlerts, getDistrictKpis } from "@/lib/api";
import { districtKpis as mockKpis } from "@/data/district";
import type { Alert, RiskLevel } from "@/data/district";
import { SkeletonBlock } from "@/components/ui/Skeleton";

export default function OverviewPage() {
  const { facilities, loading: facilitiesLoading } = useLiveFacilities();
  const { recommendations, loading: recsLoading } = useRecommendations();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [kpis, setKpis] = useState<KpiData>(mockKpis);

  useEffect(() => {
    getAlerts().then(setAlerts);
    getDistrictKpis().then(setKpis);
  }, []);

  const riskCounts = facilities.reduce(
    (acc, f) => {
      acc[f.riskLevel] += 1;
      return acc;
    },
    { healthy: 0, monitor: 0, stress: 0, critical: 0 } as Record<RiskLevel, number>
  );

  const pendingRecs = recommendations.filter((r) => r.status === "pending").slice(0, 2);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Live Status" title="District Overview" />

      <KpiStrip kpis={kpis} />

      <AgentStatusStrip />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
            District Map
          </p>
          {facilitiesLoading ? (
            <SkeletonBlock rows={6} />
          ) : (
            <DistrictMapClient facilities={facilities} height={320} />
          )}
        </div>
        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
            Risk Distribution
          </p>
          <RiskDonut counts={riskCounts} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft">
              Top Alerts
            </p>
            <Link href="/map" className="text-xs text-accent-clay hover:underline">
              View map →
            </Link>
          </div>
          <AlertsList alerts={alerts.slice(0, 4)} />
        </div>
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft">
              Pending Recommendations
            </p>
            <Link href="/recommendations" className="text-xs text-accent-clay hover:underline">
              Review all →
            </Link>
          </div>
          {recsLoading ? (
            <SkeletonBlock rows={4} />
          ) : pendingRecs.length === 0 ? (
            <p className="text-sm text-ink-soft italic">No pending recommendations.</p>
          ) : (
            <RecommendationsPanel limit={2} columns={1} />
          )}
        </div>
      </div>
    </div>
  );
}
