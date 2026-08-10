import { API_BASE } from "@/lib/api";
import { sampleTrace } from "@/data/sample-trace";

export type TraceAgent = "monitor" | "reason" | "act";
export type TraceKind =
  | "scan"
  | "detect"
  | "skip"
  | "candidate"
  | "reject"
  | "rank"
  | "score"
  | "propose"
  | "summary";

export interface TraceStep {
  seq: number;
  agent: TraceAgent;
  kind: TraceKind;
  message: string;
  elapsed_us: number;
  detail?: Record<string, unknown> | null;
  facility_id?: string | null;
  facility_name?: string | null;
  subject?: string | null;
}

export interface TraceProposal {
  id: string;
  type: "stock_transfer" | "staff_transfer" | "bed_redirect" | "diagnostic_redirect";
  source_facility_id: string;
  target_facility_id: string;
  subject: string;
  quantity_or_detail: string;
  confidence: number;
  reasons: string[];
  status: "pending" | "approved" | "rejected" | "modified";
  live_id: string | null;
  live_status: "pending" | "approved" | "rejected" | "modified";
}

export interface TraceSummary {
  facilities_scanned: number;
  risks_detected: number;
  candidates_examined: number;
  candidates_rejected: number;
  proposals_emitted: number;
  total_duration_us: number;
}

export interface AgentTraceResponse {
  steps: TraceStep[];
  proposals: TraceProposal[];
  summary: TraceSummary;
  generated_at: string;
  data_source: "firestore" | "seed";
  data_version: number;
  /** Not sent by the backend, set locally when this came from the bundled sample instead of a live fetch. */
  isSample?: boolean;
}

export async function getAgentTrace(): Promise<AgentTraceResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/agents/trace`, {
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`agents/trace responded ${res.status}`);
    const data = (await res.json()) as AgentTraceResponse;
    return { ...data, isSample: false };
  } catch {
    return { ...sampleTrace, generated_at: new Date().toISOString(), isSample: true };
  }
}
