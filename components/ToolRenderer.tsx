"use client";

import { useState } from "react";
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

function ResultBox({ children }: { children: ReactNode }) {
  return <div className="result-box">{children}</div>;
}

const currencyOptions: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "MAD", label: "MAD — Moroccan Dirham" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
];

function TravelBudgetPlanner({ initialInput = defaultTravelBudgetInput }: { initialInput?: TravelBudgetInput }) {
  const [destination, setDestination] = useState(initialInput.destination);
  const [currency, setCurrency] = useState<CurrencyCode>(initialInput.currency);
  const [days, setDays] = useState(initialInput.days);
  const [people, setPeople] = useState(initialInput.people);
  const [rooms, setRooms] = useState(initialInput.rooms);
  const [nightly, setNightly] = useState(initialInput.nightly);
  const [flightsPerPerson, setFlightsPerPerson] = useState(initialInput.flightsPerPerson);
  const [foodPerPerson, setFoodPerPerson] = useState(initialInput.foodPerPerson);
  const [activitiesPerPerson, setActivitiesPerPerson] = useState(initialInput.activitiesPerPerson);
  const [localTransportPerDay, setLocalTransportPerDay] = useState(initialInput.localTransportPerDay);
  const [insurancePerPerson, setInsurancePerPerson] = useState(initialInput.insurancePerPerson);
  const [misc, setMisc] = useState(initialInput.misc);
  const [bufferPct, setBufferPct] = useState(initialInput.bufferPct);
  const [budgetTarget, setBudgetTarget] = useState(initialInput.budgetTarget);

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

  return (
    <div className="tool-layout travel-budget-v2">
      <div className="tool-form">
        <div className="tool-form-section">
          <p className="section-label">Trip basics</p>
          <div className="field-grid">
            <label>
              Destination
              <input
                type="text"
                value={destination}
                placeholder="e.g. Lisbon"
                onChange={event => setDestination(event.target.value)}
              />
            </label>
            <label>
              Currency
              <select value={currency} onChange={event => setCurrency(event.target.value as CurrencyCode)}>
                {currencyOptions.map(option => (
                  <option key={option.code} value={option.code}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Trip length (days)
              <input type="number" min="1" max="365" value={days} onChange={event => setDays(Math.max(Number(event.target.value) || 1, 1))} />
            </label>
            <label>
              Travelers
              <input type="number" min="1" max="50" value={people} onChange={event => setPeople(Math.max(Number(event.target.value) || 1, 1))} />
            </label>
            <label>
              Rooms
              <input type="number" min="1" max="20" value={rooms} onChange={event => setRooms(Math.max(Number(event.target.value) || 1, 1))} />
            </label>
            <label>
              Budget target ({currency})
              <input type="number" min="0" value={budgetTarget} onChange={event => setBudgetTarget(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
          </div>
        </div>

        <div className="tool-form-section">
          <p className="section-label">Estimated costs</p>
          <div className="field-grid">
            <label>
              Flights / person ({currency})
              <input type="number" min="0" value={flightsPerPerson} onChange={event => setFlightsPerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Lodging / room / night ({currency})
              <input type="number" min="0" value={nightly} onChange={event => setNightly(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Food / person / day ({currency})
              <input type="number" min="0" value={foodPerPerson} onChange={event => setFoodPerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Activities / person / day ({currency})
              <input type="number" min="0" value={activitiesPerPerson} onChange={event => setActivitiesPerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Local transport / day ({currency})
              <input type="number" min="0" value={localTransportPerDay} onChange={event => setLocalTransportPerDay(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Insurance / person ({currency})
              <input type="number" min="0" value={insurancePerPerson} onChange={event => setInsurancePerPerson(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Other / miscellaneous ({currency})
              <input type="number" min="0" value={misc} onChange={event => setMisc(Math.max(Number(event.target.value) || 0, 0))} />
            </label>
            <label>
              Safety buffer (%)
              <input type="number" min="0" max="100" value={bufferPct} onChange={event => setBufferPct(Math.min(Math.max(Number(event.target.value) || 0, 0), 100))} />
            </label>
          </div>
        </div>

        <p className="helper-text">
          Tip: use realistic current prices. The calculator does not fetch live airfare or hotel rates.
        </p>
      </div>

      <ResultBox>
        <p className="eyebrow">Estimated trip total</p>
        <div className="big-number">{formatMoney(totals.total, currency)}</div>
        <p className="muted result-destination">{destination || "Your trip"} · {days} days · {people} traveler{people === 1 ? "" : "s"}</p>

        <div className="summary-grid">
          <div className="summary-card"><span>Per traveler</span><strong>{formatMoney(totals.perPerson, currency)}</strong></div>
          <div className="summary-card"><span>Per day</span><strong>{formatMoney(totals.perDay, currency)}</strong></div>
        </div>

        {budgetTarget > 0 ? (
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

        <div className="budget-actions">
          <button className="button full-width" onClick={openTravelPack}>Get complete travel pack</button>
          <button className="button button-ghost full-width" onClick={printPlan}>Print budget</button>
        </div>
        <p className="helper-text compact-helper">See the full breakdown, packing starter and daily planner before downloading.</p>
      </ResultBox>
    </div>
  );
}

const packingCatalog: Record<string, string[]> = {
  City: ["ID / passport", "Phone charger", "Comfortable shoes", "Light jacket", "Reusable bottle", "Day bag"],
  Beach: ["Swimwear", "Sunscreen", "Sandals", "Hat", "Sunglasses", "Quick-dry towel"],
  Outdoor: ["Hiking shoes", "Weather layer", "First-aid basics", "Headlamp", "Reusable bottle", "Power bank"],
};

function PackingChecklist() {
  const [kind, setKind] = useState("City");
  const [days, setDays] = useState(5);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const extras = days > 7 ? ["Laundry bag", "Extra medication supply"] : [];
  const items = [...packingCatalog[kind], ...extras];
  const completed = items.filter(item => checked[item]).length;
  return (
    <div className="tool-layout">
      <div className="tool-form">
        <div className="field-grid two">
          <label>Trip type<select value={kind} onChange={e => {setKind(e.target.value); setChecked({});}}><option>City</option><option>Beach</option><option>Outdoor</option></select></label>
          <label>Days<input type="number" min="1" max="60" value={days} onChange={e => setDays(Number(e.target.value) || 1)} /></label>
        </div>
        <div className="checklist">
          {items.map(item => (
            <label className="check-row" key={item}>
              <input type="checkbox" checked={!!checked[item]} onChange={() => setChecked(v => ({...v, [item]: !v[item]}))} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
      <ResultBox>
        <p className="eyebrow">Packing progress</p>
        <div className="big-number">{completed}/{items.length}</div>
        <p className="muted">A focused starter list for a {days}-day {kind.toLowerCase()} trip.</p>
      </ResultBox>
    </div>
  );
}

function PercentageCalculator() {
  const [value, setValue] = useState(250);
  const [percent, setPercent] = useState(20);
  const result = value * percent / 100;
  return (
    <div className="tool-layout">
      <div className="tool-form">
        <div className="field-grid two">
          <label>Value<input type="number" value={value} onChange={e => setValue(Number(e.target.value) || 0)} /></label>
          <label>Percentage (%)<input type="number" value={percent} onChange={e => setPercent(Number(e.target.value) || 0)} /></label>
        </div>
      </div>
      <ResultBox><p className="eyebrow">Result</p><div className="big-number">{result.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div><p className="muted">{percent}% of {value} = {result}</p></ResultBox>
    </div>
  );
}

function UnitConverter() {
  const [value, setValue] = useState(1);
  const [mode, setMode] = useState("km-mi");
  const conversions: Record<string, { label: string; factor: number }> = {
    "km-mi": { label: "miles", factor: 0.621371 },
    "mi-km": { label: "kilometres", factor: 1.609344 },
    "kg-lb": { label: "pounds", factor: 2.204623 },
    "lb-kg": { label: "kilograms", factor: 0.453592 },
  };
  const current = conversions[mode];
  return (
    <div className="tool-layout">
      <div className="tool-form"><div className="field-grid two"><label>Value<input type="number" value={value} onChange={e => setValue(Number(e.target.value) || 0)} /></label><label>Conversion<select value={mode} onChange={e => setMode(e.target.value)}><option value="km-mi">km → miles</option><option value="mi-km">miles → km</option><option value="kg-lb">kg → pounds</option><option value="lb-kg">pounds → kg</option></select></label></div></div>
      <ResultBox><p className="eyebrow">Converted value</p><div className="big-number">{(value * current.factor).toLocaleString("en-US", { maximumFractionDigits: 3 })}</div><p className="muted">{current.label}</p></ResultBox>
    </div>
  );
}

export function ToolRenderer({ slug, initialTravelBudget }: { slug: string; initialTravelBudget?: TravelBudgetInput }) {
  if (slug === "travel-budget-planner") return <TravelBudgetPlanner initialInput={initialTravelBudget} />;
  if (slug === "trip-packing-checklist") return <PackingChecklist />;
  if (slug === "percentage-calculator") return <PercentageCalculator />;
  if (slug === "unit-converter") return <UnitConverter />;
  return null;
}
