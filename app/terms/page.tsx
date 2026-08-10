import type { Metadata } from "next";

const description = "GuideVexa terms of use for tools, estimates, downloadable resources and third-party offers.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title: "GuideVexa Terms of Use", description, url: "/terms", type: "website" },
};

export default function TermsPage() {
  return (
    <section className="page shell prose-page">
      <div className="page-intro">
        <h1>Terms of Use</h1>
        <p>Last updated: August 10, 2026</p>
      </div>

      <div className="prose-block">
        <h2>Use of the site</h2>
        <p>
          GuideVexa provides general-purpose tools, downloadable planning resources and informational guides. You may use them for personal, lawful purposes.
        </p>

        <h2>Estimates and information</h2>
        <p>
          Calculator results and planning outputs are estimates based on the information you provide. They are not live quotes and are not financial, legal, medical or other professional advice. Verify important prices, requirements and decisions independently.
        </p>

        <h2>Downloadable resources</h2>
        <p>
          A downloadable GuideVexa resource may contain templates, checklists or planning information generated from your inputs. You are responsible for reviewing the output before relying on it.
        </p>

        <h2>Third-party offers</h2>
        <p>
          Some downloadable resources, including the Complete Travel Pack, may clearly require completion of an available third-party offer before access is unlocked. Those offers are provided by independent third parties and may have separate eligibility requirements, terms and privacy practices. GuideVexa does not control the information requested by an independent offer provider and does not represent an offer as completed until the configured unlock flow returns the visitor to GuideVexa.
        </p>

        <h2>Availability and changes</h2>
        <p>
          Tools, downloads, content and these terms may be updated, replaced or withdrawn as the service evolves. We aim to keep the site useful and accurate but do not guarantee uninterrupted availability.
        </p>
      </div>
    </section>
  );
}
