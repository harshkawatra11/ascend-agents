"use client";

import { createContext, useContext, useState } from "react";

export type Role = "district_admin" | "phc_staff" | "state_officer";

export const roleLabels: Record<Role, string> = {
  district_admin: "District Administrator",
  phc_staff: "PHC Staff",
  state_officer: "State Health Officer",
};

export const roleCapabilities: Record<
  Role,
  { canApprove: boolean; canEditInventory: boolean; scope: string }
> = {
  district_admin: {
    canApprove: true,
    canEditInventory: false,
    scope: "Full district oversight — approve, reject, modify all recommendations.",
  },
  phc_staff: {
    canApprove: false,
    canEditInventory: true,
    scope: "Facility-level updates — inventory, OPD, beds, attendance. Recommendations are read-only.",
  },
  state_officer: {
    canApprove: false,
    canEditInventory: false,
    scope: "District-wide analytics and performance oversight — read-only.",
  },
};

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("district_admin");
  return (
    <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
