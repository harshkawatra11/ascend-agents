"use client";

import { Search } from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";

export function Topbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-hairline bg-paper/95 backdrop-blur px-6 py-3">
      <div>
        <p className="text-xs text-ink-soft">{today}</p>
        <p className="text-sm font-medium text-ink">Jaipur Rural District</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPalette}
          className="flex items-center gap-2 border border-hairline bg-paper-dim/40 px-3 py-1.5 text-sm text-ink-soft hover:border-accent-clay hover:text-ink transition"
        >
          <Search size={14} />
          <span>Search facilities, pages…</span>
          <kbd className="ml-4 text-[10px] border border-hairline px-1.5 py-0.5 rounded text-ink-soft">
            ⌘K
          </kbd>
        </button>
        <RoleSwitcher />
      </div>
    </header>
  );
}
