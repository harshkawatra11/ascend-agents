"use client";

import Link from "next/link";
import { agents, agentOrder, agentStatus } from "@/lib/agents";
import { useRecommendations } from "@/lib/store";

export function AgentStatusStrip() {
  const { recommendations, loading } = useRecommendations();
  const status = agentStatus(recommendations, loading);

  return (
    <Link
      href="/agents"
      className="flex flex-wrap gap-3 border border-hairline bg-paper-dim/40 px-5 py-4 hover:border-accent-clay/60 transition"
    >
      {agentOrder.map((id) => (
        <div key={id} className="flex-1 min-w-[180px] flex items-center gap-2.5">
          <span
            className="size-2 rounded-full shrink-0"
            style={{ background: agents[id].colorVar }}
          />
          <div>
            <p
              className="text-[10px] tracking-[0.14em] uppercase font-medium"
              style={{ color: agents[id].colorVar }}
            >
              {agents[id].name} · {status[id].status}
            </p>
            <p className="text-xs text-ink-soft">{status[id].detail}</p>
          </div>
        </div>
      ))}
    </Link>
  );
}
