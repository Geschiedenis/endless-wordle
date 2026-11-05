export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets. Meaningful when not allowed. */
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

/**
 * Fixed-window counter held in memory.
 *
 * On Vercel each server instance has its own counts, and they reset when an
 * instance is recycled, so this slows abuse rather than enforcing a hard global
 * limit. For a strict limit, implement RateLimiter on a shared store (for
 * example Upstash Redis). Route handlers only depend on the interface.
 */
export function createMemoryRateLimiter(options: {
  limit: number;
  windowMs: number;
  /** Bounds memory when many different keys appear. */
  maxKeys?: number;
  now?: () => number;
}): RateLimiter {
  const { limit, windowMs, maxKeys = 10_000, now = Date.now } = options;
  const windows = new Map<string, { count: number; resetAt: number }>();

  function makeRoom(time: number) {
    for (const [key, window] of windows) {
      if (window.resetAt <= time) windows.delete(key);
    }
    // Still full of live windows: drop the oldest. Maps iterate in insert order.
    while (windows.size >= maxKeys) {
      windows.delete(windows.keys().next().value as string);
    }
  }

  return {
    check(key) {
      const time = now();
      let window = windows.get(key);

      if (!window || window.resetAt <= time) {
        windows.delete(key);
        if (windows.size >= maxKeys) makeRoom(time);
        window = { count: 0, resetAt: time + windowMs };
        windows.set(key, window);
      }

      window.count += 1;
      return {
        allowed: window.count <= limit,
        retryAfterSeconds: Math.ceil((window.resetAt - time) / 1000),
      };
    },
  };
}
