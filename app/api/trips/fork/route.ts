import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redisStore";
import { createTripFork, getTrip } from "@/lib/tripStore";
import type { TravelBudgetInput } from "@/lib/travelBudget";

const RATE_LIMIT_MAX = 12;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

function clientFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const raw = forwarded || realIp || "unknown";

  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

async function checkForkRateLimit(request: Request) {
  const redis = getRedisClient();
  const key = `ratelimit:trip_fork:${clientFingerprint(request)}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
  }

  const ttl = await redis.ttl(key);
  return {
    allowed: count <= RATE_LIMIT_MAX,
    retryAfter: ttl > 0 ? ttl : RATE_LIMIT_WINDOW_SECONDS,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      parentTripId?: string;
      budget?: Partial<TravelBudgetInput>;
    };

    if (!body.parentTripId || !body.budget) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const rateLimit = await checkForkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        {
          status: 429,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
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
