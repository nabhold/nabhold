import { afterEach, describe, expect, it, vi } from "vitest";

import { getExecutiveOverview, PulseUnavailableError } from "./client";

describe("Pulse client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("requires server-side API configuration", async () => {
    vi.stubEnv("BAOBAB_PULSE_API_URL", "");
    vi.stubEnv("BAOBAB_PULSE_API_TOKEN", "");

    await expect(getExecutiveOverview()).rejects.toBeInstanceOf(
      PulseUnavailableError,
    );
  });

  it("maps transport failures to service unavailability", async () => {
    vi.stubEnv("BAOBAB_PULSE_API_URL", "https://pulse.example.test");
    vi.stubEnv("BAOBAB_PULSE_API_TOKEN", "test-token");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    await expect(getExecutiveOverview()).rejects.toMatchObject({
      name: "PulseUnavailableError",
      message: "Pulse request failed",
    });
  });

  it("validates a successful response", async () => {
    vi.stubEnv("BAOBAB_PULSE_API_URL", "https://pulse.example.test");
    vi.stubEnv("BAOBAB_PULSE_API_TOKEN", "test-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          generatedAt: "2026-08-30T00:00:00Z",
          signals: [],
          opportunities: [],
        }),
        { status: 200 },
      ),
    );

    await expect(getExecutiveOverview()).resolves.toEqual({
      generatedAt: "2026-08-30T00:00:00Z",
      signals: [],
      opportunities: [],
    });
  });
});
