import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/lib/site";

export const metadata: Metadata = { title: "Tools", description: "Free practical tools for travel, calculations and everyday planning." };

export default function ToolsPage() {
  return (
    <section className="page shell">
      <div className="page-intro"><h1>All tools</h1><p>Simple utilities built to get you from question to answer quickly.</p></div>
      <div className="tool-grid">{tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div>
    </section>
  );
}
