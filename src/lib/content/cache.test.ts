import { describe, expect, it } from "vitest";

import {
  contentCacheTags,
  resolveCanonicalOverride,
  tagsForInsight,
  tagsForPortfolioCompany,
} from "./cache";

describe("cache tag generation", () => {
  it("generates a stable per-slug portfolio tag", () => {
    expect(contentCacheTags.portfolioCompany("zuribeans")).toBe(
      "content:portfolio:zuribeans",
    );
  });

  it("invalidates the homepage alongside a published portfolio company", () => {
    expect(tagsForPortfolioCompany("zuribeans")).toEqual([
      "content:portfolio",
      "content:portfolio:zuribeans",
      "content:homepage",
    ]);
  });

  it("invalidates both the listing and the detail tag for an insight", () => {
    expect(tagsForInsight("2026-outlook")).toEqual([
      "content:insights",
      "content:insight:2026-outlook",
    ]);
  });
});

describe("resolveCanonicalOverride", () => {
  const siteUrl = "https://nabhold.africa";

  it("accepts a same-origin absolute override", () => {
    expect(
      resolveCanonicalOverride("https://nabhold.africa/portfolio/zuribeans", siteUrl),
    ).toBe("https://nabhold.africa/portfolio/zuribeans");
  });

  it("accepts a same-origin relative override", () => {
    expect(resolveCanonicalOverride("/portfolio/zuribeans", siteUrl)).toBe(
      "https://nabhold.africa/portfolio/zuribeans",
    );
  });

  it("rejects an off-estate origin rather than trusting editorial input", () => {
    expect(
      resolveCanonicalOverride("https://malicious.example/steal", siteUrl),
    ).toBeNull();
  });

  it("returns null when no override is set", () => {
    expect(resolveCanonicalOverride(undefined, siteUrl)).toBeNull();
  });
});
