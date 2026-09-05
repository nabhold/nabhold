import { describe, expect, it } from "vitest";

import type { InsightDto } from "../dto/insight.dto";
import { toInsight, toInsightSummary } from "./insight.mapper";

const baseDto: InsightDto = {
  id: "1",
  slug: "2026-coffee-outlook",
  title: "2026 coffee outlook",
  authors: [{ id: "a1", name: "Jane Doe" }],
  topics: ["coffee", { id: "topic_2" }],
  publishedAt: "2026-01-15T00:00:00Z",
};

describe("insight mapper", () => {
  it("defaults contentType to 'insight' when Payload omits it", () => {
    const summary = toInsightSummary(baseDto);
    expect(summary.contentType).toBe("insight");
  });

  it("resolves mixed string/relationship topic references", () => {
    const summary = toInsightSummary(baseDto);
    expect(summary.topics).toEqual(["coffee", "topic_2"]);
  });

  it("extracts plain-text blocks from Lexical rich text", () => {
    const insight = toInsight({
      ...baseDto,
      body: {
        root: {
          children: [
            { type: "heading", tag: "h2", children: [{ text: "Overview" }] },
            { type: "paragraph", children: [{ text: "Demand remains strong." }] },
          ],
        },
      },
    });

    expect(insight.body).toEqual([
      { type: "heading", level: 2, text: "Overview" },
      { type: "paragraph", text: "Demand remains strong." },
    ]);
  });

  it("returns an empty body when rich text is absent", () => {
    const insight = toInsight(baseDto);
    expect(insight.body).toEqual([]);
  });
});
