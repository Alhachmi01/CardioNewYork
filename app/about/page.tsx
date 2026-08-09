import type { Metadata } from "next";

export const metadata: Metadata = { title: "About", description: "About GuideVexa and the principles behind its tools and guides." };

export default function AboutPage() {
  return (
    <section className="page shell prose-page">
      <div className="page-intro"><h1>About GuideVexa</h1><p>We build small, useful tools that make everyday decisions easier.</p></div>
      <div className="prose-block"><h2>What we make</h2><p>GuideVexa combines practical browser-based tools with concise guides. Each page is designed around one clear task: calculate, plan, compare or prepare.</p><h2>Our approach</h2><p>We favour clear inputs, transparent calculations and useful outputs. We avoid fake urgency, misleading claims and unnecessary registration walls.</p><h2>Version 1</h2><p>This first release focuses on a small set of travel and calculation tools. More categories can be added as real usage data shows what visitors need.</p></div>
    </section>
  );
}
