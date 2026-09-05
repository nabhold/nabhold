import { describe, expect, it } from "vitest";

import { portfolioCompanyDtoSchema } from "./portfolio-company.dto";

describe("portfolioCompanyDtoSchema", () => {
  it("accepts the minimum viable document", () => {
    const result = portfolioCompanyDtoSchema.safeParse({
      id: "1",
      slug: "zuribeans",
      name: "Zuribeans",
      summary: "A specialist enterprise.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a document missing a required field", () => {
    const result = portfolioCompanyDtoSchema.safeParse({
      id: "1",
      slug: "zuribeans",
      name: "Zuribeans",
    });

    expect(result.success).toBe(false);
  });

  it("accepts canonical Baobab context fields when present", () => {
    const result = portfolioCompanyDtoSchema.safeParse({
      id: "1",
      slug: "zuribeans",
      name: "Zuribeans",
      summary: "A specialist enterprise.",
      canonicalEntityId: "portfolio-company:zuribeans",
      organisation: { id: "org_1" },
      digitalEstate: "estate_1",
      marketRefs: [{ id: "market_1" }, "market_2"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid status value", () => {
    const result = portfolioCompanyDtoSchema.safeParse({
      id: "1",
      slug: "zuribeans",
      name: "Zuribeans",
      summary: "A specialist enterprise.",
      status: "not-a-real-status",
    });

    expect(result.success).toBe(false);
  });
});
