import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

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
          Where a page clearly states that a third-party action is required to unlock a resource, that action is provided by an independent third party and may be subject to separate eligibility requirements, terms and privacy practices. GuideVexa will not represent a third-party action as completed until the provider confirms it.
        </p>

        <h2>Availability and changes</h2>
        <p>
          Tools, downloads, content and these terms may be updated, replaced or withdrawn as the service evolves. We aim to keep the site useful and accurate but do not guarantee uninterrupted availability.
        </p>
      </div>
    </section>
  );
}
