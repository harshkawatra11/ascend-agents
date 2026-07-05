"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { ForecastChart } from "@/components/ForecastChart";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { getFootfallForecast } from "@/lib/api";

export default function FootfallPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getFootfallForecast>> | null>(
    null
  );

  useEffect(() => {
    getFootfallForecast().then(setData);
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Patient Footfall Prediction" title="Footfall Forecast" />

      {data === null ? (
        <SkeletonBlock rows={8} />
      ) : (
        <>
          <ForecastChart series={data.series} breakdown={data.breakdown} />

          <section>
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
              Confidence Factors ({data.confidence}%)
            </p>
            <div className="flex flex-wrap gap-2">
              {data.factors.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1.5 text-sm border border-hairline bg-paper-dim/40 text-ink"
                >
                  {f}
                </span>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
