"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { downloadTravelPack, readTravelPackSessionState } from "@/lib/travelPack";
import {
  buildTravelBudgetQuery,
  calculateTravelBudget,
  formatMoney,
  type TravelBudgetInput,
} from "@/lib/travelBudget";

const verificationAttempts = 12;
const verificationDelayMs = 750;

async function isUnlockVerified(sessionId: string) {
  try {
    const response = await fetch(`/api/ogads/unlock-status?sessionId=${encodeURIComponent(sessionId)}`, {
      cache: "no-store",
    });
    if (!response.ok) return false;
    const body = await response.json() as { verified?: boolean };
    return body.verified === true;
  } catch {
    return false;
  }
}

async function waitForUnlockVerification(sessionId: string) {
  for (let attempt = 0; attempt < verificationAttempts; attempt += 1) {
    if (await isUnlockVerified(sessionId)) return true;
    if (attempt < verificationAttempts - 1) {
      await new Promise(resolve => window.setTimeout(resolve, verificationDelayMs));
    }
  }
  return false;
}

export function TravelPackUnlocked() {
  const [input, setInput] = useState<TravelBudgetInput | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"checking" | "verified" | "pending" | "missing">("checking");
  const hasHandledRedirect = useRef(false);
  const hasTrackedCompletion = useRef(false);

  const runDownload = (travelInput: TravelBudgetInput) => {
    const totals = calculateTravelBudget(travelInput);
    trackEvent("download_start", {
      currency: travelInput.currency,
      days: travelInput.days,
      travelers: travelInput.people,
      estimated_total: Math.round(totals.total),
    });
    downloadTravelPack(travelInput);
  };

  const handleVerified = (travelInput: TravelBudgetInput) => {
    setStatus("verified");
    if (!hasTrackedCompletion.current) {
      hasTrackedCompletion.current = true;
      const totals = calculateTravelBudget(travelInput);
      trackEvent("locker_complete", {
        currency: travelInput.currency,
        days: travelInput.days,
        travelers: travelInput.people,
        estimated_total: Math.round(totals.total),
      });
    }
    window.setTimeout(() => runDownload(travelInput), 350);
  };

  useEffect(() => {
    if (hasHandledRedirect.current) return;
    hasHandledRedirect.current = true;

    const stored = readTravelPackSessionState();
    if (!stored?.input || !stored.ogAdsSessionId) {
      setStatus("missing");
      return;
    }

    setInput(stored.input);
    setSessionId(stored.ogAdsSessionId);

    let cancelled = false;
    void waitForUnlockVerification(stored.ogAdsSessionId).then(verified => {
      if (cancelled) return;
      if (verified) {
        handleVerified(stored.input);
      } else {
        setStatus("pending");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const retryVerification = async () => {
    if (!input || !sessionId) return;
    setStatus("checking");
    const verified = await waitForUnlockVerification(sessionId);
    if (verified) {
      handleVerified(input);
    } else {
      setStatus("pending");
    }
  };

  if (status === "missing") {
    return (
      <section className="page shell prose-page">
        <div className="page-intro">
          <h1>We could not restore this unlock session.</h1>
          <p>The trip details or verification session are no longer available in this browser tab.</p>
        </div>
        <div className="prose-block">
          <p>Return to the Travel Budget Planner, restore your budget, then open the travel pack again.</p>
          <p><Link className="button" href="/tools/travel-budget-planner">Return to Travel Budget Planner</Link></p>
        </div>
      </section>
    );
  }

  if (!input || status === "checking") {
    return (
      <section className="page shell prose-page">
        <div className="page-intro">
          <h1>Verifying your travel pack unlock…</h1>
          <p>GuideVexa is waiting for the conversion confirmation before starting the download.</p>
        </div>
      </section>
    );
  }

  const totals = calculateTravelBudget(input);
  const plannerHref = `/tools/travel-budget-planner?${buildTravelBudgetQuery(input)}`;

  if (status === "pending") {
    return (
      <section className="page shell prose-page">
        <div className="page-intro">
          <h1>Confirmation is still pending.</h1>
          <p>We have not received the verified OGAds conversion yet, so the download remains locked.</p>
        </div>
        <div className="prose-block">
          <p>If you just completed an offer, wait a few seconds and retry verification.</p>
          <p><button className="button" onClick={retryVerification}>Retry verification</button></p>
          <p><Link className="text-link" href={plannerHref}>Back to Travel Budget Planner →</Link></p>
        </div>
      </section>
    );
  }

  return (
    <section className="page shell prose-page">
      <div className="page-intro">
        <h1>Your travel pack is unlocked.</h1>
        <p>Your verified download should start automatically. If it does not, use the button below.</p>
      </div>

      <div className="prose-block">
        <h2>{input.destination || "Your trip"}</h2>
        <p>{input.days} days · {input.people} traveler{input.people === 1 ? "" : "s"} · Estimated total {formatMoney(totals.total, input.currency)}</p>
        <p><button className="button" onClick={() => runDownload(input)}>Download travel pack again</button></p>
        <p><Link className="text-link" href={plannerHref}>Back to Travel Budget Planner →</Link></p>
      </div>
    </section>
  );
}
