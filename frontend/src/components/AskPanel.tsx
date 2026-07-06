"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AskResponse {
  answer: string;
  confidence?: number;
}

export function AskPanel() {
  const [open, setOpen] = useState(false);
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
      const res = await fetch("/api/ask", {
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
      setError(err.message || "Ask SwasthyaGrid couldn't process that — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mb-3 w-[340px] border border-hairline bg-paper shadow-[0_4px_24px_rgba(35,31,26,0.12)] p-4"
          >
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-2">
              Ask SwasthyaGrid
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Which PHCs are at risk of a stock-out this week?"
              rows={3}
              className="w-full border border-hairline bg-paper-dim/40 px-3 py-2 text-sm text-ink resize-none focus:outline-none focus:border-accent-clay"
            />
            <button
              onClick={ask}
              disabled={loading}
              className="mt-2 w-full bg-accent-clay text-paper text-sm font-medium py-2 disabled:opacity-60"
            >
              {loading ? "Thinking…" : "Ask"}
            </button>

            {response && (
              <div className="mt-3 border-t border-hairline pt-3 text-sm text-ink">
                <p>{response.answer}</p>
                {typeof response.confidence === "number" && (
                  <p className="text-xs text-ink-soft mt-1">
                    Confidence: {response.confidence}%
                  </p>
                )}
              </div>
            )}
            {error && (
              <p className="mt-3 text-xs text-risk-critical border-t border-hairline pt-3">
                {error}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="border border-hairline bg-ink text-paper px-5 py-3 text-sm font-medium shadow-[0_4px_16px_rgba(35,31,26,0.18)] hover:brightness-110 transition"
      >
        {open ? "Close" : "Ask SwasthyaGrid"}
      </button>
    </div>
  );
}
