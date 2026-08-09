"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

function ResultBox({ children }: { children: ReactNode }) {
  return <div className="result-box">{children}</div>;
}

function TravelBudgetPlanner() {
  const [days, setDays] = useState(7);
  const [people, setPeople] = useState(2);
  const [nightly, setNightly] = useState(90);
  const [food, setFood] = useState(35);
  const [activities, setActivities] = useState(160);
  const [transport, setTransport] = useState(220);

  const totals = useMemo(() => {
    const lodging = nightly * Math.max(days - 1, 0);
    const meals = food * days * people;
    const subtotal = lodging + meals + activities + transport;
    return { lodging, meals, subtotal, buffer: subtotal * 0.1, total: subtotal * 1.1 };
  }, [days, people, nightly, food, activities, transport]);

  const downloadPlan = () => {
    const text = `GuideVexa Travel Budget\n\nDays: ${days}\nTravelers: ${people}\nLodging: $${totals.lodging.toFixed(0)}\nFood: $${totals.meals.toFixed(0)}\nActivities: $${activities}\nTransport: $${transport}\n10% buffer: $${totals.buffer.toFixed(0)}\nEstimated total: $${totals.total.toFixed(0)}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "guidevexa-travel-budget.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-layout">
      <div className="tool-form">
        <div className="field-grid">
          <label>Trip length (days)<input type="number" min="1" value={days} onChange={e => setDays(Number(e.target.value) || 1)} /></label>
          <label>Travelers<input type="number" min="1" value={people} onChange={e => setPeople(Number(e.target.value) || 1)} /></label>
          <label>Lodging / night ($)<input type="number" min="0" value={nightly} onChange={e => setNightly(Number(e.target.value) || 0)} /></label>
          <label>Food / person / day ($)<input type="number" min="0" value={food} onChange={e => setFood(Number(e.target.value) || 0)} /></label>
          <label>Activities total ($)<input type="number" min="0" value={activities} onChange={e => setActivities(Number(e.target.value) || 0)} /></label>
          <label>Transport total ($)<input type="number" min="0" value={transport} onChange={e => setTransport(Number(e.target.value) || 0)} /></label>
        </div>
      </div>
      <ResultBox>
        <p className="eyebrow">Estimated trip total</p>
        <div className="big-number">${totals.total.toFixed(0)}</div>
        <div className="breakdown">
          <div><span>Lodging</span><strong>${totals.lodging.toFixed(0)}</strong></div>
          <div><span>Food</span><strong>${totals.meals.toFixed(0)}</strong></div>
          <div><span>Activities</span><strong>${activities.toFixed(0)}</strong></div>
          <div><span>Transport</span><strong>${transport.toFixed(0)}</strong></div>
          <div><span>Safety buffer</span><strong>${totals.buffer.toFixed(0)}</strong></div>
        </div>
        <button className="button full-width" onClick={downloadPlan}>Download budget</button>
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
