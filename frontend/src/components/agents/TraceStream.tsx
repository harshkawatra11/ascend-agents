"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TraceStep } from "@/lib/agentTrace";
import { agents } from "@/lib/agents";

const kindLabel: Record<TraceStep["kind"], string> = {
  scan: "SCAN",
  detect: "DETECT",
  skip: "skip",
  candidate: "CANDIDATE",
  reject: "reject",
  rank: "RANK",
  score: "SCORE",
  propose: "PROPOSE",
  summary: "DONE",
};

const mutedKinds = new Set<TraceStep["kind"]>(["skip", "reject"]);
const emphasisKinds = new Set<TraceStep["kind"]>(["detect", "propose", "summary"]);

function formatUs(us: number): string {
  if (us >= 1000) return `${(us / 1000).toFixed(2)}ms`;
  return `${us}µs`;
}

function StepLine({ step }: { step: TraceStep }) {
  const agentDef = agents[step.agent];
  const muted = mutedKinds.has(step.kind);
  const emphasis = emphasisKinds.has(step.kind);

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.14 }}
      className="flex items-baseline gap-3 py-0.5 text-[13px] leading-relaxed"
    >
      <span
        className="w-8 shrink-0 text-right tabular"
        style={{ color: "var(--color-console-text-soft)" }}
      >
        {String(step.seq).padStart(2, "0")}
      </span>
      <span
        className="w-16 shrink-0 uppercase font-medium tracking-wide"
        style={{ color: agentDef.colorVar }}
      >
        {agentDef.name}
      </span>
      <span
        className="w-20 shrink-0 uppercase tracking-wide"
        style={{ color: muted ? "var(--color-console-text-soft)" : agentDef.colorVar }}
      >
        {kindLabel[step.kind]}
      </span>
      <span
        className="flex-1 min-w-0 truncate"
        style={{
          color: muted
            ? "var(--color-console-text-soft)"
            : "var(--color-console-text)",
          fontWeight: emphasis ? 600 : 400,
        }}
        title={step.message}
      >
        {step.message}
      </span>
      <span
        className="w-16 shrink-0 text-right tabular"
        style={{ color: "var(--color-console-text-soft)" }}
      >
        {formatUs(step.elapsed_us)}
      </span>
    </motion.div>
  );
}

export function TraceStream({ steps }: { steps: TraceStep[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [steps.length]);

  return (
    <div
      className="font-mono-trace rounded-none border overflow-hidden"
      style={{ borderColor: "var(--color-console-line)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.14em]"
        style={{
          background: "var(--color-console-bg-dim)",
          color: "var(--color-console-text-soft)",
          borderBottom: "1px solid var(--color-console-line)",
        }}
      >
        <span className="size-2 rounded-full bg-risk-critical" />
        <span className="size-2 rounded-full bg-risk-monitor" />
        <span className="size-2 rounded-full bg-risk-healthy" />
        <span className="ml-2">recommendation_service.py: run_traced_cycle()</span>
      </div>
      <div
        className="h-[340px] overflow-y-auto px-4 py-3"
        style={{ background: "var(--color-console-bg)" }}
      >
        <AnimatePresence initial={false}>
          {steps.map((s) => (
            <StepLine key={s.seq} step={s} />
          ))}
        </AnimatePresence>
        {steps.length === 0 && (
          <p
            className="text-[13px] py-1"
            style={{ color: "var(--color-console-text-soft)" }}
          >
            waiting for the next cycle&hellip;
          </p>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
