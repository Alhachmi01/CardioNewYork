import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact and support information for GuideVexa.",
};

export default function ContactPage() {
  return (
    <section className="page shell prose-page">
      <div className="page-intro">
        <h1>Contact GuideVexa</h1>
        <p>Support, privacy and site feedback information.</p>
      </div>

      <div className="prose-block">
        <h2>Public support channel</h2>
        <p>
          We are currently activating a dedicated public support inbox for GuideVexa. Until that address is published here, this page does not collect messages or personal information.
        </p>

        <h2>Privacy or legal requests</h2>
        <p>
          Once the public support address is active, it will also be the channel for privacy, data and legal enquiries. Do not send sensitive personal information through unofficial channels.
        </p>

        <h2>Tool feedback</h2>
        <p>
          GuideVexa tools are being improved from real usage and testing. A direct feedback channel will be added here alongside the support inbox.
        </p>
      </div>
    </section>
  );
}
