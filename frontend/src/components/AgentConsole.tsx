"use client";

import { useAgentRun } from "@/lib/useAgentRun";
import { RunControlBar } from "@/components/agents/RunControlBar";
import { LiveCounters } from "@/components/agents/LiveCounters";
import { AgentPipeline } from "@/components/agents/AgentPipeline";
import { TraceStream } from "@/components/agents/TraceStream";
import { ApprovalQueue } from "@/components/agents/ApprovalQueue";

export function AgentConsole() {
  const {
    trace,
    visibleSteps,
    status,
    runCount,
    nextRunInSeconds,
    isPaused,
    runNow,
    togglePause,
  } = useAgentRun();

  const isReplaying = status === "replaying" || status === "fetching";
  const stepTotal = trace?.steps.length ?? 0;

  return (
    <div className="space-y-6">
      <RunControlBar
        trace={trace}
        status={status}
        runCount={runCount}
        nextRunInSeconds={nextRunInSeconds}
        isPaused={isPaused}
        runNow={runNow}
        togglePause={togglePause}
        stepIndex={visibleSteps.length}
        stepTotal={stepTotal}
      />

      <AgentPipeline visibleSteps={visibleSteps} isReplaying={isReplaying} />

      <LiveCounters visibleSteps={visibleSteps} />

      <div>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-2">
          Live Decision Trace
        </p>
        <TraceStream steps={visibleSteps} />
      </div>

      {status === "done" && trace && <ApprovalQueue proposals={trace.proposals} />}
    </div>
  );
}
