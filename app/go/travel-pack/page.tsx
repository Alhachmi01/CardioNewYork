import type { Metadata } from "next";
import { TravelPackLanding } from "@/components/TravelPackLanding";

export const metadata: Metadata = {
  title: "Complete Travel Pack",
  description: "Turn your GuideVexa travel budget into a downloadable budget breakdown, packing starter and daily planner.",
  alternates: { canonical: "/go/travel-pack" },
  robots: { index: false, follow: true },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function numberParam(value: string | string[] | undefined, fallback: number) {
  const parsed = Number(one(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function currencyParam(value: string | string[] | undefined) {
  const candidate = one(value);
  const allowed = ["USD", "EUR", "GBP", "MAD", "CAD", "AUD"] as const;
  return allowed.includes(candidate as (typeof allowed)[number]) ? candidate as (typeof allowed)[number] : "USD";
}

export default async function TravelPackPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <TravelPackLanding
      destination={one(params.destination) || "Lisbon"}
      currency={currencyParam(params.currency)}
      days={Math.max(numberParam(params.days, 7), 1)}
      people={Math.max(numberParam(params.people, 2), 1)}
      rooms={Math.max(numberParam(params.rooms, 1), 1)}
      nightly={Math.max(numberParam(params.nightly, 90), 0)}
      flightsPerPerson={Math.max(numberParam(params.flightsPerPerson, 350), 0)}
      foodPerPerson={Math.max(numberParam(params.foodPerPerson, 35), 0)}
      activitiesPerPerson={Math.max(numberParam(params.activitiesPerPerson, 25), 0)}
      localTransportPerDay={Math.max(numberParam(params.localTransportPerDay, 25), 0)}
      insurancePerPerson={Math.max(numberParam(params.insurancePerPerson, 30), 0)}
      misc={Math.max(numberParam(params.misc, 80), 0)}
      bufferPct={Math.min(Math.max(numberParam(params.bufferPct, 10), 0), 100)}
    />
  );
}
