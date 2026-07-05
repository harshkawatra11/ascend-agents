"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-ink/25"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-hairline bg-paper shadow-[-8px_0_32px_rgba(35,31,26,0.15)] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-hairline px-6 py-5">
              <div>
                {eyebrow && (
                  <p className="text-[11px] tracking-[0.16em] uppercase text-ink-soft mb-1">
                    {eyebrow}
                  </p>
                )}
                <h2 className="font-serif-display text-2xl text-ink">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-ink-soft hover:text-ink transition p-1 -mr-1 -mt-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
