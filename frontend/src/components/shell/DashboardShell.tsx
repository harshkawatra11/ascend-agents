"use client";

import { useEffect, useState } from "react";
import { RoleProvider } from "@/lib/roleContext";
import { RecommendationsProvider, useRecommendations } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { PageTransition } from "./PageTransition";
import { Toast } from "@/components/ui/Toast";
import { AskPanel } from "@/components/AskPanel";

function ToastBridge() {
  const { toast } = useRecommendations();
  return <Toast message={toast} />;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <RoleProvider>
      <RecommendationsProvider>
        <div className="flex min-h-screen bg-paper">
          <Sidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <Topbar onOpenPalette={() => setPaletteOpen(true)} />
            <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl w-full mx-auto">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <ToastBridge />
        <AskPanel />
      </RecommendationsProvider>
    </RoleProvider>
  );
}
