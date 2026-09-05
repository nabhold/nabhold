import { describe, expect, it } from "vitest";

import { insightQuerySchema, isInsightContentType } from "./schemas";

describe("content type guards", () => {
  it("recognises a valid insight content type", () => {
    expect(isInsightContentType("market-brief")).toBe(true);
  });

  it("rejects an unknown content type", () => {
    expect(isInsightContentType("blog-post")).toBe(false);
  });
});

describe("insightQuerySchema", () => {
  it("coerces and validates query-string style input", () => {
    const result = insightQuerySchema.safeParse({ page: "2", pageSize: "5" });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ page: 2, pageSize: 5 });
  });

  it("rejects an out-of-range page size", () => {
    const result = insightQuerySchema.safeParse({ pageSize: "1000" });

    expect(result.success).toBe(false);
  });
});
