import { Redis } from "@upstash/redis";

export function getRedisClient() {
  const url = process.env.KV_REST_API_URL;
  const credential = process.env.KV_REST_API_TOKEN;

  if (!url || !credential) {
    throw new Error("Redis environment variables are not configured.");
  }

  return new Redis({ url, token: credential, enableTelemetry: false });
}
