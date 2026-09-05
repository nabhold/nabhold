import { describe, expect, it } from "vitest";

import type { PortfolioCompanyDto } from "../dto/portfolio-company.dto";
import { toPortfolioCompany, toPortfolioCompanySummary } from "./portfolio-company.mapper";

const minimalDto: PortfolioCompanyDto = {
  id: "1",
  slug: "zuribeans",
  name: "Zuribeans",
  summary: "A specialist enterprise.",
};

describe("portfolio company mapper", () => {
  it("maps required fields and leaves optional fields undefined", () => {
    const summary = toPortfolioCompanySummary(minimalDto);

    expect(summary).toMatchObject({
      slug: "zuribeans",
      name: "Zuribeans",
      summary: "A specialist enterprise.",
    });
    expect(summary.sector).toBeUndefined();
    expect(summary.logo).toBeNull();
  });

  it("resolves relationship fields to canonical ids", () => {
    const full = toPortfolioCompany({
      ...minimalDto,
      organisation: { id: "org_1" },
      digitalEstate: "estate_1",
      marketRefs: [{ id: "market_1" }, "market_2"],
    });

    expect(full.organisationId).toBe("org_1");
    expect(full.digitalEstateId).toBe("estate_1");
    expect(full.marketIds).toEqual(["market_1", "market_2"]);
  });

  it("drops media without a resolvable url", () => {
    const full = toPortfolioCompany({
      ...minimalDto,
      logo: { id: "media_1" },
    });

    expect(full.logo).toBeNull();
  });

  it("maps a populated media asset", () => {
    const full = toPortfolioCompany({
      ...minimalDto,
      logo: { id: "media_1", url: "https://cms.example.test/logo.png", alt: "Logo" },
    });

    expect(full.logo).toEqual({
      id: "media_1",
      url: "https://cms.example.test/logo.png",
      alt: "Logo",
      width: undefined,
      height: undefined,
    });
  });
});
