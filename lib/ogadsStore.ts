import { getRedisClient } from "@/lib/redisStore";

const pendingTtlSeconds = 3 * 60 * 60;
const verifiedTtlSeconds = 24 * 60 * 60;
const idPattern = /^[0-9a-f-]{36}$/i;

export type OgAdsConversionMetadata = {
  offerId?: string;
  payout?: string;
  ran?: string;
  sessionIp?: string;
  convertedAt: number;
};

function pendingKey(id: string) {
  return `ogads:pending:${id}`;
}

function verifiedKey(id: string) {
  return `ogads:verified:${id}`;
}

export function isValidOgAdsSessionId(id: string | null | undefined): id is string {
  return typeof id === "string" && idPattern.test(id);
}

export async function registerOgAdsSession(id: string) {
  if (!isValidOgAdsSessionId(id)) throw new Error("Invalid OGAds session id.");
  const redis = getRedisClient();
  await redis.set(pendingKey(id), { createdAt: Date.now() }, { ex: pendingTtlSeconds });
}

export async function verifyOgAdsSession(id: string, metadata: OgAdsConversionMetadata) {
  if (!isValidOgAdsSessionId(id)) return false;

  const redis = getRedisClient();
  const pending = await redis.get(pendingKey(id));
  if (!pending) return false;

  await redis.set(verifiedKey(id), metadata, { ex: verifiedTtlSeconds });
  await redis.del(pendingKey(id));
  return true;
}

export async function getOgAdsVerification(id: string) {
  if (!isValidOgAdsSessionId(id)) return null;
  const redis = getRedisClient();
  return redis.get<OgAdsConversionMetadata>(verifiedKey(id));
}
