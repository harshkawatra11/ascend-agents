"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-2.5 border border-hairline bg-ink text-paper px-4 py-3 text-sm shadow-[0_8px_24px_rgba(35,31,26,0.25)]"
          >
            <CheckCircle2 size={16} className="text-risk-healthy shrink-0" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
