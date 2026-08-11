import { NextResponse } from "next/server";
import { getTrip, incrementTripMetric } from "@/lib/tripStore";

const allowedEvents = new Set(["views", "remix_started"] as const);
type MetricEvent = "views" | "remix_started";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { tripId?: string; event?: string };
    if (!body.tripId || !body.event || !allowedEvents.has(body.event as MetricEvent)) {
      return NextResponse.json({ ok: false, error: "invalid_metric" }, { status: 400 });
    }

    const trip = await getTrip(body.tripId);
    if (!trip) {
      return NextResponse.json({ ok: false, error: "trip_not_found" }, { status: 404 });
    }

    await incrementTripMetric(trip.id, body.event as MetricEvent);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "metric_failed" }, { status: 500 });
  }
}
