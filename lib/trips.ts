import type { TravelBudgetInput } from "@/lib/travelBudget";

export type TripVisibility = "private" | "unlisted" | "public";

export type DemoAudienceDemand = {
  cost: number | null;
  accommodation: number | null;
  itinerary: number | null;
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
};

export function getStaticTrip(id: string) {
  return id === demoTrip.id ? demoTrip : null;
}
