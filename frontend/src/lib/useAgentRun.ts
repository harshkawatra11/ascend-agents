"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAgentTrace, type AgentTraceResponse, type TraceStep } from "@/lib/agentTrace";

const TARGET_REPLAY_MS = 9000;
const MIN_STEP_MS = 60;
const MAX_STEP_MS = 260;
const DEFAULT_INTERVAL_S = 30;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export type RunStatus = "idle" | "fetching" | "replaying" | "done" | "error";

export interface AgentRunState {
  trace: AgentTraceResponse | null;
  visibleSteps: TraceStep[];
  status: RunStatus;
  runCount: number;
  nextRunInSeconds: number;
  isPaused: boolean;
  isSample: boolean;
  runNow: () => void;
  togglePause: () => void;
}

/**
 * Fetches the real instrumented trace from GET /api/v1/agents/trace (or falls
 * back to a real captured sample if the backend is unreachable) and reveals
 * its steps on a readable timer instead of dumping them all at once: the
 * pipeline itself completes in about 1ms, so a truly real-time reveal would
 * be imperceptible. The elapsed_us shown per step is the real measured value
 * from the backend; only the on-screen reveal is paced.
 *
 * Guards the async fetch behind a `runGeneration` counter, incremented every
 * time startRun() begins, so that React 19's dev-mode StrictMode
 * double-invoked effect (mount, cleanup, mount) can never let a stale fetch
 * from a superseded run clobber state after a newer run has already started.
 * The recurring countdown/reveal timers don't need the same guard: clearing
 * them in the effect's cleanup is what actually stops them on unmount.
 */
export function useAgentRun(intervalSeconds: number = DEFAULT_INTERVAL_S): AgentRunState {
  const [trace, setTrace] = useState<AgentTraceResponse | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [runCount, setRunCount] = useState(0);
  const [nextRunInSeconds, setNextRunInSeconds] = useState(intervalSeconds);
  const [isPaused, setIsPaused] = useState(false);

  const runGeneration = useRef(0);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const clearTimers = useCallback(() => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    revealTimer.current = null;
    countdownTimer.current = null;
  }, []);

  const startRun = useCallback(async () => {
    const myGeneration = ++runGeneration.current;
    if (revealTimer.current) clearTimeout(revealTimer.current);
    revealTimer.current = null;

    setStatus("fetching");
    setVisibleCount(0);

    const result = await getAgentTrace();
    if (myGeneration !== runGeneration.current) return; // a newer run superseded this one

    setTrace(result);
    setRunCount((c) => c + 1);

    const stepCount = result.steps.length;
    if (stepCount === 0) {
      setStatus("done");
      return;
    }

    if (prefersReducedMotion()) {
      setVisibleCount(stepCount);
      setStatus("done");
      return;
    }

    setStatus("replaying");
    const perStepMs = Math.min(
      MAX_STEP_MS,
      Math.max(MIN_STEP_MS, TARGET_REPLAY_MS / stepCount)
    );

    let revealed = 0;
    const revealNext = () => {
      if (myGeneration !== runGeneration.current) return;
      revealed += 1;
      setVisibleCount(revealed);
      if (revealed >= stepCount) {
        setStatus("done");
        return;
      }
      revealTimer.current = setTimeout(revealNext, perStepMs);
    };
    revealTimer.current = setTimeout(revealNext, perStepMs);
  }, []);

  const scheduleNextRun = useCallback(() => {
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    setNextRunInSeconds(intervalSeconds);
    countdownTimer.current = setInterval(() => {
      if (isPausedRef.current) return;
      setNextRunInSeconds((s) => {
        if (s <= 1) {
          startRun();
          return intervalSeconds;
        }
        return s - 1;
      });
    }, 1000);
  }, [intervalSeconds, startRun]);

  useEffect(() => {
    startRun();
    scheduleNextRun();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runNow = useCallback(() => {
    setNextRunInSeconds(intervalSeconds);
    startRun();
  }, [intervalSeconds, startRun]);

  const togglePause = useCallback(() => setIsPaused((p) => !p), []);

  const visibleSteps = trace ? trace.steps.slice(0, visibleCount) : [];

  return {
    trace,
    visibleSteps,
    status,
    runCount,
    nextRunInSeconds,
    isPaused,
    isSample: trace?.isSample ?? false,
    runNow,
    togglePause,
  };
}
