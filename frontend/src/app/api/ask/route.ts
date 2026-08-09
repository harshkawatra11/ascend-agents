import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  facilities,
  recommendations,
  alerts,
  footfallForecast,
  causalChain,
  districtKpis,
} from "@/data/district";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the "Ask SwasthyaGrid" assistant inside SwasthyaGrid AI,
a district health operations control room for PHCs and CHCs.

Rules:
- Only state facts grounded in the DISTRICT DATA provided below. Never fabricate
  numbers, facility names, or statistics beyond what's given.
- Whenever you cite a forecast or prediction, mention its confidence score.
- You are read-only: you explain data and reasoning, you never claim to have
  executed a transfer, approval, or any other action. Recommendations always
  require a human administrator's approval.
- Keep answers concise (2-4 sentences), in the voice of a calm, precise
  operations analyst.`;

const FALLBACK_MESSAGE =
  "Ask SwasthyaGrid is unavailable right now — no GEMINI_API_KEY is configured " +
  "for this deployment. The rest of the dashboard works independently of this feature.";

function buildDataContext() {
  return JSON.stringify({
    facilities: facilities.map((f) => ({
      id: f.id,
      name: f.name,
      type: f.type,
      riskLevel: f.riskLevel,
      performance: f.performance,
    })),
    recommendations,
    alerts,
    footfallForecast,
    causalChain,
    districtKpis,
  });
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

/**
 * The FastAPI backend's /ask uses HealthAgent, a Gemini tool-calling agent bound to
 * 7 grounded district tools, and returns tool_calls[] alongside the answer — the
 * live "Monitor called X → Reason called Y" trace the Agent Console renders. Try it
 * first. Only fall back to this route's own tool-less single-shot Gemini call (and,
 * below that, the static fallback message) when the backend is unreachable — this
 * keeps "Ask SwasthyaGrid" working with zero backend, per the app's existing
 * fallback-everywhere contract.
 */
async function askBackend(message: string) {
  const res = await fetch(`${API_BASE}/api/v1/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`backend /ask responded ${res.status}`);
  return (await res.json()) as { answer: string; tool_calls: string[]; confidence: number | null };
}

export async function POST(request: Request) {
  const { message } = (await request.json()) as { message?: string };

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const backendResult = await askBackend(message);
    return NextResponse.json(backendResult);
  } catch {
    // Backend unreachable — fall through to the direct Gemini call below.
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: FALLBACK_MESSAGE }, { status: 503 });
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const prompt = `DISTRICT DATA (JSON):\n${buildDataContext()}\n\nQuestion: ${message}`;
    const result = await genAI.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: { systemInstruction: SYSTEM_PROMPT },
    });
    const answer = result.text;

    return NextResponse.json({ answer, tool_calls: [], confidence: 90 });
  } catch (error) {
    console.error("Gemini ask route failed", error);
    return NextResponse.json({ answer: FALLBACK_MESSAGE, tool_calls: [], confidence: null });
  }
}
