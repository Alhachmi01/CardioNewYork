import type { Metadata } from "next";
import { guides } from "@/lib/site";

export const metadata: Metadata = { title: "Guides", description: "Practical guides for travel planning, calculations and everyday digital tasks." };

export default function GuidesPage() {
  return (
    <section className="page shell">
      <div className="page-intro"><h1>Guides</h1><p>Concise explanations with enough detail to be useful.</p></div>
      <div className="article-list">
        {guides.map((guide, index) => (
          <article className="article-row" key={guide.title}>
            <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
            <div><div className="category-label">{guide.category}</div><h2>{guide.title}</h2><p>{guide.description}</p><small>{guide.readTime} read</small></div>
          </article>
        ))}
      </div>
    </section>
  );
}
