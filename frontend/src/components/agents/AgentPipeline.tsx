"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { agents, agentOrder, type AgentId } from "@/lib/agents";
import type { TraceStep } from "@/lib/agentTrace";

interface AgentTally {
  detect: number;
  candidate: number;
  reject: number;
  propose: number;
}

function tallyByAgent(steps: TraceStep[]): Record<AgentId, AgentTally> {
  const base: Record<AgentId, AgentTally> = {
    monitor: { detect: 0, candidate: 0, reject: 0, propose: 0 },
    reason: { detect: 0, candidate: 0, reject: 0, propose: 0 },
    act: { detect: 0, candidate: 0, reject: 0, propose: 0 },
  };
  for (const s of steps) {
    if (s.kind === "detect") base[s.agent].detect += 1;
    if (s.kind === "candidate") base[s.agent].candidate += 1;
    if (s.kind === "reject") base[s.agent].reject += 1;
    if (s.kind === "propose") base[s.agent].propose += 1;
  }
  return base;
}

function tallyLine(id: AgentId, t: AgentTally): string {
  if (id === "monitor") return `${t.detect} risk${t.detect === 1 ? "" : "s"} detected`;
  if (id === "reason") return `${t.candidate} candidate${t.candidate === 1 ? "" : "s"} · ${t.reject} rejected`;
  return `${t.propose} proposed`;
}

export function AgentPipeline({
  visibleSteps,
  isReplaying,
}: {
  visibleSteps: TraceStep[];
  isReplaying: boolean;
}) {
  const tallies = tallyByAgent(visibleSteps);
  const activeAgent = visibleSteps.length > 0 ? visibleSteps[visibleSteps.length - 1].agent : null;

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      {agentOrder.map((id, i) => {
        const def = agents[id];
        const active = isReplaying && activeAgent === id;
        return (
          <div key={id} className="flex items-stretch gap-3 flex-1 min-w-[180px]">
            <motion.div
              animate={active ? { scale: [1, 1.015, 1] } : { scale: 1 }}
              transition={{ duration: 0.9, repeat: active ? Infinity : 0 }}
              className="flex-1 border p-4"
              style={{
                borderColor: active ? def.colorVar : "var(--color-hairline)",
                borderWidth: active ? 2 : 1,
                background: active ? "var(--color-paper-dim)" : "var(--color-paper)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`size-2 rounded-full ${active ? "animate-pulse-ring" : ""}`}
                  style={{ background: def.colorVar }}
                />
                <p
                  className="text-[11px] tracking-[0.18em] uppercase font-medium"
                  style={{ color: def.colorVar }}
                >
                  {def.name}
                </p>
              </div>
              <p className="text-sm text-ink-soft">{tallyLine(id, tallies[id])}</p>
            </motion.div>
            {i < agentOrder.length - 1 && (
              <div className="flex items-center text-ink-soft">
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center text-ink-soft">
        <ArrowRight size={16} />
      </div>
      <div className="flex-1 min-w-[180px] border-2 border-accent-clay p-4 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-accent-clay shrink-0" />
          <p className="text-[11px] tracking-[0.18em] uppercase font-medium text-accent-clay">
            Human Approval
          </p>
        </div>
      </div>
    </div>
  );
}
