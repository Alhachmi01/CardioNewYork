import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <section className="page shell prose-page"><div className="page-intro"><h1>Terms of Use</h1><p>Last updated: August 9, 2026</p></div><div className="prose-block"><h2>Use of the site</h2><p>GuideVexa provides general-purpose tools and informational guides. You may use them for personal, lawful purposes.</p><h2>No professional advice</h2><p>Results are estimates and general information. They are not financial, legal, medical or other professional advice.</p><h2>Accuracy</h2><p>We aim to keep calculations and content accurate, but you should verify important decisions independently.</p><h2>Changes</h2><p>Tools, content and these terms may be updated as the service evolves.</p></div></section>
  );
}
