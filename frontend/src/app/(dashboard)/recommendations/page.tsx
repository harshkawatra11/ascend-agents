"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { ResourceTransfers } from "@/components/ResourceTransfers";
import type { Recommendation } from "@/data/district";

const typeFilters: { label: string; value: Recommendation["type"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Stock Transfer", value: "stock_transfer" },
  { label: "Bed Redirect", value: "bed_redirect" },
  { label: "Staff Transfer", value: "staff_transfer" },
  { label: "Diagnostic Redirect", value: "diagnostic_redirect" },
];

export default function RecommendationsPage() {
  const [filter, setFilter] = useState<Recommendation["type"] | "all">("all");

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Propose → Approve → Act" title="AI Recommendations" />

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition ${
              filter === f.value
                ? "border-accent-clay bg-accent-clay text-paper"
                : "border-hairline text-ink-soft hover:border-accent-brass"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <RecommendationsPanel filterType={filter === "all" ? undefined : filter} />

      <section className="border-t border-hairline pt-8">
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Resource Transfers — Approved Actions Log
        </p>
        <ResourceTransfers />
      </section>
    </div>
  );
}
