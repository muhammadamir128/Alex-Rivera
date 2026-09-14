// Simple in-memory rate limiter (per-IP sliding window).
// Not suitable for multi-instance production; sufficient for single-instance deployments.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const CLEANUP_INTERVAL = 60_000;

// periodic cleanup
let lastCleanup = Date.now();
function maybeCleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  maybeCleanup(now);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, bucket);
    return { ok: true, remaining: limit - 1, resetAt: bucket.resetAt };
  }
  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }
  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

// Contact form: 5 messages per IP per hour
export function contactRateLimit(ip: string) {
  return rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
}

// Login: 10 attempts per IP per 15 minutes
export function loginRateLimit(ip: string) {
  return rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
}
