import {
  calculateTravelBudget,
  formatMoney,
  normalizeTravelBudgetInput,
  type TravelBudgetInput,
} from "@/lib/travelBudget";

export const travelPackSessionKey = "guidevexa:travel-pack:v1";
const sessionMaxAgeMs = 24 * 60 * 60 * 1000;

type StoredTravelPack = {
  input: TravelBudgetInput;
  savedAt: number;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export function saveTravelPackSession(input: TravelBudgetInput) {
  if (typeof window === "undefined") return;

  const payload: StoredTravelPack = {
    input: normalizeTravelBudgetInput(input),
    savedAt: Date.now(),
  };

  window.sessionStorage.setItem(travelPackSessionKey, JSON.stringify(payload));
}

export function readTravelPackSession(): TravelBudgetInput | null {
  if (typeof window === "undefined") return null;

  const raw = window.sessionStorage.getItem(travelPackSessionKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredTravelPack>;
    if (!parsed.input || typeof parsed.savedAt !== "number") return null;

    if (Date.now() - parsed.savedAt > sessionMaxAgeMs) {
      window.sessionStorage.removeItem(travelPackSessionKey);
      return null;
    }

    return normalizeTravelBudgetInput(parsed.input);
  } catch {
    window.sessionStorage.removeItem(travelPackSessionKey);
    return null;
  }
}

export function downloadTravelPack(input: TravelBudgetInput) {
  if (typeof window === "undefined") return;

  const safeInput = normalizeTravelBudgetInput(input);
  const totals = calculateTravelBudget(safeInput);
  const { days, people, currency } = safeInput;
  const destination = escapeHtml(safeInput.destination || "Your trip");
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
<p class="meta">${destination} · ${days} days · ${people} traveler${people === 1 ? "" : "s"} · ${currency}</p>
<div class="grid">
<div class="card"><small>Estimated total</small><strong>${formatMoney(totals.total, currency)}</strong></div>
<div class="card"><small>Per traveler</small><strong>${formatMoney(totals.perPerson, currency)}</strong></div>
<div class="card"><small>Per day</small><strong>${formatMoney(totals.perDay, currency)}</strong></div>
</div>
<h2>Budget breakdown</h2>
<table class="rows"><tbody>
<tr><td>Flights</td><td>${formatMoney(totals.flights, currency)}</td></tr>
<tr><td>Lodging</td><td>${formatMoney(totals.lodging, currency)}</td></tr>
<tr><td>Food</td><td>${formatMoney(totals.food, currency)}</td></tr>
<tr><td>Activities</td><td>${formatMoney(totals.activities, currency)}</td></tr>
<tr><td>Local transport</td><td>${formatMoney(totals.localTransport, currency)}</td></tr>
<tr><td>Travel insurance</td><td>${formatMoney(totals.insurance, currency)}</td></tr>
<tr><td>Other / miscellaneous</td><td>${formatMoney(safeInput.misc, currency)}</td></tr>
<tr><td>${safeInput.bufferPct}% safety buffer</td><td>${formatMoney(totals.buffer, currency)}</td></tr>
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
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
