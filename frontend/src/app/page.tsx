import { KpiStrip } from "@/components/KpiStrip";
import { DistrictMapClient } from "@/components/DistrictMapClient";
import { RiskHeatmap } from "@/components/RiskHeatmap";
import { AlertsList } from "@/components/AlertsList";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { ResourceTransfers } from "@/components/ResourceTransfers";
import { ForecastChart } from "@/components/ForecastChart";
import { PerformanceScores } from "@/components/PerformanceScores";
import { AnalyticsAndTimeline } from "@/components/AnalyticsAndTimeline";
import { AskPanel } from "@/components/AskPanel";
import { Section } from "@/components/Section";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-hairline px-6 md:px-10 py-6 flex items-baseline justify-between">
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1">
            District Health Operations Center
          </p>
          <h1 className="font-serif-display italic text-3xl text-ink">SwasthyaGrid AI</h1>
        </div>
        <p className="text-xs text-ink-soft hidden md:block max-w-xs text-right">
          Predictive · Prescriptive · Explainable · Human-Governed
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-12">
        <Section title="District Overview" eyebrow="Live Status" className="border-t-0 pt-0">
          <KpiStrip />
        </Section>

        <Section title="District Map" eyebrow="Every Facility, One View">
          <DistrictMapClient />
        </Section>

        <Section title="Risk Heatmap" eyebrow="Districtwide Scan">
          <RiskHeatmap />
        </Section>

        <Section title="Alerts" eyebrow="Intelligence, Not Notifications">
          <AlertsList />
        </Section>

        <Section title="AI Recommendations" eyebrow="Propose → Approve → Act">
          <RecommendationsPanel />
        </Section>

        <Section title="Resource Transfers" eyebrow="Approved Actions Log">
          <ResourceTransfers />
        </Section>

        <Section title="Forecast" eyebrow="Footfall, Next 7 Days">
          <ForecastChart />
        </Section>

        <Section title="Analytics & Timeline" eyebrow="Why, Not Just What">
          <AnalyticsAndTimeline />
        </Section>

        <Section title="Performance Score" eyebrow="Which Facilities Need Help">
          <PerformanceScores />
        </Section>
      </div>

      <footer className="border-t border-hairline px-6 md:px-10 py-6 text-xs text-ink-soft">
        SwasthyaGrid AI — built by Harsh Kawatra &amp; Dayita Arora for GDG BuildWithAI.
      </footer>

      <AskPanel />
    </main>
  );
}
