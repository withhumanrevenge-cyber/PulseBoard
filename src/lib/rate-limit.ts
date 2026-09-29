// Fixed-window rate limiter. Uses Upstash Redis (REST) when configured so limits
// hold across serverless instances; otherwise falls back to per-instance memory,
// which is fine for local dev but NOT a real limit in production.

import { headers } from "next/headers";

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, limit: number, windowMs: number, now: number): RateLimitResult {
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  }
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  entry.count++;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt };
}

async function upstashHit(
  key: string,
  limit: number,
  windowMs: number,
  now: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const bucket = Math.floor(now / windowMs);
  const redisKey = `rl:${key}:${bucket}`;
  const resetAt = (bucket + 1) * windowMs;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["PEXPIRE", redisKey, String(windowMs)],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result?: number }>;
    const count = Number(data[0]?.result ?? 0);
    return { ok: count <= limit, remaining: Math.max(0, limit - count), resetAt };
  } catch {
    // Fail open: a Redis outage should not take the product down.
    return null;
  }
}

export async function rateLimit(
  key: string,
  opts: { limit: number; windowSec: number }
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = opts.windowSec * 1000;
  return (await upstashHit(key, opts.limit, windowMs, now)) ?? memoryHit(key, opts.limit, windowMs, now);
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "anon";
}

export function ipFromRequest(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}
