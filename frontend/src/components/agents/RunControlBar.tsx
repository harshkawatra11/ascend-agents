"use client";

import { Play, Pause, RotateCw } from "lucide-react";
import type { AgentTraceResponse } from "@/lib/agentTrace";
import type { RunStatus } from "@/lib/useAgentRun";

const statusLabel: Record<RunStatus, string> = {
  idle: "Idle",
  fetching: "Running cycle…",
  replaying: "Replaying trace…",
  done: "Cycle complete",
  error: "Unavailable",
};

function formatDuration(us: number): string {
  if (us >= 1000) return `${(us / 1000).toFixed(2)} ms`;
  return `${us} µs`;
}

export function RunControlBar({
  trace,
  status,
  runCount,
  nextRunInSeconds,
  isPaused,
  runNow,
  togglePause,
  stepIndex,
  stepTotal,
}: {
  trace: AgentTraceResponse | null;
  status: RunStatus;
  runCount: number;
  nextRunInSeconds: number;
  isPaused: boolean;
  runNow: () => void;
  togglePause: () => void;
  stepIndex: number;
  stepTotal: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border border-hairline bg-paper-dim/40 px-5 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className={`size-2 rounded-full ${status === "replaying" || status === "fetching" ? "animate-pulse-ring bg-risk-monitor" : "bg-risk-healthy"}`}
        />
        <span className="text-ink font-medium">{statusLabel[status]}</span>
      </div>

      {stepTotal > 0 && (
        <span className="text-ink-soft tabular">
          step {stepIndex} / {stepTotal}
        </span>
      )}

      {trace && (
        <span className="text-ink-soft tabular">
          real duration: {formatDuration(trace.summary.total_duration_us)}
        </span>
      )}

      {trace && (
        <span
          className="text-[10px] tracking-[0.14em] uppercase px-2 py-1 border border-hairline text-ink-soft"
          title="Whether this cycle read Firestore or the bundled seed data"
        >
          {trace.isSample ? "sample run, backend unavailable" : `source: ${trace.data_source}`}
        </span>
      )}

      <span className="text-ink-soft tabular">run #{runCount}</span>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-ink-soft tabular">
          {isPaused ? "paused" : `next cycle in ${nextRunInSeconds}s`}
        </span>
        <button
          onClick={togglePause}
          className="p-1.5 border border-hairline hover:bg-paper transition"
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>
        <button
          onClick={runNow}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-hairline hover:bg-paper transition text-xs font-medium uppercase tracking-wide"
        >
          <RotateCw size={12} />
          Run now
        </button>
      </div>
    </div>
  );
}
