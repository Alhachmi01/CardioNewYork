import type { Metadata } from "next";

const description = "GuideVexa privacy policy and information about tool inputs, analytics and third-party services.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: "GuideVexa Privacy Policy", description, url: "/privacy", type: "website" },
};

export default function PrivacyPage() {
  return (
    <section className="page shell prose-page">
      <div className="page-intro">
        <h1>Privacy Policy</h1>
        <p>Last updated: August 10, 2026</p>
      </div>

      <div className="prose-block">
        <h2>Data you enter into tools</h2>
        <p>
          GuideVexa V1 performs its current calculator and checklist interactions in your browser. We do not intentionally send or store the values you enter into these tools on a GuideVexa database.
        </p>

        <h2>Analytics and advertising measurement</h2>
        <p>
          GuideVexa does not currently activate advertising pixels or behavioural analytics through this V1 release. If analytics, advertising measurement or similar technologies are enabled later, this policy will be updated to describe the services used and the information they process.
        </p>

        <h2>Third-party offers and unlock services</h2>
        <p>
          Some future downloadable resources may clearly offer an optional third-party completion step before access. When such a feature is active, the third-party provider may process information under its own privacy policy. GuideVexa will identify that interaction on the relevant page rather than presenting it as a first-party action.
        </p>

        <h2>Technical information</h2>
        <p>
          Our hosting and network providers may process ordinary technical request data needed to deliver and protect the website, such as IP address, browser information, timestamps and requested URLs, according to their own service terms and privacy practices.
        </p>

        <h2>Contact</h2>
        <p>
          The current support-channel status is published on the Contact page. Until a dedicated public inbox is activated, GuideVexa does not collect contact messages through an on-site form.
        </p>
      </div>
    </section>
  );
}
