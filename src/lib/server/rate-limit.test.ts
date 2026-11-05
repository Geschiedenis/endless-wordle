import { describe, expect, it } from "vitest";
import { createMemoryRateLimiter } from "./rate-limit";

function setup(limit = 2, maxKeys?: number) {
  let time = 0;
  const limiter = createMemoryRateLimiter({ limit, windowMs: 1000, maxKeys, now: () => time });
  return { limiter, advance: (ms: number) => (time += ms) };
}

describe("createMemoryRateLimiter", () => {
  it("allows up to the limit, then blocks", () => {
    const { limiter } = setup();
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("tracks keys separately", () => {
    const { limiter } = setup(1);
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("b").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("resets after the window", () => {
    const { limiter, advance } = setup(1);
    limiter.check("a");
    expect(limiter.check("a").allowed).toBe(false);
    advance(1000);
    expect(limiter.check("a").allowed).toBe(true);
  });

  it("reports when to retry", () => {
    const { limiter, advance } = setup(1);
    limiter.check("a");
    advance(400);
    expect(limiter.check("a").retryAfterSeconds).toBe(1);
  });

  it("stays bounded when many keys appear", () => {
    const { limiter } = setup(1, 2);
    limiter.check("a");
    limiter.check("b");
    limiter.check("c");
    // "a" was evicted to make room, so it starts a fresh window.
    expect(limiter.check("a").allowed).toBe(true);
  });
});
