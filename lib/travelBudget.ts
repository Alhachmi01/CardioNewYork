export const currencyCodes = ["USD", "EUR", "GBP", "MAD", "CAD", "AUD"] as const;

export type CurrencyCode = (typeof currencyCodes)[number];

export type TravelBudgetInput = {
  destination: string;
  currency: CurrencyCode;
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
  budgetTarget: number;
};

export type TravelBudgetSearchParams = Record<string, string | string[] | undefined>;

export type TravelBudgetTotals = {
  nights: number;
  flights: number;
  lodging: number;
  food: number;
  activities: number;
  localTransport: number;
  insurance: number;
  subtotal: number;
  buffer: number;
  total: number;
  perPerson: number;
  perDay: number;
  targetDifference: number;
};

export const defaultTravelBudgetInput: TravelBudgetInput = {
  destination: "Lisbon",
  currency: "USD",
  days: 7,
  people: 2,
  rooms: 1,
  nightly: 90,
  flightsPerPerson: 350,
  foodPerPerson: 35,
  activitiesPerPerson: 25,
  localTransportPerDay: 25,
  insurancePerPerson: 30,
  misc: 80,
  bufferPct: 10,
  budgetTarget: 2500,
};

const financialMax = 1_000_000_000;

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function numberParam(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(one(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCurrency(value: unknown): CurrencyCode {
  return currencyCodes.includes(value as CurrencyCode) ? value as CurrencyCode : defaultTravelBudgetInput.currency;
}

export function normalizeTravelBudgetInput(input: Partial<TravelBudgetInput>): TravelBudgetInput {
  return {
    destination: String(input.destination ?? defaultTravelBudgetInput.destination).slice(0, 80),
    currency: normalizeCurrency(input.currency),
    days: clamp(Number(input.days ?? defaultTravelBudgetInput.days), 1, 365),
    people: clamp(Number(input.people ?? defaultTravelBudgetInput.people), 1, 50),
    rooms: clamp(Number(input.rooms ?? defaultTravelBudgetInput.rooms), 1, 20),
    nightly: clamp(Number(input.nightly ?? defaultTravelBudgetInput.nightly), 0, financialMax),
    flightsPerPerson: clamp(Number(input.flightsPerPerson ?? defaultTravelBudgetInput.flightsPerPerson), 0, financialMax),
    foodPerPerson: clamp(Number(input.foodPerPerson ?? defaultTravelBudgetInput.foodPerPerson), 0, financialMax),
    activitiesPerPerson: clamp(Number(input.activitiesPerPerson ?? defaultTravelBudgetInput.activitiesPerPerson), 0, financialMax),
    localTransportPerDay: clamp(Number(input.localTransportPerDay ?? defaultTravelBudgetInput.localTransportPerDay), 0, financialMax),
    insurancePerPerson: clamp(Number(input.insurancePerPerson ?? defaultTravelBudgetInput.insurancePerPerson), 0, financialMax),
    misc: clamp(Number(input.misc ?? defaultTravelBudgetInput.misc), 0, financialMax),
    bufferPct: clamp(Number(input.bufferPct ?? defaultTravelBudgetInput.bufferPct), 0, 100),
    budgetTarget: clamp(Number(input.budgetTarget ?? defaultTravelBudgetInput.budgetTarget), 0, financialMax),
  };
}

export function parseTravelBudgetSearchParams(params: TravelBudgetSearchParams): TravelBudgetInput {
  return normalizeTravelBudgetInput({
    destination: one(params.destination) ?? defaultTravelBudgetInput.destination,
    currency: normalizeCurrency(one(params.currency)),
    days: numberParam(params.days, defaultTravelBudgetInput.days),
    people: numberParam(params.people, defaultTravelBudgetInput.people),
    rooms: numberParam(params.rooms, defaultTravelBudgetInput.rooms),
    nightly: numberParam(params.nightly, defaultTravelBudgetInput.nightly),
    flightsPerPerson: numberParam(params.flightsPerPerson, defaultTravelBudgetInput.flightsPerPerson),
    foodPerPerson: numberParam(params.foodPerPerson, defaultTravelBudgetInput.foodPerPerson),
    activitiesPerPerson: numberParam(params.activitiesPerPerson, defaultTravelBudgetInput.activitiesPerPerson),
    localTransportPerDay: numberParam(params.localTransportPerDay, defaultTravelBudgetInput.localTransportPerDay),
    insurancePerPerson: numberParam(params.insurancePerPerson, defaultTravelBudgetInput.insurancePerPerson),
    misc: numberParam(params.misc, defaultTravelBudgetInput.misc),
    bufferPct: numberParam(params.bufferPct, defaultTravelBudgetInput.bufferPct),
    budgetTarget: numberParam(params.budgetTarget, defaultTravelBudgetInput.budgetTarget),
  });
}

export function calculateTravelBudget(input: TravelBudgetInput): TravelBudgetTotals {
  const safe = normalizeTravelBudgetInput(input);
  const nights = Math.max(safe.days - 1, 0);
  const flights = safe.flightsPerPerson * safe.people;
  const lodging = safe.nightly * nights * safe.rooms;
  const food = safe.foodPerPerson * safe.days * safe.people;
  const activities = safe.activitiesPerPerson * safe.days * safe.people;
  const localTransport = safe.localTransportPerDay * safe.days;
  const insurance = safe.insurancePerPerson * safe.people;
  const subtotal = flights + lodging + food + activities + localTransport + insurance + safe.misc;
  const buffer = subtotal * (safe.bufferPct / 100);
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
    perPerson: total / safe.people,
    perDay: total / safe.days,
    targetDifference: safe.budgetTarget > 0 ? safe.budgetTarget - total : 0,
  };
}

export function buildTravelBudgetQuery(input: TravelBudgetInput) {
  const safe = normalizeTravelBudgetInput(input);
  return new URLSearchParams({
    destination: safe.destination,
    currency: safe.currency,
    days: String(safe.days),
    people: String(safe.people),
    rooms: String(safe.rooms),
    nightly: String(safe.nightly),
    flightsPerPerson: String(safe.flightsPerPerson),
    foodPerPerson: String(safe.foodPerPerson),
    activitiesPerPerson: String(safe.activitiesPerPerson),
    localTransportPerDay: String(safe.localTransportPerDay),
    insurancePerPerson: String(safe.insurancePerPerson),
    misc: String(safe.misc),
    bufferPct: String(safe.bufferPct),
    budgetTarget: String(safe.budgetTarget),
  }).toString();
}

export function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}
