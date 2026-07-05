"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recommendations as seedRecs, facilityById, type Recommendation } from "@/data/district";

const typeLabel: Record<Recommendation["type"], string> = {
  stock_transfer: "Stock Transfer",
  staff_transfer: "Staff Transfer",
  bed_redirect: "Bed Redirect",
  diagnostic_redirect: "Diagnostic Redirect",
};

function ConfidenceRing({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-end shrink-0">
      <span className="font-serif-display text-2xl tabular text-accent-clay">
        {value}%
      </span>
      <span className="text-[10px] tracking-[0.14em] uppercase text-ink-soft">
        Confidence
      </span>
    </div>
  );
}

function RecommendationCard({
  rec,
  onResolve,
}: {
  rec: Recommendation;
  onResolve: (id: string, status: Recommendation["status"]) => void;
}) {
  const source = facilityById(rec.sourceFacilityId);
  const target = facilityById(rec.targetFacilityId);
  const [qty, setQty] = useState(rec.quantityOrDetail);
  const [editing, setEditing] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border border-hairline bg-paper-dim/50 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-1">
            {typeLabel[rec.type]}
          </p>
          <h3 className="font-serif-display text-lg text-ink">
            {source?.name ?? rec.sourceFacilityId} → {target?.name ?? rec.targetFacilityId}
          </h3>
          <p className="text-sm text-ink-soft mt-1">
            {rec.subject} · <span className="text-ink">{qty}</span>
          </p>
        </div>
        <ConfidenceRing value={rec.confidence} />
      </div>

      <ul className="mt-4 space-y-1.5">
        {rec.reasons.map((r, i) => (
          <li key={i} className="text-sm text-ink-soft flex gap-2">
            <span className="text-accent-brass">—</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>

      {rec.status === "pending" ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {editing && (
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border border-hairline bg-paper px-2 py-1.5 text-sm text-ink w-40 mr-auto"
            />
          )}
          <button
            onClick={() => onResolve(rec.id, "approved")}
            className="px-4 py-1.5 text-sm font-medium bg-accent-clay text-paper hover:brightness-110 transition"
          >
            Approve
          </button>
          <button
            onClick={() => {
              if (editing) onResolve(rec.id, "modified");
              else setEditing(true);
            }}
            className="px-4 py-1.5 text-sm font-medium border border-accent-brass text-accent-brass hover:bg-accent-brass hover:text-paper transition"
          >
            {editing ? "Save & Approve" : "Modify"}
          </button>
          <button
            onClick={() => onResolve(rec.id, "rejected")}
            className="px-4 py-1.5 text-sm font-medium text-ink-soft hover:text-risk-critical transition"
          >
            Reject
          </button>
        </div>
      ) : (
        <p
          className="mt-5 text-xs tracking-[0.14em] uppercase font-medium"
          style={{
            color:
              rec.status === "approved" || rec.status === "modified"
                ? "var(--color-risk-healthy)"
                : "var(--color-risk-critical)",
          }}
        >
          {rec.status}
        </p>
      )}
    </motion.div>
  );
}

export function RecommendationsPanel() {
  const [recs, setRecs] = useState<Recommendation[]>(seedRecs);

  function resolve(id: string, status: Recommendation["status"]) {
    setRecs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AnimatePresence initial={false}>
        {recs.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} onResolve={resolve} />
        ))}
      </AnimatePresence>
    </div>
  );
}
