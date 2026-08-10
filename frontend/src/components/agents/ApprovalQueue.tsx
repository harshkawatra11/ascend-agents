"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { TraceProposal } from "@/lib/agentTrace";
import { facilityById } from "@/data/district";
import { useRecommendations } from "@/lib/store";
import { useRole, roleCapabilities, roleLabels } from "@/lib/roleContext";

const typeLabel: Record<TraceProposal["type"], string> = {
  stock_transfer: "Stock Transfer",
  staff_transfer: "Staff Transfer",
  bed_redirect: "Bed Redirect",
  diagnostic_redirect: "Diagnostic Redirect",
};

function ProposalRow({ proposal }: { proposal: TraceProposal }) {
  const { resolve } = useRecommendations();
  const { role } = useRole();
  const canApprove = roleCapabilities[role].canApprove;
  const [editing, setEditing] = useState(false);
  const [qty, setQty] = useState(proposal.quantity_or_detail);

  const source = facilityById(proposal.source_facility_id);
  const target = facilityById(proposal.target_facility_id);
  const liveStatus = proposal.live_status;
  const canAct = canApprove && liveStatus === "pending" && proposal.live_id;

  const act = (status: "approved" | "rejected" | "modified", quantity?: string) => {
    if (!proposal.live_id) return;
    resolve(proposal.live_id, status, quantity, roleLabels[role]);
  };

  return (
    <div className="border border-hairline bg-paper px-4 py-3 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[220px]">
        <p className="text-[10px] tracking-[0.14em] uppercase text-ink-soft">
          {typeLabel[proposal.type]}
        </p>
        <p className="text-sm text-ink">
          {source?.name ?? proposal.source_facility_id} &rarr;{" "}
          {target?.name ?? proposal.target_facility_id}
          <span className="text-ink-soft"> &middot; {proposal.subject}</span>
        </p>
      </div>
      <span className="font-serif-display text-lg tabular text-accent-clay shrink-0">
        {proposal.confidence}%
      </span>

      {liveStatus !== "pending" ? (
        <span
          className="shrink-0 text-[10px] tracking-[0.14em] uppercase font-medium px-2 py-1 border"
          style={{
            borderColor:
              liveStatus === "approved" || liveStatus === "modified"
                ? "var(--color-risk-healthy)"
                : "var(--color-risk-critical)",
            color:
              liveStatus === "approved" || liveStatus === "modified"
                ? "var(--color-risk-healthy)"
                : "var(--color-risk-critical)",
          }}
        >
          {liveStatus}
        </span>
      ) : canAct ? (
        <div className="flex items-center gap-2 shrink-0">
          {editing && (
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border border-hairline bg-paper px-2 py-1 text-xs text-ink w-28"
            />
          )}
          <button
            onClick={() => act("approved")}
            className="px-3 py-1.5 text-xs font-medium bg-accent-clay text-paper hover:brightness-110 transition"
          >
            Approve
          </button>
          <button
            onClick={() => {
              if (editing) act("modified", qty);
              else setEditing(true);
            }}
            className="px-3 py-1.5 text-xs font-medium border border-accent-brass text-accent-brass hover:bg-accent-brass hover:text-paper transition"
          >
            {editing ? "Save" : "Modify"}
          </button>
          <button
            onClick={() => act("rejected")}
            className="px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-risk-critical transition"
          >
            Reject
          </button>
        </div>
      ) : (
        <span className="shrink-0 text-[10px] tracking-[0.14em] uppercase text-ink-soft">
          Pending administrator review
        </span>
      )}
    </div>
  );
}

export function ApprovalQueue({ proposals }: { proposals: TraceProposal[] }) {
  if (proposals.length === 0) return null;

  return (
    <div className="border-2 border-accent-clay bg-paper-dim/30 p-5">
      <p className="flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase font-medium text-accent-clay mb-3">
        <ShieldCheck size={14} />
        Human Approval Required: this cycle&rsquo;s proposals
      </p>
      <div className="space-y-2">
        {proposals.map((p) => (
          <ProposalRow key={p.id} proposal={p} />
        ))}
      </div>
    </div>
  );
}
