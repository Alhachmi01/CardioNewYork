import type { TravelBudgetInput } from "@/lib/travelBudget";

export type TripVisibility = "private" | "unlisted" | "public";

export type DemoAudienceDemand = {
  cost: number | null;
  accommodation: number | null;
  itinerary: number | null;
};

export type TripSource = {
  label: string;
  url: string;
};

export type TripNode = {
  id: string;
  parentTripId: string | null;
  rootTripId: string;
  creatorSlug: string | null;
  title: string;
  budget: TravelBudgetInput;
  createdAt: number;
  depth: number;
  status: TripVisibility;
  demoAudience: DemoAudienceDemand | null;
  planningNote?: string;
  source?: TripSource | null;
};

export const demoTrip: TripNode = {
  id: "demo-nyc-7-days",
  parentTripId: null,
  rootTripId: "demo-nyc-7-days",
  creatorSlug: "guidevexa-demo",
  title: "7 Days in New York City",
  budget: {
    destination: "New York City",
    currency: "USD",
    days: 7,
    people: 1,
    rooms: 1,
    nightly: 165,
    flightsPerPerson: 450,
    foodPerPerson: 55,
    activitiesPerPerson: 45,
    localTransportPerDay: 18,
    insurancePerPerson: 50,
    misc: 114,
    bufferPct: 0,
    budgetTarget: 2500,
  },
  createdAt: 0,
  depth: 0,
  status: "private",
  demoAudience: {
    cost: null,
    accommodation: null,
    itinerary: null,
  },
  source: null,
};

export const arubaCreatorDemoTrip: TripNode = {
  id: "demo-aruba-5-days",
  parentTripId: null,
  rootTripId: "demo-aruba-5-days",
  creatorSlug: "creator-preview",
  title: "5 Days in Aruba — Planning Remix",
  budget: {
    destination: "Aruba",
    currency: "USD",
    days: 5,
    people: 1,
    rooms: 1,
    nightly: 250,
    flightsPerPerson: 0,
    foodPerPerson: 45,
    activitiesPerPerson: 100,
    localTransportPerDay: 40,
    insurancePerPerson: 0,
    misc: 20,
    bufferPct: 0,
    budgetTarget: 2000,
  },
  createdAt: 0,
  depth: 0,
  status: "private",
  demoAudience: null,
  planningNote:
    "Private planning demo based on representative values inside the source guide's published 2025 daily ranges: lodging $250/night, meals $45/day, activities $100/day and transport $40/day. Flights and insurance are excluded. This is not a claim of the creator's actual spend and not a live quote.",
  source: {
    label: "Public Aruba planning guide (2025)",
    url: "https://www.mariahdeola.com/post/aruba-travel-guide-how-to-plan-the-perfect-trip-budget-tips-recs",
  },
};

const staticTrips = new Map<string, TripNode>([
  [demoTrip.id, demoTrip],
  [arubaCreatorDemoTrip.id, arubaCreatorDemoTrip],
]);

export function getStaticTrip(id: string) {
  return staticTrips.get(id) ?? null;
}
