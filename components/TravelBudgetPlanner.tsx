"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  buildTravelBudgetQuery,
  calculateTravelBudget,
  defaultTravelBudgetInput,
  formatMoney,
  type CurrencyCode,
  type TravelBudgetInput,
} from "@/lib/travelBudget";

export type TravelBudgetLockedField = keyof TravelBudgetInput;

type TravelBudgetPlannerProps = {
  initialBudget?: TravelBudgetInput;
  lockedFields?: readonly TravelBudgetLockedField[];
  mode?: "tool" | "remix";
  originalBudget?: TravelBudgetInput;
  parentTripId?: string;
};

const currencyOptions: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "MAD", label: "MAD — Moroccan Dirham" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
];

function ResultBox({ children }: { children: ReactNode }) {
  return <div className="result-box">{children}</div>;
}

function postTripMetric(tripId: string, event: "views" | "remix_started") {
  void fetch("/api/trips/metric", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tripId, event }),
    keepalive: true,
  }).catch(() => undefined);
}

export function TravelBudgetPlanner({
  initialBudget = defaultTravelBudgetInput,
  lockedFields = [],
  mode = "tool",
  originalBudget,
  parentTripId,
}: TravelBudgetPlannerProps) {
  const [destination, setDestination] = useState(initialBudget.destination);
  const [currency, setCurrency] = useState<CurrencyCode>(initialBudget.currency);
  const [days, setDays] = useState(initialBudget.days);
  const [people, setPeople] = useState(initialBudget.people);
  const [rooms, setRooms] = useState(initialBudget.rooms);
  const [nightly, setNightly] = useState(initialBudget.nightly);
  const [flightsPerPerson, setFlightsPerPerson] = useState(initialBudget.flightsPerPerson);
  const [foodPerPerson, setFoodPerPerson] = useState(initialBudget.foodPerPerson);
  const [activitiesPerPerson, setActivitiesPerPerson] = useState(initialBudget.activitiesPerPerson);
  const [localTransportPerDay, setLocalTransportPerDay] = useState(initialBudget.localTransportPerDay);
  const [insurancePerPerson, setInsurancePerPerson] = useState(initialBudget.insurancePerPerson);
  const [misc, setMisc] = useState(initialBudget.misc);
  const [bufferPct, setBufferPct] = useState(initialBudget.bufferPct);
  const [budgetTarget, setBudgetTarget] = useState(initialBudget.budgetTarget);
  const [isRemixing, setIsRemixing] = useState(mode === "tool");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const viewTracked = useRef(false);
  const startTracked = useRef(false);

  const locked = new Set<TravelBudgetLockedField>(lockedFields);
  const currentInput: TravelBudgetInput = {
    destination,
    currency,
    days,
    people,
    rooms,
    nightly,
    flightsPerPerson,
    foodPerPerson,
    activitiesPerPerson,
    localTransportPerDay,
    insurancePerPerson,
    misc,
    bufferPct,
    budgetTarget,
  };
  const totals = calculateTravelBudget(currentInput);
  const originalTotals = originalBudget ? calculateTravelBudget(originalBudget) : null;
  const difference = originalTotals ? originalTotals.total - totals.total : 0;

  useEffect(() => {
    if (mode !== "remix" || !parentTripId || viewTracked.current) return;
    viewTracked.current = true;
    postTripMetric(parentTripId, "views");
  }, [mode, parentTripId]);

  const beginRemix = () => {
    setIsRemixing(true);
    if (mode === "remix" && parentTripId && !startTracked.current) {
      startTracked.current = true;
      postTripMetric(parentTripId, "remix_started");
    }
  };

  const openTravelPack = () => {
    trackEvent("travel_pack_landing_open", {
      currency,
      days,
      travelers: people,
      estimated_total: Math.round(totals.total),
    });

    window.location.assign(`/go/travel-pack?${buildTravelBudgetQuery(currentInput)}`);
  };

  const printPlan = () => {
    trackEvent("travel_budget_print", {
      currency,
      estimated_total: Math.round(totals.total),
    });
    window.print();
  };

  const saveRemix = async () => {
    if (!parentTripId) return;
    setSaveError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/trips/fork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentTripId, budget: currentInput }),
      });
      const payload = await response.json() as { ok?: boolean; tripId?: string; error?: string };
      if (!response.ok || !payload.tripId) {
        throw new Error(payload.error || "save_failed");
      }
      window.location.assign(`/trip/${payload.tripId}?saved=1`);
    } catch {
      setSaveError("Your remix could not be saved. Please try again.");
      setIsSaving(false);
    }
  };

  const costFieldsDisabled = mode === "remix" && !isRemixing;

  return (
    <div className="tool-layout travel-budget-v2">
      <div className="tool-form">
        {mode === "remix" ? (
          <div className="tool-form-section">
            <p className="section-label">Fork this trip</p>
            <p className="muted" style={{ marginTop: 0 }}>
              Keep the same destination, duration and travelers. Change the cost choices to build your version.
            </p>
            {!isRemixing ? (
              <button className="button" type="button" onClick={beginRemix}>Remix this trip</button>
            ) : null}
          </div>
        ) : null}

        <div className="tool-form-section">
          <p className="section-label">Trip basics</p>
          <div className="field-grid">
            <label>
              Destination
              <input
                type="text"
                value={destination}
                placeholder="e.g. Lisbon"
                disabled={locked.has("destination")}
                onChange={event => setDestination(event.target.value)}
              />
            </label>
            <label>
              Currency
              <select
                value={currency}
                disabled={locked.has("currency")}
                onChange={event => setCurrency(event.target.value as CurrencyCode)}
              >
                {currencyOptions.map(option => (
                  <option key={option.code} value={option.code}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Trip length (days)
              <input type="number" min="1" max="365" value={days} disabled={locked.has("days")} onChange={event => setDays(Math.max(Number(event.target.value) || 1, 1))} />
            </label>
            <label>
              Travelers
              <input type="number" min="1" max="50" value={people} disabled={locked.has("people")} onChange={event => setPeople(Math.max(Number(event.target.value) || 1, 1))} />
            </label>
            <label>
              Rooms
              <input type="number" min="1" max="20" value={rooms} disabled={locked.has("rooms")} onChange={event => setRooms(Math.max(Number(event.target.value) || 1, 1))} />
            </label>
            {mode === "tool" ? (
              <label>
                Budget target ({currency})
                <input type="number" min="0" value={budgetTarget} disabled={locked.has("budgetTarget")} onChange={event => setBudgetTarget(Math.max(Number(event.target.value) || 0, 0))} />
              </label>
            ) : null}
          </div>
        </div>

        <div className="tool-form-section">
          <p className="section-label">Estimated costs</p>
          <div className="field-grid">
            <label>
              Flights / person ({currency})
              <input type="number" min="0" value={flightsPerPerson} disabled={costFieldsDisabled || locked.has("flightsPerPerson")} onChange={event => setFlightsPerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Lodging / room / night ({currency})
              <input type="number" min="0" value={nightly} disabled={costFieldsDisabled || locked.has("nightly")} onChange={event => setNightly(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Food / person / day ({currency})
              <input type="number" min="0" value={foodPerPerson} disabled={costFieldsDisabled || locked.has("foodPerPerson")} onChange={event => setFoodPerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Activities / person / day ({currency})
              <input type="number" min="0" value={activitiesPerPerson} disabled={costFieldsDisabled || locked.has("activitiesPerPerson")} onChange={event => setActivitiesPerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Local transport / day ({currency})
              <input type="number" min="0" value={localTransportPerDay} disabled={costFieldsDisabled || locked.has("localTransportPerDay")} onChange={event => setLocalTransportPerDay(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Insurance / person ({currency})
              <input type="number" min="0" value={insurancePerPerson} disabled={costFieldsDisabled || locked.has("insurancePerPerson")} onChange={event => setInsurancePerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Other / miscellaneous ({currency})
              <input type="number" min="0" value={misc} disabled={costFieldsDisabled || locked.has("misc")} onChange={event => setMisc(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Safety buffer (%)
              <input type="number" min="0" max="100" value={bufferPct} disabled={costFieldsDisabled || locked.has("bufferPct")} onChange={event => setBufferPct(Math.min(Math.max(Number(event.target.value) || 0, 0), 100))} />
            </label>
          </div>
        </div>

        <p className="helper-text">
          These are planning estimates, not live hotel or airfare quotes.
        </p>
      </div>

      <ResultBox>
        <p className="eyebrow">{mode === "remix" ? "Your version" : "Estimated trip total"}</p>
        <div className="big-number">{formatMoney(totals.total, currency)}</div>
        <p className="muted result-destination">{destination || "Your trip"} · {days} days · {people} traveler{people === 1 ? "" : "s"}</p>

        {originalTotals ? (
          <div className={`budget-status ${difference >= 0 ? "under" : "over"}`}>
            <span>{difference >= 0 ? "Less than original" : "More than original"}</span>
            <strong>{formatMoney(Math.abs(difference), currency)}</strong>
          </div>
        ) : null}

        <div className="summary-grid">
          <div className="summary-card"><span>Per traveler</span><strong>{formatMoney(totals.perPerson, currency)}</strong></div>
          <div className="summary-card"><span>Per day</span><strong>{formatMoney(totals.perDay, currency)}</strong></div>
        </div>

        {mode === "tool" && budgetTarget > 0 ? (
          <div className={`budget-status ${totals.targetDifference >= 0 ? "under" : "over"}`}>
            <span>{totals.targetDifference >= 0 ? "Within target" : "Over target"}</span>
            <strong>{formatMoney(Math.abs(totals.targetDifference), currency)}</strong>
          </div>
        ) : null}

        <div className="breakdown">
          <div><span>Flights</span><strong>{formatMoney(totals.flights, currency)}</strong></div>
          <div><span>Lodging</span><strong>{formatMoney(totals.lodging, currency)}</strong></div>
          <div><span>Food</span><strong>{formatMoney(totals.food, currency)}</strong></div>
          <div><span>Activities</span><strong>{formatMoney(totals.activities, currency)}</strong></div>
          <div><span>Local transport</span><strong>{formatMoney(totals.localTransport, currency)}</strong></div>
          <div><span>Insurance</span><strong>{formatMoney(totals.insurance, currency)}</strong></div>
          <div><span>Other</span><strong>{formatMoney(misc, currency)}</strong></div>
          <div><span>{bufferPct}% safety buffer</span><strong>{formatMoney(totals.buffer, currency)}</strong></div>
        </div>

        {mode === "tool" ? (
          <div className="budget-actions">
            <button className="button full-width" onClick={openTravelPack}>Get complete travel pack</button>
            <button className="button button-ghost full-width" onClick={printPlan}>Print budget</button>
          </div>
        ) : isRemixing ? (
          <div className="budget-actions">
            <button className="button full-width" type="button" disabled={isSaving} onClick={saveRemix}>
              {isSaving ? "Saving…" : "Save my version"}
            </button>
            {saveError ? <p className="helper-text compact-helper">{saveError}</p> : null}
          </div>
        ) : null}

        {mode === "tool" ? (
          <p className="helper-text compact-helper">See the full breakdown, packing starter and daily planner before downloading.</p>
        ) : null}
      </ResultBox>
    </div>
  );
}
