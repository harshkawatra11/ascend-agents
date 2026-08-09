"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Bot } from "lucide-react";
import { agents, agentOrder, agentStatus, buildAgentActivity, type AgentId } from "@/lib/agents";
import { useRecommendations } from "@/lib/store";
import { EmptyState } from "@/components/ui/EmptyState";

function AgentCard({ id }: { id: AgentId }) {
  const { recommendations, loading } = useRecommendations();
  const def = agents[id];
  const status = agentStatus(recommendations, loading)[id];

  return (
    <div className="border border-hairline bg-paper-dim/50 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[11px] tracking-[0.18em] uppercase font-medium mb-1"
            style={{ color: def.colorVar }}
          >
            {def.name}
          </p>
          <h3 className="font-serif-display text-xl text-ink">{def.tagline}</h3>
        </div>
        <span
          className="shrink-0 text-[10px] tracking-[0.14em] uppercase px-2 py-1 border"
          style={{ borderColor: def.colorVar, color: def.colorVar }}
        >
          {status.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {def.owns.map((o) => (
          <span
            key={o}
            className="text-xs px-2 py-1 border border-hairline text-ink-soft bg-paper"
          >
            {o}
          </span>
        ))}
      </div>

      <p className="text-sm text-ink-soft mt-1">{status.detail}</p>
    </div>
  );
}

function ActivityFeed() {
  const { recommendations, loading } = useRecommendations();
  const events = buildAgentActivity(recommendations).slice(0, 10);

  if (loading) return null;

  if (events.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="No agent activity yet"
        detail="Monitor hasn't detected a risk signal in this session."
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {events.map((e, i) => (
          <motion.div
            key={`${e.recId}-${e.agent}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: i * 0.02 }}
            className="flex gap-3 border-l-2 pl-4 py-1"
            style={{ borderColor: agents[e.agent].colorVar }}
          >
            <span
              className="text-[10px] tracking-[0.14em] uppercase font-medium w-16 shrink-0 pt-0.5"
              style={{ color: agents[e.agent].colorVar }}
            >
              {agents[e.agent].name}
            </span>
            <div>
              <p className="text-sm text-ink">{e.label}</p>
              <p className="text-xs text-ink-soft">{e.detail}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function AgentConsole() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {agentOrder.map((id) => (
          <AgentCard key={id} id={id} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 text-ink-soft">
        {agentOrder.map((id, i) => (
          <span key={id} className="flex items-center gap-3">
            <span
              className="text-xs tracking-[0.14em] uppercase font-medium"
              style={{ color: agents[id].colorVar }}
            >
              {agents[id].name}
            </span>
            {i < agentOrder.length - 1 && <ArrowRight size={14} />}
          </span>
        ))}
        <ArrowRight size={14} />
        <span className="flex items-center gap-1.5 text-xs tracking-[0.14em] uppercase font-medium text-ink">
          <ShieldCheck size={14} />
          Human Approval
        </span>
      </div>

      <div className="border border-hairline bg-paper p-5">
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-4">
          Agent Activity
        </p>
        <ActivityFeed />
      </div>

      <div className="border-2 border-accent-clay bg-paper-dim/40 p-5 text-center">
        <p className="text-xs tracking-[0.18em] uppercase font-medium text-accent-clay mb-1">
          Human Approval Required
        </p>
        <p className="text-sm text-ink-soft">
          Nothing in this loop executes a transfer, redirect, or staff move without an
          administrator's explicit decision. See{" "}
          <a href="/recommendations" className="underline hover:text-ink">
            Recommendations
          </a>{" "}
          to approve, modify, or reject.
        </p>
      </div>
    </div>
  );
}
