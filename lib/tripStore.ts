import { randomUUID } from "node:crypto";
import { getRedisClient } from "@/lib/redisStore";
import { normalizeTravelBudgetInput, type TravelBudgetInput } from "@/lib/travelBudget";
import { getStaticTrip, type TripNode } from "@/lib/trips";

const tripIdPattern = /^[0-9a-f-]{36}$/i;

function tripKey(id: string) {
  return `trip:${id}`;
}

function childrenKey(id: string) {
  return `trip:${id}:children`;
}

function metricKey(metric: string, id: string) {
  return `counter:${metric}:${id}`;
}

function rootForkCountKey(rootId: string) {
  return `root:${rootId}:fork_count`;
}

export async function getTrip(id: string): Promise<TripNode | null> {
  const staticTrip = getStaticTrip(id);
  if (staticTrip) return staticTrip;
  if (!tripIdPattern.test(id)) return null;

  const redis = getRedisClient();
  return redis.get<TripNode>(tripKey(id));
}

export async function incrementTripMetric(id: string, metric: "views" | "remix_started") {
  const redis = getRedisClient();
  return redis.incr(metricKey(metric, id));
}

export async function createTripFork(parent: TripNode, submittedBudget: Partial<TravelBudgetInput>): Promise<TripNode> {
  const candidate = normalizeTravelBudgetInput(submittedBudget);
  const id = randomUUID();

  // V0 comparisons are only meaningful when the trip itself stays fixed.
  // The server enforces these locks even if a client tampers with the request.
  const budget: TravelBudgetInput = {
    ...candidate,
    destination: parent.budget.destination,
    currency: parent.budget.currency,
    days: parent.budget.days,
    people: parent.budget.people,
    rooms: parent.budget.rooms,
    budgetTarget: parent.budget.budgetTarget,
  };

  const child: TripNode = {
    id,
    parentTripId: parent.id,
    rootTripId: parent.rootTripId,
    creatorSlug: parent.creatorSlug,
    title: `${parent.budget.destination} remix`,
    budget,
    createdAt: Date.now(),
    depth: parent.depth + 1,
    status: "unlisted",
    demoAudience: null,
    planningNote: parent.planningNote,
    source: parent.source ?? null,
    cover: parent.cover ?? null,
  };

  const redis = getRedisClient();
  await Promise.all([
    redis.set(tripKey(id), child),
    redis.sadd(childrenKey(parent.id), id),
    redis.incr(metricKey("remix_saved", parent.id)),
    redis.incr(metricKey("child_forks", parent.id)),
    redis.incr(rootForkCountKey(parent.rootTripId)),
  ]);

  return child;
}
