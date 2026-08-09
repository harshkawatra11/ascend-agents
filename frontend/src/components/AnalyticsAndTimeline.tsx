"use client";

import { useRecommendations } from "@/lib/store";
import { agents, buildAgentActivity } from "@/lib/agents";

interface CausalChain {
  headline: string;
  chain: string[];
}

export function AnalyticsAndTimeline({ causalChain }: { causalChain: CausalChain }) {
  const { recommendations, loading } = useRecommendations();
  const activity = buildAgentActivity(recommendations).slice(0, 4);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="border border-hairline bg-paper-dim/40 p-5">
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          {causalChain.headline}
        </p>
        {causalChain.chain.length === 0 ? (
          <p className="text-sm text-ink-soft">No significant causal signal detected.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {causalChain.chain.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-sm border border-hairline bg-paper text-ink">
                  {step}
                </span>
                {i < causalChain.chain.length - 1 && (
                  <span className="text-accent-brass">→</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-hairline bg-paper-dim/40 p-5">
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Agent Activity
        </p>
        {loading ? (
          <p className="text-sm text-ink-soft">Loading…</p>
        ) : activity.length === 0 ? (
          <p className="text-sm text-ink-soft">No agent activity yet.</p>
        ) : (
          <div className="space-y-3">
            {activity.map((e, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span
                  className="w-16 shrink-0 text-[10px] tracking-[0.1em] uppercase font-medium pt-0.5"
                  style={{ color: agents[e.agent].colorVar }}
                >
                  {agents[e.agent].name}
                </span>
                <span className="text-ink">{e.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
