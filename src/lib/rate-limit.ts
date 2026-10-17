/**
 * Best-effort in-memory rate limiter for public POST endpoints.
 *
 * On serverless (Vercel) every instance keeps its own counters, so this throttles
 * bursts per instance rather than enforcing a global quota. It is deliberately
 * dependency-free: a distributed store (Upstash / Redis / WAF) can be dropped in
 * later without touching the call sites.
 */

const buckets = new Map<string, number[]>();

/** Cap the map so a flood of distinct keys cannot grow memory without bound. */
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  /** Seconds the caller should wait before retrying (only set when `ok` is false). */
  retryAfter: number;
  /** Requests left in the current window. */
  remaining: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  let hits = buckets.get(key);

  if (!hits) {
    if (buckets.size >= MAX_KEYS) pruneStale(cutoff);
    hits = [];
  }

  const recent = hits.filter((t) => t > cutoff);

  if (recent.length >= limit) {
    buckets.set(key, recent);
    const retryAfter = Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
    return { ok: false, retryAfter, remaining: 0 };
  }

  recent.push(now);
  buckets.set(key, recent);
  return { ok: true, retryAfter: 0, remaining: limit - recent.length };
}

function pruneStale(cutoff: number) {
  for (const [key, hits] of buckets) {
    if (!hits.some((t) => t > cutoff)) buckets.delete(key);
  }
}

/** Client IP from proxy headers (Vercel sets `x-forwarded-for`), with a safe fallback. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
