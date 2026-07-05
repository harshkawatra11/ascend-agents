"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { SkeletonBlock } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDiagnostics } from "@/lib/api";
import { facilityById } from "@/data/district";
import { FlaskConical } from "lucide-react";

interface DiagnosticRow {
  facility_id: string;
  test_name: string;
  status: string;
  nearest_alternative_facility_id: string | null;
  distance_km: number | null;
}

const statusColor: Record<string, string> = {
  available: "text-risk-healthy",
  unavailable: "text-risk-critical",
  machine_failure: "text-risk-critical",
};

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticRow[] | null>(null);

  useEffect(() => {
    getDiagnostics().then((data) =>
      setDiagnostics((data.diagnostics as unknown as DiagnosticRow[]) ?? [])
    );
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Diagnostic Availability" title="Diagnostics" />

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Test &amp; Equipment Status
        </p>
        {diagnostics === null ? (
          <SkeletonBlock rows={3} />
        ) : diagnostics.length === 0 ? (
          <EmptyState
            icon={FlaskConical}
            title="No diagnostic data"
            detail="Start the FastAPI backend to see live diagnostic availability here."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {diagnostics.map((d, i) => (
              <div key={i} className="border border-hairline bg-paper-dim/40 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-ink">{d.test_name}</p>
                  <span
                    className={`text-xs uppercase font-medium ${statusColor[d.status] ?? "text-ink-soft"}`}
                  >
                    {d.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">
                  {facilityById(d.facility_id)?.name ?? d.facility_id}
                </p>
                {d.nearest_alternative_facility_id && (
                  <p className="text-xs text-accent-clay mt-2">
                    Redirect to {facilityById(d.nearest_alternative_facility_id)?.name}
                    {d.distance_km ? ` · ${d.distance_km} km away` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          Diagnostic Redirect Recommendations
        </p>
        <RecommendationsPanel filterType="diagnostic_redirect" />
      </section>
    </div>
  );
}
