"use client";

import type { TraceStep } from "@/lib/agentTrace";

function countByKind(steps: TraceStep[], kind: TraceStep["kind"]): number {
  return steps.filter((s) => s.kind === kind).length;
}

function facilitiesScanned(steps: TraceStep[]): number {
  const scan = steps.find((s) => s.kind === "scan");
  return (scan?.detail?.facility_count as number) ?? (scan?.detail?.bed_count as number) ?? 0;
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 min-w-[120px] border border-hairline bg-paper-dim/50 px-4 py-3">
      <p className="font-serif-display text-2xl tabular text-ink">{value}</p>
      <p className="text-[10px] tracking-[0.14em] uppercase text-ink-soft mt-0.5">{label}</p>
    </div>
  );
}

export function LiveCounters({ visibleSteps }: { visibleSteps: TraceStep[] }) {
  const scanned = facilitiesScanned(visibleSteps);
  const evaluated = countByKind(visibleSteps, "detect") + countByKind(visibleSteps, "skip");
  const examined = countByKind(visibleSteps, "candidate") + countByKind(visibleSteps, "reject");
  const rejected = countByKind(visibleSteps, "reject");
  const proposed = countByKind(visibleSteps, "propose");

  return (
    <div className="flex flex-wrap gap-3">
      <Counter label="Facilities in scope" value={scanned} />
      <Counter label="Items evaluated" value={evaluated} />
      <Counter label="Candidates examined" value={examined} />
      <Counter label="Candidates rejected" value={rejected} />
      <Counter label="Proposals emitted" value={proposed} />
    </div>
  );
}
