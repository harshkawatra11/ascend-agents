import {
  LayoutGrid,
  Pill,
  Users,
  BedDouble,
  Stethoscope,
  FlaskConical,
  ListChecks,
  Map,
  Building2,
  LineChart,
  HeartPulse,
} from "lucide-react";

export const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutGrid, group: "Command" },
  { href: "/recommendations", label: "Recommendations", icon: ListChecks, group: "Command" },
  { href: "/inventory", label: "Inventory", icon: Pill, group: "Operations" },
  { href: "/footfall", label: "Footfall", icon: Users, group: "Operations" },
  { href: "/beds", label: "Beds", icon: BedDouble, group: "Operations" },
  { href: "/doctors", label: "Doctors", icon: Stethoscope, group: "Operations" },
  { href: "/diagnostics", label: "Diagnostics", icon: FlaskConical, group: "Operations" },
  { href: "/map", label: "District Map", icon: Map, group: "District" },
  { href: "/facilities", label: "Facilities", icon: Building2, group: "District" },
  { href: "/analytics", label: "Analytics", icon: LineChart, group: "District" },
  { href: "/citizen", label: "Citizen Services", icon: HeartPulse, group: "Public" },
] as const;

export type NavItem = (typeof navItems)[number];
