interface CausalChain {
  headline: string;
  chain: string[];
}

const timeline = [
  { when: "Yesterday", event: "Doctor shortage reported at PHC Phagi" },
  { when: "Today", event: "Patient queue increased at CHC East" },
  { when: "Tomorrow", event: "Medicine demand spike forecast" },
  { when: "Next Week", event: "High system overload risk district-wide" },
];

export function AnalyticsAndTimeline({ causalChain }: { causalChain: CausalChain }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="border border-hairline bg-paper-dim/40 p-5">
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          {causalChain.headline}
        </p>
        {causalChain.chain.length === 0 ? (
          <p className="text-sm text-ink-soft">No significant causal signal detected.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {causalChain.chain.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-sm border border-hairline bg-paper text-ink">
                  {step}
                </span>
                {i < causalChain.chain.length - 1 && (
                  <span className="text-accent-brass">→</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-hairline bg-paper-dim/40 p-5">
        <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft mb-3">
          AI Timeline
        </p>
        <div className="space-y-3">
          {timeline.map((t) => (
            <div key={t.when} className="flex gap-3 text-sm">
              <span className="w-20 shrink-0 text-ink-soft">{t.when}</span>
              <span className="text-ink">{t.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
