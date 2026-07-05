"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { riskColor, riskLabel, type RiskLevel } from "@/data/district";

const order: RiskLevel[] = ["critical", "stress", "monitor", "healthy"];

export function RiskDonut({ counts }: { counts: Record<RiskLevel, number> }) {
  const data = order
    .map((level) => ({ level, value: counts[level] ?? 0 }))
    .filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="border border-hairline bg-paper-dim/40 p-5 flex items-center gap-6">
      <div className="relative w-[140px] h-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="level"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.level} fill={riskColor[d.level]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#F4EEE4", border: "1px solid #D8CBB4", fontSize: 12 }}
              formatter={(value, name) => [value, riskLabel[name as RiskLevel]]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-serif-display text-2xl tabular text-ink">{total}</span>
          <span className="text-[9px] uppercase tracking-wider text-ink-soft">Facilities</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {order.map((level) => (
          <div key={level} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: riskColor[level] }}
            />
            <span className="text-ink-soft">{riskLabel[level]}</span>
            <span className="text-ink tabular font-medium ml-auto pl-4">
              {counts[level] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
