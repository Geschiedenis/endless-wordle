import { afterEach, describe, expect, it, vi } from "vitest";

async function load(client?: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", client ?? "");
  return import("./adsense");
}

afterEach(() => vi.unstubAllEnvs());

describe("AdSense setup", () => {
  it("writes the ads.txt line Google expects", async () => {
    const { adsTxt } = await load("ca-pub-1234567890123456");
    expect(adsTxt()).toBe("google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");
  });

  it("does nothing without a valid publisher ID", async () => {
    expect((await load()).adsTxt()).toBeNull();
    expect((await load("pub-123")).adsTxt()).toBeNull();
    expect((await load("ca-pub-12<script>")).ADSENSE_CLIENT).toBeUndefined();
  });
});
