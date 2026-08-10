"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

function ResultBox({ children }: { children: ReactNode }) {
  return <div className="result-box">{children}</div>;
}

type CurrencyCode = "USD" | "EUR" | "GBP" | "MAD" | "CAD" | "AUD";

const currencyOptions: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "MAD", label: "MAD — Moroccan Dirham" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
];

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function trackToolEvent(name: string, detail: Record<string, string | number>) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("guidevexa:tool-event", { detail: { name, ...detail } }));

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, string | number>>;
  };
  analyticsWindow.dataLayer?.push({ event: name, ...detail });
}

function TravelBudgetPlanner() {
  const [destination, setDestination] = useState("Lisbon");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [days, setDays] = useState(7);
  const [people, setPeople] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [nightly, setNightly] = useState(90);
  const [flightsPerPerson, setFlightsPerPerson] = useState(350);
  const [foodPerPerson, setFoodPerPerson] = useState(35);
  const [activitiesPerPerson, setActivitiesPerPerson] = useState(25);
  const [localTransportPerDay, setLocalTransportPerDay] = useState(25);
  const [insurancePerPerson, setInsurancePerPerson] = useState(30);
  const [misc, setMisc] = useState(80);
  const [bufferPct, setBufferPct] = useState(10);
  const [budgetTarget, setBudgetTarget] = useState(2500);

  const totals = useMemo(() => {
    const safeDays = Math.max(days, 1);
    const safePeople = Math.max(people, 1);
    const nights = Math.max(safeDays - 1, 0);
    const flights = flightsPerPerson * safePeople;
    const lodging = nightly * nights * Math.max(rooms, 1);
    const food = foodPerPerson * safeDays * safePeople;
    const activities = activitiesPerPerson * safeDays * safePeople;
    const localTransport = localTransportPerDay * safeDays;
    const insurance = insurancePerPerson * safePeople;
    const subtotal = flights + lodging + food + activities + localTransport + insurance + misc;
    const buffer = subtotal * (Math.max(bufferPct, 0) / 100);
    const total = subtotal + buffer;

    return {
      nights,
      flights,
      lodging,
      food,
      activities,
      localTransport,
      insurance,
      subtotal,
      buffer,
      total,
      perPerson: total / safePeople,
      perDay: total / safeDays,
      targetDifference: budgetTarget > 0 ? budgetTarget - total : 0,
    };
  }, [
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
  ]);

  const downloadPlan = () => {
    trackToolEvent("travel_pack_download", {
      currency,
      days,
      travelers: people,
      estimated_total: Math.round(totals.total),
    });

    const packingStarter = [
      "Passport / ID and travel documents",
      "Payment card + backup payment method",
      "Phone charger / power bank",
      "Medication and basic health items",
      "Weather-appropriate clothing",
      "Comfortable walking shoes",
      "Reusable water bottle",
    ];

    const text = [
      "GUIDEVEXA — FULL TRAVEL PACK",
      "================================",
      `Destination: ${destination || "Not specified"}`,
      `Trip: ${days} days / ${totals.nights} nights`,
      `Travelers: ${people}`,
      `Currency: ${currency}`,
      "",
      "BUDGET BREAKDOWN",
      `Flights: ${formatMoney(totals.flights, currency)}`,
      `Lodging: ${formatMoney(totals.lodging, currency)}`,
      `Food: ${formatMoney(totals.food, currency)}`,
      `Activities: ${formatMoney(totals.activities, currency)}`,
      `Local transport: ${formatMoney(totals.localTransport, currency)}`,
      `Travel insurance: ${formatMoney(totals.insurance, currency)}`,
      `Other / miscellaneous: ${formatMoney(misc, currency)}`,
      `${bufferPct}% safety buffer: ${formatMoney(totals.buffer, currency)}`,
      `Estimated total: ${formatMoney(totals.total, currency)}`,
      `Per traveler: ${formatMoney(totals.perPerson, currency)}`,
      `Per day: ${formatMoney(totals.perDay, currency)}`,
      "",
      "PACKING STARTER",
      ...packingStarter.map(item => `- [ ] ${item}`),
      "",
      "NOTES",
      "This is a planning estimate, not a quote. Check current prices before booking.",
      "Generated with GuideVexa Travel Budget Planner.",
    ].join("\n");

    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "guidevexa-full-travel-pack.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const printPlan = () => {
    trackToolEvent("travel_budget_print", {
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
          <button className="button full-width" data-ogads-slot="travel-pack" onClick={downloadPlan}>Download full travel pack</button>
          <button className="button button-ghost full-width" onClick={printPlan}>Print budget</button>
        </div>
        <p className="helper-text compact-helper">Includes the full breakdown and a practical packing starter.</p>
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

export function ToolRenderer({ slug }: { slug: string }) {
  if (slug === "travel-budget-planner") return <TravelBudgetPlanner />;
  if (slug === "trip-packing-checklist") return <PackingChecklist />;
  if (slug === "percentage-calculator") return <PercentageCalculator />;
  if (slug === "unit-converter") return <UnitConverter />;
  return null;
}
