"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { downloadTravelPack, readTravelPackSession } from "@/lib/travelPack";
import {
  buildTravelBudgetQuery,
  calculateTravelBudget,
  formatMoney,
  type TravelBudgetInput,
} from "@/lib/travelBudget";

export function TravelPackUnlocked() {
  const [input, setInput] = useState<TravelBudgetInput | null>(null);
  const [missingState, setMissingState] = useState(false);
  const hasHandledRedirect = useRef(false);

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

  useEffect(() => {
    if (hasHandledRedirect.current) return;
    hasHandledRedirect.current = true;

    const storedInput = readTravelPackSession();
    if (!storedInput) {
      setMissingState(true);
      return;
    }

    setInput(storedInput);
    const totals = calculateTravelBudget(storedInput);
    trackEvent("locker_complete", {
      currency: storedInput.currency,
      days: storedInput.days,
      travelers: storedInput.people,
      estimated_total: Math.round(totals.total),
    });

    const timer = window.setTimeout(() => runDownload(storedInput), 350);
    return () => window.clearTimeout(timer);
  }, []);

  if (missingState) {
    return (
      <section className="page shell prose-page">
        <div className="page-intro">
          <h1>Your travel pack is unlocked.</h1>
          <p>We could not recover the trip details from this browser tab.</p>
        </div>
        <div className="prose-block">
          <p>Return to the Travel Budget Planner, rebuild or restore your budget, then open the travel pack again.</p>
          <p><Link className="button" href="/tools/travel-budget-planner">Return to Travel Budget Planner</Link></p>
        </div>
      </section>
    );
  }

  if (!input) {
    return (
      <section className="page shell prose-page">
        <div className="page-intro">
          <h1>Preparing your travel pack…</h1>
          <p>Your personalized download is being restored.</p>
        </div>
      </section>
    );
  }

  const totals = calculateTravelBudget(input);
  const plannerHref = `/tools/travel-budget-planner?${buildTravelBudgetQuery(input)}`;

  return (
    <section className="page shell prose-page">
      <div className="page-intro">
        <h1>Your travel pack is unlocked.</h1>
        <p>Your download should start automatically. If it does not, use the button below.</p>
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
