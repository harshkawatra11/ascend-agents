"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getFacilities, getRecommendations, resolveRecommendation } from "@/lib/api";
import { downgradeRisk, type Facility, type Recommendation } from "@/data/district";

interface RecommendationsContextValue {
  recommendations: Recommendation[];
  loading: boolean;
  resolve: (
    id: string,
    status: "approved" | "rejected" | "modified",
    quantityOverride?: string
  ) => Promise<void>;
  toast: string | null;
}

const RecommendationsContext = createContext<RecommendationsContextValue | null>(null);

const actionForStatus = {
  approved: "approve",
  rejected: "reject",
  modified: "modify",
} as const;

export function RecommendationsProvider({ children }: { children: React.ReactNode }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getRecommendations()
      .then(setRecommendations)
      .finally(() => setLoading(false));
  }, []);

  const resolve = useCallback(
    async (
      id: string,
      status: "approved" | "rejected" | "modified",
      quantityOverride?: string
    ) => {
      setRecommendations((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status, quantityOrDetail: quantityOverride ?? r.quantityOrDetail }
            : r
        )
      );
      const rec = recommendations.find((r) => r.id === id);
      setToast(
        status === "approved"
          ? `Approved: ${rec?.subject ?? "recommendation"} transfer`
          : status === "rejected"
            ? `Rejected: ${rec?.subject ?? "recommendation"}`
            : `Modified & approved: ${rec?.subject ?? "recommendation"}`
      );
      await resolveRecommendation(id, actionForStatus[status], quantityOverride);
    },
    [recommendations]
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <RecommendationsContext.Provider value={{ recommendations, loading, resolve, toast }}>
      {children}
    </RecommendationsContext.Provider>
  );
}

export function useRecommendations() {
  const ctx = useContext(RecommendationsContext);
  if (!ctx) {
    throw new Error("useRecommendations must be used within RecommendationsProvider");
  }
  return ctx;
}

/** Facilities with risk level live-downgraded by any approved/modified recommendation targeting them. */
export function useLiveFacilities() {
  const { recommendations } = useRecommendations();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacilities()
      .then(setFacilities)
      .finally(() => setLoading(false));
  }, []);

  // Which side of the recommendation is the at-risk facility depends on its type:
  // bed_redirect names the overloaded facility as the source (it offloads to target);
  // every other type names the at-risk facility as the target (it receives help).
  const resolved = recommendations.filter(
    (r) => r.status === "approved" || r.status === "modified"
  );
  const resolvedTargets = new Set(
    resolved.map((r) => (r.type === "bed_redirect" ? r.sourceFacilityId : r.targetFacilityId))
  );

  const live = facilities.map((f) =>
    resolvedTargets.has(f.id) ? { ...f, riskLevel: downgradeRisk(f.riskLevel) } : f
  );

  return { facilities: live, loading };
}
