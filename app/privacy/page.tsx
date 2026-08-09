import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="page shell prose-page"><div className="page-intro"><h1>Privacy Policy</h1><p>Last updated: August 9, 2026</p></div><div className="prose-block"><h2>Data you enter into tools</h2><p>GuideVexa V1 performs tool calculations in your browser. We do not intentionally store the values you enter into the calculators and checklists included in this version.</p><h2>Analytics and technical data</h2><p>If analytics are enabled later, we may collect standard technical information such as page views, device type, approximate location and referral source. This policy will be updated before such tracking is activated.</p><h2>Third-party services</h2><p>Future versions may link to or integrate third-party services. Their own privacy terms will apply when you interact with them.</p><h2>Contact</h2><p>For privacy questions, use the contact information published on GuideVexa once the public contact channel is activated.</p></div></section>
  );
}
