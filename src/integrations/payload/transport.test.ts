import { afterEach, describe, expect, it, vi } from "vitest";

import {
  fetchPayload,
  logPayloadOutcome,
  PayloadUnavailableError,
} from "./transport";

describe("Payload transport", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("reports not-configured (not an error) when Payload has no base URL", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "");

    const result = await fetchPayload("pages");

    expect(result).toEqual({ status: "not-configured" });
  });

  it("maps a 404 to not-found rather than an error", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    const result = await fetchPayload("portfolio-companies");

    expect(result.status).toBe("not-found");
  });

  it("maps transport failures to unavailable", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    const result = await fetchPayload("pages");

    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") {
      expect(result.error.message).toBe("Payload request failed");
    }
  });

  it("maps a non-2xx, non-404 response to unavailable", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const result = await fetchPayload("pages");

    expect(result.status).toBe("unavailable");
  });

  it("returns parsed JSON on success", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ docs: [] }), { status: 200 }),
    );

    const result = await fetchPayload("pages");

    expect(result).toEqual({ status: "ok", data: { docs: [] } });
  });
});

describe("logPayloadOutcome", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs at info level for an expected not-configured/not-found outcome", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    logPayloadOutcome({ status: "not-configured" }, { operation: "test" });
    logPayloadOutcome({ status: "not-found" }, { operation: "test" });

    expect(infoSpy).toHaveBeenCalledTimes(2);
  });

  it("logs at warn level for a genuine transport failure", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    logPayloadOutcome(
      {
        status: "unavailable",
        error: new PayloadUnavailableError("boom"),
      },
      { operation: "test" },
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("does not log for an ok outcome", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    logPayloadOutcome({ status: "ok", data: {} }, { operation: "test" });

    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
