"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useRole, roleLabels, type Role } from "@/lib/roleContext";

const roles: Role[] = ["district_admin", "phc_staff", "state_officer"];

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-hairline bg-paper px-3 py-1.5 text-sm text-ink hover:border-accent-clay transition"
      >
        <span className="text-[10px] tracking-[0.12em] uppercase text-ink-soft">
          Viewing as
        </span>
        <span className="font-medium">{roleLabels[role]}</span>
        <ChevronDown size={14} className="text-ink-soft" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-56 border border-hairline bg-paper shadow-[0_4px_16px_rgba(35,31,26,0.12)] z-40">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-paper-dim/60 transition ${
                r === role ? "text-accent-clay font-medium" : "text-ink"
              }`}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
