"use client";

import dynamic from "next/dynamic";

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

export function DistrictMapClient() {
  return <DistrictMap />;
}
