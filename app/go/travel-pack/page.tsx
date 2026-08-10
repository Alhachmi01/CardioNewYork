import { randomUUID } from "node:crypto";
import type { Metadata } from "next";
import { TravelPackLanding } from "@/components/TravelPackLanding";
import { parseTravelBudgetSearchParams, type TravelBudgetSearchParams } from "@/lib/travelBudget";

const description = "Turn your GuideVexa travel budget into a downloadable budget breakdown, packing starter and daily planner.";

export const metadata: Metadata = {
  title: "Complete Travel Pack",
  description,
  alternates: { canonical: "/go/travel-pack" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Your Complete Travel Pack — GuideVexa",
    description,
    url: "/go/travel-pack",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Your Complete Travel Pack — GuideVexa",
    description,
  },
};

type SearchParams = Promise<TravelBudgetSearchParams>;

export default async function TravelPackPage({ searchParams }: { searchParams: SearchParams }) {
  const input = parseTravelBudgetSearchParams(await searchParams);
  return <TravelPackLanding {...input} ogAdsSessionId={randomUUID()} />;
}
