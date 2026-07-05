"use client";

import dynamic from "next/dynamic";
import type { Facility } from "@/data/district";

const DistrictMap = dynamic(
  () => import("./DistrictMap").then((m) => m.DistrictMap),
  {
    ssr: false,
    loading: () => (
      <div className="border border-hairline h-[420px] flex items-center justify-center text-ink-soft text-sm">
        Loading district map…
      </div>
    ),
  }
);

export function DistrictMapClient({
  facilities,
  height,
  onSelect,
}: {
  facilities: Facility[];
  height?: number;
  onSelect?: (facility: Facility) => void;
}) {
  return <DistrictMap facilities={facilities} height={height} onSelect={onSelect} />;
}
