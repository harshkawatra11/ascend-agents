"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { facilityById } from "@/data/district";
import { useRecommendations } from "@/lib/store";
import { getAuditLog, type AuditLogEntry } from "@/lib/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonBlock } from "@/components/ui/Skeleton";

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ResourceTransfers() {
  const { recommendations, loading } = useRecommendations();
  const [auditByRec, setAuditByRec] = useState<Record<string, AuditLogEntry>>({});
  const approved = recommendations.filter(
    (r) => r.status === "approved" || r.status === "modified"
  );

  useEffect(() => {
    getAuditLog().then((entries) => {
      const latest: Record<string, AuditLogEntry> = {};
      for (const e of entries) {
        if (!latest[e.rec_id]) latest[e.rec_id] = e;
      }
      setAuditByRec(latest);
    });
  }, [recommendations]);

  if (loading) return <SkeletonBlock rows={3} />;

  if (approved.length === 0) {
    return (
      <EmptyState
        icon={ArrowRightLeft}
        title="No transfers approved yet"
        detail="Resolve a recommendation to see it appear here as a district action."
      />
    );
  }

  return (
    <div className="space-y-2">
      {approved.map((r) => {
        const audit = auditByRec[r.id];
        return (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-2 border border-hairline bg-paper-dim/40 px-4 py-3 text-sm"
          >
            <span className="text-ink">
              {facilityById(r.sourceFacilityId)?.name} →{" "}
              {facilityById(r.targetFacilityId)?.name}
            </span>
            <span className="text-ink-soft">{r.subject}</span>
            <span className="text-ink font-medium">{r.quantityOrDetail}</span>
            <span className="text-[11px] uppercase tracking-wider text-risk-healthy">
              {r.status}
            </span>
            {audit && (
              <span className="text-xs text-ink-soft w-full">
                {audit.resolved_by} · {formatWhen(audit.resolved_at)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
