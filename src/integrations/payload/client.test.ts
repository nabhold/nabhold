import { afterEach, describe, expect, it, vi } from "vitest";

import { createPayloadContentGateway } from "./client";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

const portfolioListEnvelope = {
  docs: [
    {
      id: "1",
      slug: "zuribeans",
      name: "Zuribeans",
      summary: "A specialist green-coffee enterprise.",
    },
  ],
  totalDocs: 1,
  totalPages: 1,
  page: 1,
  limit: 100,
};

describe("PayloadCorporateContentGateway", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns Payload-sourced portfolio companies without the dev-fallback flag", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(portfolioListEnvelope),
    );

    const gateway = createPayloadContentGateway();
    const companies = await gateway.listPortfolioCompanies();

    expect(companies).toHaveLength(1);
    expect(companies[0].slug).toBe("zuribeans");
    expect(companies[0].devFallback).toBeUndefined();
  });

  it("degrades to an empty list when Payload has no portfolio collection and fallback is disabled", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.stubEnv("NABHOLD_CONTENT_DEV_FALLBACK", "false");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    const gateway = createPayloadContentGateway();
    const companies = await gateway.listPortfolioCompanies();

    expect(companies).toEqual([]);
  });

  it("uses the visibly-labelled dev fallback when explicitly enabled outside production", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NABHOLD_CONTENT_DEV_FALLBACK", "true");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    const gateway = createPayloadContentGateway();
    const companies = await gateway.listPortfolioCompanies();

    expect(companies.length).toBeGreaterThan(0);
    expect(companies.every((c) => c.devFallback)).toBe(true);
  });

  it("never uses the dev fallback in production even when the flag is set", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NABHOLD_CONTENT_DEV_FALLBACK", "true");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    const gateway = createPayloadContentGateway();
    const companies = await gateway.listPortfolioCompanies();

    expect(companies).toEqual([]);
  });

  it("returns null for a portfolio company that does not exist, without throwing", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 1 }),
    );

    const gateway = createPayloadContentGateway();
    await expect(gateway.getPortfolioCompany("unknown")).resolves.toBeNull();
  });

  it("falls back to estate defaults for the home page when Payload has no document", async () => {
    vi.stubEnv("PAYLOAD_BASE_URL", "https://cms.example.test");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    const gateway = createPayloadContentGateway();
    const home = await gateway.getHomePage();

    expect(home.headline).toBe("Built on conviction. Grown with purpose.");
  });
});
