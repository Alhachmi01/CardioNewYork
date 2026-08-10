"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { saveTravelPackSession } from "@/lib/travelPack";
import {
  buildTravelBudgetQuery,
  calculateTravelBudget,
  formatMoney,
  normalizeTravelBudgetInput,
  type TravelBudgetInput,
} from "@/lib/travelBudget";

const ogAdsScriptBaseUrl = "https://appsave.online/cl/js/krnllq";
const ogAdsDirectBaseUrl = "https://appsave.online/cl/i/krnllq";
const ogAdsWaitTimeoutMs = 8000;
const ogAdsPollIntervalMs = 100;

declare global {
  interface Window {
    og_load?: () => void;
  }
}

function waitForOgAdsLoader() {
  return new Promise<boolean>(resolve => {
    if (typeof window.og_load === "function") {
      resolve(true);
      return;
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (typeof window.og_load === "function") {
        window.clearInterval(timer);
        resolve(true);
        return;
      }

      if (Date.now() - startedAt >= ogAdsWaitTimeoutMs) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, ogAdsPollIntervalMs);
  });
}

type TravelPackLandingProps = TravelBudgetInput & {
  ogAdsSessionId: string;
};

export function TravelPackLanding({ ogAdsSessionId, ...input }: TravelPackLandingProps) {
  const safeInput = normalizeTravelBudgetInput(input);
  const totals = calculateTravelBudget(safeInput);
  const { days, people, currency } = safeInput;
  const hasTrackedView = useRef(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const ogAdsScriptUrl = `${ogAdsScriptBaseUrl}?aff_sub=${encodeURIComponent(ogAdsSessionId)}`;
  const ogAdsDirectUrl = `${ogAdsDirectBaseUrl}?aff_sub=${encodeURIComponent(ogAdsSessionId)}`;

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackEvent("travel_pack_lp_view", {
      currency,
      days,
      travelers: people,
      estimated_total: Math.round(totals.total),
    });
  }, [currency, days, people, totals.total]);

  const requestDownload = async () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    setUnlockError(null);

    saveTravelPackSession(safeInput, ogAdsSessionId);

    trackEvent("travel_pack_cta_click", {
      currency,
      days,
      travelers: people,
      estimated_total: Math.round(totals.total),
    });

    try {
      const registration = await fetch("/api/ogads/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: ogAdsSessionId }),
      });

      if (!registration.ok) {
        throw new Error("registration_failed");
      }
    } catch {
      trackEvent("locker_registration_failed");
      setUnlockError("The unlock service is temporarily unavailable. Please try again in a moment.");
      setIsUnlocking(false);
      return;
    }

    const loaderReady = await waitForOgAdsLoader();

    if (loaderReady && typeof window.og_load === "function") {
      trackEvent("locker_open", { method: "javascript" });
      try {
        window.og_load();
        window.setTimeout(() => setIsUnlocking(false), 1200);
        return;
      } catch {
        // Fall through to the official direct-link fallback below.
      }
    }

    trackEvent("locker_open", { method: "direct_fallback" });
    window.location.assign(ogAdsDirectUrl);
  };

  const plannerHref = `/tools/travel-budget-planner?${buildTravelBudgetQuery(safeInput)}`;
  const ctaLabel = isUnlocking ? "Preparing unlock…" : "Unlock & download my travel pack";

  return (
    <div className="landing-page">
      <Script id="ogjs" src={ogAdsScriptUrl} strategy="afterInteractive" />

      <section className="landing-hero shell">
        <div className="landing-hero-copy">
          <h1>Your complete travel plan, in one downloadable pack.</h1>
          <p>
            Turn the budget you just built into a practical pack with the full cost breakdown, a packing starter and a printable daily planner.
          </p>

          <ul className="landing-benefits" aria-label="Travel pack contents">
            <li>Full budget breakdown</li>
            <li>Packing checklist starter</li>
            <li>Printable daily planner</li>
          </ul>

          <button
            id="get-pack"
            className="button landing-primary-cta"
            data-ogads-slot="travel-pack"
            onClick={requestDownload}
            disabled={isUnlocking}
            aria-busy={isUnlocking}
          >
            {ctaLabel}
          </button>
          <p className="landing-cta-note">Built from your planner inputs. One third-party offer completion is required to unlock this download.</p>
          {unlockError ? <p className="landing-cta-note" role="alert">{unlockError}</p> : null}
          <Link className="landing-back-link" href={plannerHref}>← Edit my budget first</Link>
        </div>

        <div className="travel-pack-preview" aria-label="Preview of your GuideVexa travel pack">
          <div className="preview-sheet">
            <div className="preview-sheet-brand">GuideVexa Travel Pack</div>
            <h2>{safeInput.destination || "Your trip"}</h2>
            <p>{days} days · {people} traveler{people === 1 ? "" : "s"}</p>
            <div className="preview-total"><span>Estimated total</span><strong>{formatMoney(totals.total, currency)}</strong></div>
            <div className="preview-mini-grid">
              <div><span>Per traveler</span><strong>{formatMoney(totals.perPerson, currency)}</strong></div>
              <div><span>Per day</span><strong>{formatMoney(totals.perDay, currency)}</strong></div>
            </div>
            <div className="preview-lines"><i></i><i></i><i></i><i></i></div>
            <div className="preview-checks"><span>✓ Budget</span><span>✓ Packing</span><span>✓ Daily plan</span></div>
          </div>
        </div>
      </section>

      <section className="landing-trust shell" aria-label="Travel pack trust information">
        <span>Built from your inputs</span><span>Browser-generated</span><span>Printable & reusable</span>
      </section>

      <section className="landing-section shell">
        <div className="landing-section-heading">
          <h2>What is inside the pack?</h2>
          <p>One focused file for the parts of a trip that are easiest to forget or underestimate.</p>
        </div>
        <div className="landing-feature-grid">
          <article><span>01</span><h3>Budget breakdown</h3><p>Your estimated flights, lodging, food, activities, local transport, insurance and safety buffer in one view.</p></article>
          <article><span>02</span><h3>Packing starter</h3><p>A simple essentials checklist you can expand for your destination, weather and travel style.</p></article>
          <article><span>03</span><h3>Daily planner</h3><p>A printable row for every trip day so you can add bookings, activities, notes and spending.</p></article>
        </div>
      </section>

      <section className="landing-section landing-how shell">
        <div className="landing-section-heading"><h2>How it works</h2></div>
        <ol>
          <li><strong>1. Build your budget</strong><span>Use the free Travel Budget Planner with your real trip numbers.</span></li>
          <li><strong>2. Review your pack</strong><span>This page turns those inputs into a clean travel-pack preview.</span></li>
          <li><strong>3. Unlock and download</strong><span>Complete one available third-party offer, then return to GuideVexa for your personalized download.</span></li>
        </ol>
      </section>

      <section className="landing-section landing-faq shell">
        <div className="landing-section-heading"><h2>Frequently asked questions</h2></div>
        <details><summary>Is the travel pack a live booking quote?</summary><p>No. It is a planning resource based on the numbers you entered. Recheck live prices before booking.</p></details>
        <details><summary>Do I need an account?</summary><p>No GuideVexa account is required. The unlock step is handled by an independent third-party offer provider.</p></details>
        <details><summary>What format do I receive?</summary><p>The pack downloads as a self-contained HTML document that you can open in a browser and print or save as PDF.</p></details>
      </section>

      <section className="landing-final-cta shell">
        <h2>Keep your trip plan in one place.</h2>
        <p>Unlock the pack built from the budget you already created.</p>
        <button
          className="button landing-primary-cta"
          data-ogads-slot="travel-pack"
          onClick={requestDownload}
          disabled={isUnlocking}
          aria-busy={isUnlocking}
        >
          {ctaLabel}
        </button>
      </section>
    </div>
  );
}
