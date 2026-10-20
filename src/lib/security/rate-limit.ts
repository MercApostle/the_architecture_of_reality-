/**
 * Edge-compatible In-Memory Sliding-Window Rate Limiter
 * 
 * Provides robust rate-limiting for Edge Middleware, API routes, and Server Actions
 * to prevent scraping, credential stuffing, and volumetric request flooding.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window cache (scoped per serverless/edge instance)
const rateLimitCache = new Map<string, RateLimitRecord>();

// Periodic garbage collection for memory hygiene
const PRUNE_INTERVAL_MS = 60_000;
let lastPrune = Date.now();

function pruneExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastPrune < PRUNE_INTERVAL_MS) return;
  lastPrune = now;

  const threshold = now - windowMs;
  for (const [key, record] of rateLimitCache.entries()) {
    const valid = record.timestamps.filter((t) => t > threshold);
    if (valid.length === 0) {
      rateLimitCache.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks if a given identifier exceeds the allowed rate limit within the time window.
 *
 * @param identifier Unique key (e.g., client IP or User ID + route key)
 * @param limit Maximum allowed requests within the window (default: 30)
 * @param windowMs Duration of sliding window in milliseconds (default: 60,000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  const threshold = now - windowMs;

  pruneExpired(windowMs);

  let record = rateLimitCache.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitCache.set(identifier, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((t) => t > threshold);

  const resetSeconds = Math.max(1, Math.ceil((record.timestamps[0] ? record.timestamps[0] + windowMs - now : windowMs) / 1000));

  if (record.timestamps.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds,
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - record.timestamps.length),
    resetSeconds,
  };
}

/**
 * Helper to generate standardized RateLimit headers.
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetSeconds.toString(),
    ...(result.success ? {} : { 'Retry-After': result.resetSeconds.toString() }),
  };
}
