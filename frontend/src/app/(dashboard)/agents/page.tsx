import { PageHeader } from "@/components/shell/PageHeader";
import { AgentConsole } from "@/components/AgentConsole";

export default function AgentsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Monitor · Reason · Act"
        title="Agent Console"
      />
      <AgentConsole />
    </div>
  );
}
