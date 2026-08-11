import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TravelBudgetPlanner } from "@/components/TravelBudgetPlanner";
import { TripViewTracker } from "@/components/TripViewTracker";
import { calculateTravelBudget, formatMoney } from "@/lib/travelBudget";
import { getTrip } from "@/lib/tripStore";
import type { DemoAudienceDemand } from "@/lib/trips";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const lockedFields = ["destination", "currency", "days", "people", "rooms", "budgetTarget"] as const;

function audienceItems(demand: DemoAudienceDemand) {
  return [
    { label: "Total cost", count: demand.cost },
    { label: "Accommodation", count: demand.accommodation },
    { label: "Itinerary", count: demand.itinerary },
  ];
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function sanitizePreviewName(value: string | string[] | undefined) {
  const raw = one(value)?.trim();
  if (!raw) return null;

  const cleaned = raw.replace(/[^\p{L}\p{N} .'-]/gu, "").slice(0, 40).trim();
  return cleaned || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) return { title: "Trip not found" };

  return {
    title: `${trip.title} — Remix this trip`,
    description: `Fork this ${trip.budget.days}-day ${trip.budget.destination} trip and compare your budget with the original.`,
    robots: trip.status === "public"
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true },
    openGraph: trip.cover
      ? {
          title: `${trip.title} — Remix this trip`,
          description: `Fork this ${trip.budget.days}-day ${trip.budget.destination} trip and compare your budget with the original.`,
          images: [{ url: trip.cover.url, alt: trip.cover.alt }],
        }
      : undefined,
  };
}

export default async function TripPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const trip = await getTrip(slug);
  if (!trip) notFound();

  const parent = trip.parentTripId ? await getTrip(trip.parentTripId) : null;
  const lineageComparisonBudget = parent?.budget ?? trip.budget;
  const lineageComparisonTotals = calculateTravelBudget(lineageComparisonBudget);
  const justSaved = query.saved === "1";
  const previewFor = trip.status === "private" ? sanitizePreviewName(query.previewFor) : null;
  const demand = trip.demoAudience;
  const demandRows = demand ? audienceItems(demand) : [];
  const hasVerifiedCounts = demandRows.some(item => typeof item.count === "number");

  return (
    <section className="page shell">
      <TripViewTracker tripId={trip.id} />

      <div className="breadcrumbs">
        <Link href="/">Home</Link><span>/</span><span>Trips</span><span>/</span><span>{trip.budget.destination}</span>
      </div>

      {trip.cover ? (
        <figure className={styles.cover}>
          <Image
            src={trip.cover.url}
            alt={trip.cover.alt}
            width={1800}
            height={1000}
            sizes="(max-width: 760px) 100vw, 1120px"
            priority={trip.depth === 0}
            className={styles.coverImage}
          />
          {trip.cover.creditLabel && trip.cover.creditUrl ? (
            <a className={styles.coverCredit} href={trip.cover.creditUrl} target="_blank" rel="noreferrer">
              {trip.cover.creditLabel}
            </a>
          ) : null}
        </figure>
      ) : null}

      {justSaved ? (
        <p className={styles.saved}>Saved. This is your new immutable fork — you can remix it again without changing its parent.</p>
      ) : null}

      <div className={styles.intro}>
        <div>
          <h1>{trip.title}</h1>
          <p>
            Start from this exact trip, keep the destination and duration fixed, then change the cost choices to make a cheaper or more comfortable version.
          </p>
          {previewFor ? (
            <p className="muted">Private preview prepared for <strong>{previewFor}</strong>.</p>
          ) : null}
          {trip.planningNote ? (
            <p className="muted">{trip.planningNote}</p>
          ) : null}
          <div className={styles.lineage}>
            <span>Depth {trip.depth}</span>
            <span>Root {trip.rootTripId}</span>
            {trip.parentTripId ? <span>Forked from {trip.parentTripId}</span> : <span>Original trip</span>}
          </div>
        </div>
        <div className={styles.originalTotal}>
          <span>{trip.parentTripId ? "Parent version" : "Original budget"}</span>
          <strong>{formatMoney(lineageComparisonTotals.total, lineageComparisonBudget.currency)}</strong>
        </div>
      </div>

      {trip.source ? (
        <aside className={styles.sourceCard} aria-label="Source and attribution">
          <div className={styles.sourceCopy}>
            <span>Source & attribution</span>
            <strong>Based on {trip.source.label}</strong>
            <small>GuideVexa created this independent interactive planning version. No partnership or endorsement is implied.</small>
          </div>
          <a className={styles.sourceLink} href={trip.source.url} target="_blank" rel="noreferrer">
            View original guide ↗
          </a>
        </aside>
      ) : null}

      {demand ? (
        <div className={styles.demand}>
          <h2>Audience demand replay</h2>
          <p>
            {hasVerifiedCounts
              ? "These counts come from manually verified recurring questions for this creator preview."
              : "Demo mode: real creator previews will show only manually verified audience themes and counts here."}
          </p>
          <div className={styles.demandGrid}>
            {demandRows.map(item => (
              <div className={styles.demandItem} key={item.label}>
                <span>{item.label}</span>
                <small>{typeof item.count === "number" ? `${item.count} verified questions` : "Verified theme placeholder"}</small>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <TravelBudgetPlanner
        initialBudget={trip.budget}
        originalBudget={trip.budget}
        lockedFields={lockedFields}
        mode="remix"
        parentTripId={trip.id}
      />
    </section>
  );
}
