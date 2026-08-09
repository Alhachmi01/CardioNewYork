import Link from "next/link";
import type { ToolDefinition } from "@/lib/site";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link className="tool-card" href={`/tools/${tool.slug}`}>
      <div className="tool-card-top">
        <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
        <span className="category-label">{tool.category}</span>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <span className="text-link">Open tool →</span>
    </Link>
  );
}
