import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { guides, siteConfig, tools } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "GuideVexa — Free tools for clearer everyday decisions",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function HomePage() {
  const featured = tools.filter(tool => tool.featured).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
          inLanguage: "en",
        }}
      />

      <section className="hero shell hero-polished">
        <div className="hero-copy">
          <p className="hero-kicker">TOOLS · PLANNING · GUIDES</p>
          <h1>Free tools for clearer everyday decisions.</h1>
          <p className="hero-lead">Plan trips, estimate costs, run quick calculations and use practical checklists without signing up or digging through clutter.</p>
          <div className="hero-actions">
            <Link className="button" href="/tools">Find a tool</Link>
            <Link className="button button-ghost" href="/guides">Browse guides</Link>
          </div>
          <div className="proof-line"><span>Free to use</span><span>No account required</span><span>Instant results</span></div>
        </div>

        <div className="hero-panel hero-panel-polished" aria-label="Popular GuideVexa tools">
          <div className="hero-panel-head">
            <div><span className="panel-label">Popular tools</span><strong>Start with what you need now</strong></div>
            <span className="panel-status">Updated</span>
          </div>
          {featured.map(tool => (
            <Link href={`/tools/${tool.slug}`} className="preview-row preview-row-polished" key={tool.slug}>
              <span className="preview-icon" aria-hidden="true">{tool.icon}</span>
              <span className="preview-copy"><strong>{tool.name}</strong><small>{tool.description}</small></span>
              <ArrowIcon className="preview-arrow inline-arrow" />
            </Link>
          ))}
        </div>
      </section>

      <section className="shell trust-strip" aria-label="GuideVexa principles">
        <div><strong>No signup</strong><span>Open a tool and start immediately.</span></div>
        <div><strong>Browser-based</strong><span>Fast tools designed to work directly on the web.</span></div>
        <div><strong>Mobile ready</strong><span>Built to stay usable on smaller screens.</span></div>
      </section>

      <section className="section shell home-tools-section">
        <div className="section-heading">
          <div><p className="section-kicker">TOOLS</p><h2>Useful from the first click.</h2><p>Focused tools that solve one clear problem at a time.</p></div>
          <Link href="/tools" className="text-link">View all tools →</Link>
        </div>
        <div className="tool-grid">{featured.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div>
      </section>

      <section className="section shell split-section guides-home">
        <div className="guides-intro">
          <p className="section-kicker">GUIDES</p>
          <h2>Clear guidance without filler.</h2>
          <p className="lead">Short explanations designed to help you make a decision, understand the numbers and move on.</p>
          <Link href="/guides" className="button button-ghost">Browse all guides</Link>
        </div>
        <div className="guide-stack">
          {guides.slice(0, 3).map((guide, index) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="guide-row guide-row-home">
              <span className="guide-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="guide-row-content"><strong>{guide.title}</strong><small>{guide.description}</small><em>{guide.readTime} · {guide.category}</em></span>
              <ArrowIcon className="guide-row-arrow inline-arrow" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
