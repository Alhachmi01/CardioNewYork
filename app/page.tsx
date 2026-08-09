import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { guides, tools } from "@/lib/site";

export default function HomePage() {
  const featured = tools.filter(tool => tool.featured).slice(0, 3);
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <h1>Practical tools for decisions that should not feel complicated.</h1>
          <p>Plan trips, calculate everyday numbers and use clear checklists — fast, free and built for mobile.</p>
          <div className="hero-actions">
            <Link className="button" href="/tools">Explore tools</Link>
            <Link className="button button-ghost" href="/guides">Read guides</Link>
          </div>
          <div className="proof-line"><span>Free to use</span><span>No account required</span><span>Mobile-first</span></div>
        </div>
        <div className="hero-panel" aria-label="GuideVexa tool preview">
          <div className="hero-panel-head"><span>Popular now</span><span className="live-dot">●</span></div>
          {featured.map((tool, index) => (
            <Link href={`/tools/${tool.slug}`} className="preview-row" key={tool.slug}>
              <span className="preview-index">0{index + 1}</span>
              <span><strong>{tool.name}</strong><small>{tool.description}</small></span>
              <span>↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading"><div><h2>Useful from the first click</h2><p>Focused tools that solve one clear problem at a time.</p></div><Link href="/tools" className="text-link">View all tools →</Link></div>
        <div className="tool-grid">{featured.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div>
      </section>

      <section className="section shell split-section">
        <div>
          <h2>Clear guides, not filler.</h2>
          <p className="lead">Short explanations designed to help you make a decision and move on.</p>
          <Link href="/guides" className="button button-ghost">Browse guides</Link>
        </div>
        <div className="guide-stack">
          {guides.slice(0, 3).map((guide, index) => (
            <article key={guide.title} className="guide-row">
              <span className="guide-number">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{guide.title}</h3><p>{guide.description}</p><small>{guide.readTime} · {guide.category}</small></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
