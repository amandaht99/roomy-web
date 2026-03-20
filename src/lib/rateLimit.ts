import { NextRequest, NextResponse } from "next/server";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
  message: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_STORE_KEY = "__roomyRateLimitStore";
const RATE_LIMIT_CLEANUP_KEY = "__roomyRateLimitLastCleanup";
const CLEANUP_INTERVAL_MS = 60_000;

function getStore(): Map<string, RateLimitEntry> {
  const globalScope = globalThis as typeof globalThis & {
    [RATE_LIMIT_STORE_KEY]?: Map<string, RateLimitEntry>;
  };

  if (!globalScope[RATE_LIMIT_STORE_KEY]) {
    globalScope[RATE_LIMIT_STORE_KEY] = new Map<string, RateLimitEntry>();
  }

  return globalScope[RATE_LIMIT_STORE_KEY];
}

function cleanupExpiredEntries(now: number) {
  const globalScope = globalThis as typeof globalThis & {
    [RATE_LIMIT_CLEANUP_KEY]?: number;
  };
  const lastCleanup = globalScope[RATE_LIMIT_CLEANUP_KEY] ?? 0;

  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  const store = getStore();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }

  globalScope[RATE_LIMIT_CLEANUP_KEY] = now;
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}

export function enforceRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
): NextResponse | null {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const ip = getClientIp(request);
  const rateKey = `${options.key}:${ip}`;
  const store = getStore();
  const existing = store.get(rateKey);

  if (!existing || existing.resetAt <= now) {
    store.set(rateKey, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (existing.count >= options.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000),
    );

    return NextResponse.json(
      {
        error: `${options.message} Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(options.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(existing.resetAt / 1000)),
        },
      },
    );
  }

  existing.count += 1;
  store.set(rateKey, existing);
  return null;
}
