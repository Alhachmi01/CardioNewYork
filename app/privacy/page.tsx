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
          GuideVexa V1 performs its current calculator and checklist interactions in your browser. We do not intentionally send or store the values you enter into these tools on a GuideVexa database. Travel-pack details are temporarily kept in your browser session when needed to restore a personalized download after an unlock flow.
        </p>

        <h2>Analytics and performance measurement</h2>
        <p>
          GuideVexa includes Vercel Web Analytics and Speed Insights components to understand site usage and technical performance. These services may process ordinary request, device and performance information according to Vercel&apos;s own terms and privacy practices. GuideVexa&apos;s custom funnel events are designed not to include planner fields such as your destination.
        </p>

        <h2>Third-party offers and unlock services</h2>
        <p>
          The Complete Travel Pack can use an OGAds content locker that requires one available third-party offer completion before the download is unlocked. The locker may be delivered through an OGAds-managed or shared domain. When you open the locker, choose an offer or submit information to an offer provider, OGAds and the relevant independent provider may process information under their own terms and privacy policies. GuideVexa does not present those third-party forms as GuideVexa forms.
        </p>

        <h2>Technical information</h2>
        <p>
          Our hosting, analytics, network and unlock-service providers may process ordinary technical request data needed to deliver, measure and protect the website, such as IP address, browser information, timestamps and requested URLs, according to their own service terms and privacy practices.
        </p>

        <h2>Contact</h2>
        <p>
          The current support-channel status is published on the Contact page. Until a dedicated public inbox is activated, GuideVexa does not collect contact messages through an on-site form.
        </p>
      </div>
    </section>
  );
}
