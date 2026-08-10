import type { Metadata } from "next";
import { TravelPackUnlocked } from "@/components/TravelPackUnlocked";

export const metadata: Metadata = {
  title: "Travel Pack Unlocked",
  description: "Download your unlocked GuideVexa travel pack.",
  alternates: { canonical: "/go/travel-pack/unlocked" },
  robots: { index: false, follow: false },
};

export default function TravelPackUnlockedPage() {
  return <TravelPackUnlocked />;
}
