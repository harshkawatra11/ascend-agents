"use client";

import { useState } from "react";
import { HeartPulse } from "lucide-react";

interface AskResponse {
  answer: string;
  confidence?: number;
}

export function PublicAskPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/public-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Ask route responded ${res.status}`);
      }
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Citizen Services couldn't process that — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col h-[500px]">
      <div className="p-6 border-b border-hairline bg-paper flex items-center gap-3">
        <HeartPulse className="text-clay" size={20} />
        <h2 className="font-serif-display text-xl text-ink">Ask SwasthyaGrid</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto bg-paper-dim/20">
        {response ? (
          <div className="bg-paper p-5 border border-hairline shadow-sm rounded-md text-ink">
            <p className="whitespace-pre-wrap leading-relaxed">{response.answer}</p>
            {typeof response.confidence === "number" && (
              <p className="text-xs text-ink-soft mt-3 pt-3 border-t border-hairline">
                Confidence: {response.confidence}%
              </p>
            )}
          </div>
        ) : error ? (
          <div className="bg-[#9E3A2E]/10 p-5 border border-[#9E3A2E]/30 text-[#9E3A2E] rounded-md">
            {error}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-ink-soft text-center px-8">
            Type your medical emergency, ask for first-aid guidance, or find the nearest hospital using your coordinates.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-hairline bg-paper">
        <div className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Find the nearest PHC to 12.93, 77.62 or What should I do for a snake bite?"
            rows={2}
            className="flex-1 border border-hairline bg-paper-dim/40 px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-accent-clay rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask();
              }
            }}
          />
          <button
            onClick={ask}
            disabled={loading || !message.trim()}
            className="bg-accent-clay text-paper px-8 font-medium rounded-md disabled:opacity-60 hover:brightness-110 transition"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
