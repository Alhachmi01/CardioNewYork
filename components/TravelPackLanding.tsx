"use client";

import Link from "next/link";

type TravelPackInput = {
  destination: string;
  currency: "USD" | "EUR" | "GBP" | "MAD" | "CAD" | "AUD";
  days: number;
  people: number;
  rooms: number;
  nightly: number;
  flightsPerPerson: number;
  foodPerPerson: number;
  activitiesPerPerson: number;
  localTransportPerDay: number;
  insurancePerPerson: number;
  misc: number;
  bufferPct: number;
};

function formatMoney(value: number, currency: TravelPackInput["currency"]) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export function TravelPackLanding(input: TravelPackInput) {
  const days = Math.max(input.days, 1);
  const people = Math.max(input.people, 1);
  const rooms = Math.max(input.rooms, 1);
  const nights = Math.max(days - 1, 0);

  const flights = input.flightsPerPerson * people;
  const lodging = input.nightly * nights * rooms;
  const food = input.foodPerPerson * days * people;
  const activities = input.activitiesPerPerson * days * people;
  const localTransport = input.localTransportPerDay * days;
  const insurance = input.insurancePerPerson * people;
  const subtotal = flights + lodging + food + activities + localTransport + insurance + input.misc;
  const buffer = subtotal * (Math.max(input.bufferPct, 0) / 100);
  const total = subtotal + buffer;
  const perPerson = total / people;
  const perDay = total / days;

  const downloadPack = () => {
    window.dispatchEvent(new CustomEvent("guidevexa:tool-event", {
      detail: {
        name: "travel_pack_lp_download",
        currency: input.currency,
        days,
        travelers: people,
        estimated_total: Math.round(total),
      },
    }));

    const analyticsWindow = window as Window & {
      dataLayer?: Array<Record<string, string | number>>;
    };
    analyticsWindow.dataLayer?.push({
      event: "travel_pack_lp_download",
      currency: input.currency,
      days,
      travelers: people,
      estimated_total: Math.round(total),
    });

    const destination = escapeHtml(input.destination || "Your trip");
    const plannerRows = Array.from({ length: Math.min(days, 60) }, (_, index) => (
      `<tr><td>Day ${index + 1}</td><td></td><td></td><td></td></tr>`
    )).join("");

    const packHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>GuideVexa Travel Pack — ${destination}</title>
<style>
body{font-family:Arial,sans-serif;max-width:860px;margin:40px auto;padding:0 22px;color:#172033;line-height:1.5}h1{font-size:32px;margin-bottom:6px}h2{margin-top:34px;border-bottom:1px solid #d8deea;padding-bottom:8px}.meta{color:#657086}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.card{border:1px solid #d8deea;border-radius:10px;padding:14px}.card small{display:block;color:#657086}.card strong{font-size:20px}.rows{width:100%;border-collapse:collapse}.rows td,.rows th{border:1px solid #d8deea;padding:9px;text-align:left}.check{margin:7px 0}.note{margin-top:30px;padding:14px;background:#f3f5f9;border-radius:10px;color:#4b5565}@media(max-width:620px){.grid{grid-template-columns:1fr}.rows{font-size:12px}}
</style>
</head>
<body>
<h1>GuideVexa Complete Travel Pack</h1>
<p class="meta">${destination} · ${days} days · ${people} traveler${people === 1 ? "" : "s"} · ${input.currency}</p>
<div class="grid">
<div class="card"><small>Estimated total</small><strong>${formatMoney(total, input.currency)}</strong></div>
<div class="card"><small>Per traveler</small><strong>${formatMoney(perPerson, input.currency)}</strong></div>
<div class="card"><small>Per day</small><strong>${formatMoney(perDay, input.currency)}</strong></div>
</div>
<h2>Budget breakdown</h2>
<table class="rows"><tbody>
<tr><td>Flights</td><td>${formatMoney(flights, input.currency)}</td></tr>
<tr><td>Lodging</td><td>${formatMoney(lodging, input.currency)}</td></tr>
<tr><td>Food</td><td>${formatMoney(food, input.currency)}</td></tr>
<tr><td>Activities</td><td>${formatMoney(activities, input.currency)}</td></tr>
<tr><td>Local transport</td><td>${formatMoney(localTransport, input.currency)}</td></tr>
<tr><td>Travel insurance</td><td>${formatMoney(insurance, input.currency)}</td></tr>
<tr><td>Other / miscellaneous</td><td>${formatMoney(input.misc, input.currency)}</td></tr>
<tr><td>${input.bufferPct}% safety buffer</td><td>${formatMoney(buffer, input.currency)}</td></tr>
</tbody></table>
<h2>Packing starter</h2>
<p class="check">☐ Passport / ID and travel documents</p>
<p class="check">☐ Payment card + backup payment method</p>
<p class="check">☐ Phone charger / power bank</p>
<p class="check">☐ Medication and basic health items</p>
<p class="check">☐ Weather-appropriate clothing</p>
<p class="check">☐ Comfortable walking shoes</p>
<p class="check">☐ Reusable water bottle</p>
<h2>Daily planner</h2>
<table class="rows"><thead><tr><th>Day</th><th>Main plan</th><th>Bookings</th><th>Notes / spend</th></tr></thead><tbody>${plannerRows}</tbody></table>
<p class="note">Planning estimate only. Recheck current fares, hotel rates, exchange rates and entry requirements before booking.</p>
</body>
</html>`;

    const url = URL.createObjectURL(new Blob([packHtml], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "guidevexa-complete-travel-pack.html";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="landing-page">
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

          <button id="get-pack" className="button landing-primary-cta" data-ogads-slot="travel-pack" onClick={downloadPack}>
            Download my travel pack
          </button>
          <p className="landing-cta-note">Built from your planner inputs. No account required in the current V1.</p>
          <Link className="landing-back-link" href="/tools/travel-budget-planner">← Edit my budget first</Link>
        </div>

        <div className="travel-pack-preview" aria-label="Preview of your GuideVexa travel pack">
          <div className="preview-sheet">
            <div className="preview-sheet-brand">GuideVexa Travel Pack</div>
            <h2>{input.destination || "Your trip"}</h2>
            <p>{days} days · {people} traveler{people === 1 ? "" : "s"}</p>
            <div className="preview-total"><span>Estimated total</span><strong>{formatMoney(total, input.currency)}</strong></div>
            <div className="preview-mini-grid">
              <div><span>Per traveler</span><strong>{formatMoney(perPerson, input.currency)}</strong></div>
              <div><span>Per day</span><strong>{formatMoney(perDay, input.currency)}</strong></div>
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
          <li><strong>3. Download and personalise</strong><span>Save the pack, open it in your browser and print it or add your own notes.</span></li>
        </ol>
      </section>

      <section className="landing-section landing-faq shell">
        <div className="landing-section-heading"><h2>Frequently asked questions</h2></div>
        <details><summary>Is the travel pack a live booking quote?</summary><p>No. It is a planning resource based on the numbers you entered. Recheck live prices before booking.</p></details>
        <details><summary>Do I need an account?</summary><p>No account is required for the current V1 travel-pack download.</p></details>
        <details><summary>What format do I receive?</summary><p>The current pack downloads as a self-contained HTML document that you can open in a browser and print or save as PDF.</p></details>
      </section>

      <section className="landing-final-cta shell">
        <h2>Keep your trip plan in one place.</h2>
        <p>Download the pack built from the budget you already created.</p>
        <button className="button landing-primary-cta" data-ogads-slot="travel-pack" onClick={downloadPack}>Download my travel pack</button>
      </section>
    </div>
  );
}
