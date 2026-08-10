import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/site";

const description = "Practical guides for travel planning, calculations and everyday digital tasks.";

export const metadata: Metadata = {
  title: "Guides",
  description,
  alternates: { canonical: "/guides" },
  openGraph: { title: "GuideVexa Guides", description, url: "/guides", type: "website" },
};

export default function GuidesPage() {
  return (
    <section className="page shell">
      <div className="page-intro">
        <h1>Guides</h1>
        <p>Concise explanations with enough detail to be useful.</p>
      </div>
      <div className="article-list">
        {guides.map((guide, index) => (
          <Link className="guide-card-link" href={`/guides/${guide.slug}`} key={guide.slug}>
            <article className="article-row article-row-link">
              <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="category-label">{guide.category}</div>
                <h2>{guide.title}</h2>
                <p>{guide.description}</p>
                <small>{guide.readTime} read</small>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
