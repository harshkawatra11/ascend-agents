"""Instrumentation for the recommendation engine's real decision trace.

The recommendation engine already performs a large amount of real work per
run: it scans every facility, evaluates every medicine forecast, examines
every candidate surplus facility, rejects most of them, and scores the
survivors. Only the final recommendation dict is normally kept; everything
else is discarded.

TraceCollector is an optional parameter threaded through the generation
methods in recommendation_service.py. When absent (the normal construction
path), nothing changes: no collector, no overhead, no behavior difference.
When present, it captures each real decision point as it happens, so the
trace is a byproduct of the actual computation rather than a second,
possibly-drifting description of it.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from itertools import count

_step_counter = count(1)


@dataclass
class TraceStep:
    seq: int
    agent: str  # "monitor" | "reason" | "act"
    # "scan" | "detect" | "skip" | "candidate" | "reject" | "rank" | "score"
    # | "propose" | "summary"
    kind: str
    message: str
    elapsed_us: int
    detail: dict | None = None
    facility_id: str | None = None
    facility_name: str | None = None
    subject: str | None = None

    def to_dict(self) -> dict:
        return {
            "seq": self.seq,
            "agent": self.agent,
            "kind": self.kind,
            "message": self.message,
            "elapsed_us": self.elapsed_us,
            "detail": self.detail,
            "facility_id": self.facility_id,
            "facility_name": self.facility_name,
            "subject": self.subject,
        }


@dataclass
class TraceCollector:
    """Records real decision points during one pass of the recommendation
    engine, with the true elapsed time between each one."""

    steps: list[TraceStep] = field(default_factory=list)
    _last_ts: int = field(default_factory=time.perf_counter_ns)

    def step(
        self,
        agent: str,
        kind: str,
        message: str,
        detail: dict | None = None,
        facility_id: str | None = None,
        facility_name: str | None = None,
        subject: str | None = None,
    ) -> None:
        now = time.perf_counter_ns()
        elapsed_us = max(0, (now - self._last_ts) // 1000)
        self._last_ts = now
        self.steps.append(
            TraceStep(
                seq=next(_step_counter),
                agent=agent,
                kind=kind,
                message=message,
                elapsed_us=elapsed_us,
                detail=detail,
                facility_id=facility_id,
                facility_name=facility_name,
                subject=subject,
            )
        )

    def to_list(self) -> list[dict]:
        return [s.to_dict() for s in self.steps]

    @property
    def total_duration_us(self) -> int:
        return sum(s.elapsed_us for s in self.steps)
