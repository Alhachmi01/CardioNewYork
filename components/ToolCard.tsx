import Link from "next/link";
import type { ToolDefinition } from "@/lib/site";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link className="tool-card tool-card-polished" href={`/tools/${tool.slug}`}>
      <div className="tool-card-top">
        <span className="tool-icon tool-icon-polished" aria-hidden="true">{tool.icon}</span>
        <span className="tool-meta">{tool.category} · Free</span>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <span className="tool-card-action"><span>Open tool</span><span aria-hidden="true">→</span></span>
    </Link>
  );
}
