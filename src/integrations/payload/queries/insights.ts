import { contentCacheTags } from "@/lib/content/cache";
import type { InsightQuery } from "@/lib/content/types";

import { payloadListEnvelopeSchema } from "../dto/common.dto";
import { insightDtoSchema, type InsightDto } from "../dto/insight.dto";
import { payloadLogger } from "../logger";
import { fetchPayload, logPayloadOutcome } from "../transport";

const COLLECTION = "insights";
const DEFAULT_PAGE_SIZE = 12;

export interface InsightPageResult {
  items: InsightDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export async function listInsightDtos(
  query: InsightQuery = {},
): Promise<InsightPageResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

  const searchParams: Record<string, string> = {
    "where[status][equals]": "published",
    "sort": "-publishedAt",
    depth: "1",
    page: String(page),
    limit: String(pageSize),
  };

  if (query.contentType) {
    searchParams["where[contentType][equals]"] = query.contentType;
  }
  if (query.topic) {
    searchParams["where[topics][in]"] = query.topic;
  }
  if (query.sector) {
    searchParams["where[sectors][in]"] = query.sector;
  }

  const empty: InsightPageResult = {
    items: [],
    page,
    pageSize,
    totalItems: 0,
    totalPages: 0,
  };

  const result = await fetchPayload(COLLECTION, {
    searchParams,
    tags: [contentCacheTags.insights],
  });

  logPayloadOutcome(result, { operation: "listInsights" });

  if (result.status !== "ok") return empty;

  const parsed = payloadListEnvelopeSchema(insightDtoSchema).safeParse(
    result.data,
  );

  if (!parsed.success) {
    payloadLogger.degraded({
      operation: "listInsights",
      reason: "validation-failed",
    });
    return empty;
  }

  return {
    items: parsed.data.docs,
    page: parsed.data.page,
    pageSize: parsed.data.limit,
    totalItems: parsed.data.totalDocs,
    totalPages: parsed.data.totalPages,
  };
}

export async function getInsightDtoBySlug(
  slug: string,
): Promise<InsightDto | null> {
  const result = await fetchPayload(COLLECTION, {
    searchParams: {
      "where[slug][equals]": slug,
      "where[status][equals]": "published",
      depth: "1",
      limit: "1",
    },
    tags: [contentCacheTags.insight(slug)],
  });

  logPayloadOutcome(result, { operation: "getInsight", slug });

  if (result.status !== "ok") return null;

  const parsed = payloadListEnvelopeSchema(insightDtoSchema).safeParse(
    result.data,
  );

  if (!parsed.success || parsed.data.docs.length === 0) {
    return null;
  }

  return parsed.data.docs[0];
}
