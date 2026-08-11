import { NextResponse } from "next/server";
import { createTripFork, getTrip } from "@/lib/tripStore";
import type { TravelBudgetInput } from "@/lib/travelBudget";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      parentTripId?: string;
      budget?: Partial<TravelBudgetInput>;
    };

    if (!body.parentTripId || !body.budget) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const parent = await getTrip(body.parentTripId);
    if (!parent) {
      return NextResponse.json({ ok: false, error: "trip_not_found" }, { status: 404 });
    }

    const child = await createTripFork(parent, body.budget);
    return NextResponse.json(
      { ok: true, tripId: child.id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "fork_failed" }, { status: 500 });
  }
}
