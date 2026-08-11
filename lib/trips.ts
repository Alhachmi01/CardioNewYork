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

export type TripCover = {
  url: string;
  alt: string;
  creditLabel?: string;
  creditUrl?: string;
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
  cover?: TripCover | null;
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
  cover: {
    url: "https://images.unsplash.com/photo-1512621450499-28dfc7415645?auto=format&fit=crop&w=1800&q=82",
    alt: "Lower Manhattan skyline across the water in New York City",
    creditLabel: "Photo by Goh Rhy Yan on Unsplash",
    creditUrl: "https://unsplash.com/photos/zmF9dinILOk",
  },
};

export const creatorDemoTrip: TripNode = {
  id: "demo-europe-christmas-markets-10-days",
  parentTripId: null,
  rootTripId: "demo-europe-christmas-markets-10-days",
  creatorSlug: "the-mobile-homie-preview",
  title: "10-Day European Christmas Markets — Planning Remix",
  budget: {
    destination: "European Christmas Markets",
    currency: "USD",
    days: 10,
    people: 1,
    rooms: 1,
    nightly: 85,
    flightsPerPerson: 900,
    foodPerPerson: 65,
    activitiesPerPerson: 0,
    localTransportPerDay: 7,
    insurancePerPerson: 0,
    misc: 400,
    bufferPct: 0,
    budgetTarget: 3250,
  },
  createdAt: 0,
  depth: 0,
  status: "private",
  demoAudience: null,
  planningNote:
    "Private GuideVexa planning demo normalized to one USD budget using round representative values anchored to the source's 2026 published ranges. The guide estimates $2,500–$4,000 total per person, $600–$1,200 for flights, €50–€100/night for accommodation, €35–€45/day for market food and drinks plus €15–€25/day for other meals, €200–€400 for intercity transport and €5–€8/day for local transit. This is not a claim of The Mobile Homie's actual spend and not a live quote.",
  source: {
    label: "The Mobile Homie’s 2026 European Christmas Markets itinerary",
    url: "https://themobilehomie.com/10-day-european-christmas-market-itinerary/",
  },
  cover: {
    url: "https://images.unsplash.com/photo-1761273075486-168b2e844a95?auto=format&fit=crop&w=1800&q=82",
    alt: "Christmas market lights and carousel in Vienna, Austria",
    creditLabel: "Photo by Jeffrey Zhang on Unsplash",
    creditUrl: "https://unsplash.com/photos/TDCrRmFLG9k",
  },
};

const staticTrips = new Map<string, TripNode>([
  [demoTrip.id, demoTrip],
  [creatorDemoTrip.id, creatorDemoTrip],
]);

export function getStaticTrip(id: string) {
  return staticTrips.get(id) ?? null;
}
