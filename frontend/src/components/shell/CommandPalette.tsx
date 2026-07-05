"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "./nav-items";
import { facilities } from "@/data/district";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pages = navItems
      .filter((n) => n.label.toLowerCase().includes(q))
      .map((n) => ({ kind: "page" as const, label: n.label, href: n.href }));
    const facilityResults = facilities
      .filter((f) => f.name.toLowerCase().includes(q))
      .map((f) => ({ kind: "facility" as const, label: f.name, href: `/facilities?focus=${f.id}` }));
    return [...pages, ...facilityResults].slice(0, 8);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function go(href: string) {
    router.push(href);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-ink/30 flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg border border-hairline bg-paper shadow-[0_12px_48px_rgba(35,31,26,0.25)]"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Jump to a page or facility…"
              className="w-full border-b border-hairline bg-transparent px-4 py-3 text-sm text-ink focus:outline-none"
            />
            <div className="max-h-72 overflow-y-auto py-1">
              {results.length === 0 && (
                <p className="px-4 py-3 text-sm text-ink-soft">No matches.</p>
              )}
              {results.map((r, i) => (
                <button
                  key={r.href + r.label}
                  onClick={() => go(r.href)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                    i === activeIndex ? "bg-paper-dim/70 text-ink" : "text-ink-soft"
                  }`}
                >
                  <span>{r.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-ink-soft/70">
                    {r.kind}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
