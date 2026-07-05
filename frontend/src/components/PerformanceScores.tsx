import { facilities } from "@/data/district";

const subScores: { key: keyof typeof facilities[number]["performance"]; label: string }[] = [
  { key: "inventory", label: "Inventory" },
  { key: "attendance", label: "Attendance" },
  { key: "diagnostics", label: "Diagnostics" },
  { key: "patientWait", label: "Patient Wait" },
  { key: "forecastAccuracy", label: "Forecast Accuracy" },
];

export function PerformanceScores() {
  return (
    <div className="overflow-x-auto border border-hairline">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hairline bg-paper-dim/60">
            <th className="text-left font-medium text-ink-soft px-4 py-3 text-xs uppercase tracking-wider">
              Facility
            </th>
            <th className="text-right font-medium text-ink-soft px-4 py-3 text-xs uppercase tracking-wider">
              Overall
            </th>
            {subScores.map((s) => (
              <th
                key={s.key}
                className="text-right font-medium text-ink-soft px-4 py-3 text-xs uppercase tracking-wider"
              >
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {facilities
            .slice()
            .sort((a, b) => a.performance.overall - b.performance.overall)
            .map((f) => (
              <tr key={f.id} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3 text-ink font-medium">{f.name}</td>
                <td className="px-4 py-3 text-right tabular font-serif-display text-accent-clay">
                  {f.performance.overall}
                </td>
                {subScores.map((s) => (
                  <td key={s.key} className="px-4 py-3 text-right tabular text-ink-soft">
                    {f.performance[s.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
