import { describe, expect, it } from "vitest";
import { createGame } from "@/lib/game/engine";
import { openGameState, sealGameState } from "./token";

const SECRET = "test-secret-test-secret-test-secret";
const state = createGame("my-seed", "crane");

describe("game token", () => {
  it("round-trips state", () => {
    expect(openGameState(sealGameState(state, SECRET, 60), SECRET)).toEqual(state);
  });

  it("does not contain the answer or seed in a readable form", () => {
    const [, sealed] = sealGameState(state, SECRET, 60).split(".");
    const decoded = Buffer.from(sealed, "base64url").toString("latin1");
    expect(decoded).not.toContain("crane");
    expect(decoded).not.toContain("my-seed");
  });

  it("produces a different token each time", () => {
    expect(sealGameState(state, SECRET, 60)).not.toBe(sealGameState(state, SECRET, 60));
  });

  it("rejects a token opened with another secret", () => {
    expect(openGameState(sealGameState(state, SECRET, 60), "another-secret")).toBeNull();
  });

  it("rejects a tampered token, whichever byte changed", () => {
    const token = sealGameState(state, SECRET, 60);
    const [version, sealed] = token.split(".");
    const bytes = Buffer.from(sealed, "base64url");
    for (let i = 0; i < bytes.length; i++) {
      const copy = Buffer.from(bytes);
      copy[i] ^= 0xff;
      expect(openGameState(`${version}.${copy.toString("base64url")}`, SECRET)).toBeNull();
    }
  });

  it("rejects an expired token", () => {
    const now = 1_000_000;
    const token = sealGameState(state, SECRET, 60, now);
    expect(openGameState(token, SECRET, now + 59_000)).toEqual(state);
    expect(openGameState(token, SECRET, now + 60_000)).toBeNull();
  });

  it("rejects state that no longer fits the rules", () => {
    const stale = { ...state, bonusGuesses: 99 };
    expect(openGameState(sealGameState(stale, SECRET, 60), SECRET)).toBeNull();
  });

  it.each(["", "garbage", "v1.", "v1.abc", "v2.abc", "v1.abc.def"])("rejects %j", (token) => {
    expect(openGameState(token, SECRET)).toBeNull();
  });
});
