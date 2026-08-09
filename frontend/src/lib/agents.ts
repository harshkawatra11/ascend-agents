import type { Recommendation } from "@/data/district";

export type AgentId = "monitor" | "reason" | "act";

export interface AgentDef {
  id: AgentId;
  name: string;
  tagline: string;
  owns: string[];
  colorVar: string;
}

export const agents: Record<AgentId, AgentDef> = {
  monitor: {
    id: "monitor",
    name: "Monitor",
    tagline: "Watches every facility for risk crossing a threshold",
    owns: ["Facilities", "Medicines", "Beds", "Doctors", "Diagnostics"],
    colorVar: "var(--color-risk-monitor)",
  },
  reason: {
    id: "reason",
    name: "Reason",
    tagline: "Searches the district for the best correction, and scores it",
    owns: ["Risk engine", "Forecasts", "Causes", "Constraints"],
    colorVar: "var(--color-accent-brass)",
  },
  act: {
    id: "act",
    name: "Act",
    tagline: "Proposes a typed, quantified action — never executes one",
    owns: ["Recommendations", "Transfers", "Redirects", "Escalations"],
    colorVar: "var(--color-accent-clay)",
  },
};

export const agentOrder: AgentId[] = ["monitor", "reason", "act"];

/**
 * `Recommendation.reasons[]` is assembled server-side as
 * detection → demand factors → logistics (see recommendation_service.py),
 * so it maps 1:1 onto Monitor / Reason / Act with no backend change.
 * Detection (index 0) → Monitor. Logistics (last line, mentions a facility
 * name + "away" or "surplus") → Act. Everything in between → Reason.
 */
export function groupReasonsByAgent(reasons: string[]): Record<AgentId, string[]> {
  if (reasons.length === 0) {
    return { monitor: [], reason: [], act: [] };
  }
  if (reasons.length === 1) {
    return { monitor: reasons, reason: [], act: [] };
  }

  const last = reasons[reasons.length - 1];
  const looksLikeLogistics = /surplus|away|capacity|slack/i.test(last);

  const monitorLine = [reasons[0]];
  const actLine = looksLikeLogistics ? [last] : [];
  const reasonLines = reasons.slice(1, actLine.length ? -1 : undefined);

  return { monitor: monitorLine, reason: reasonLines, act: actLine };
}

export interface AgentEvent {
  agent: AgentId;
  label: string;
  detail: string;
  recId?: string;
}

/** Derives a MONITOR / REASON / ACT activity feed from the live recommendation set. */
export function buildAgentActivity(recommendations: Recommendation[]): AgentEvent[] {
  const events: AgentEvent[] = [];

  for (const rec of recommendations) {
    const grouped = groupReasonsByAgent(rec.reasons);
    if (grouped.monitor.length) {
      events.push({
        agent: "monitor",
        label: `Risk detected — ${rec.subject}`,
        detail: grouped.monitor[0],
        recId: rec.id,
      });
    }
    if (grouped.reason.length) {
      events.push({
        agent: "reason",
        label: `Candidate scored at ${rec.confidence}% confidence`,
        detail: grouped.reason.join(" · "),
        recId: rec.id,
      });
    }
    if (grouped.act.length) {
      events.push({
        agent: "act",
        label: `Proposed: ${rec.subject} · ${rec.quantityOrDetail}`,
        detail: grouped.act[0],
        recId: rec.id,
      });
    }
  }

  return events;
}

export function agentStatus(recommendations: Recommendation[], loading: boolean) {
  const pending = recommendations.filter((r) => r.status === "pending").length;
  const resolved = recommendations.filter((r) => r.status !== "pending").length;

  return {
    monitor: {
      status: loading ? "starting" : "running",
      detail: `${recommendations.length} risk signals tracked`,
    },
    reason: {
      status: loading ? "starting" : "idle",
      detail: `${recommendations.length} candidates scored`,
    },
    act: {
      status: loading ? "starting" : pending > 0 ? "awaiting approval" : "idle",
      detail: `${pending} pending · ${resolved} resolved`,
    },
  } as const;
}
