import { contentCacheTags } from "@/lib/content/cache";

import { payloadListEnvelopeSchema } from "../dto/common.dto";
import {
  portfolioCompanyDtoSchema,
  type PortfolioCompanyDto,
} from "../dto/portfolio-company.dto";
import { payloadLogger } from "../logger";
import { fetchPayload, logPayloadOutcome } from "../transport";

const COLLECTION = "portfolio-companies";

export async function listPortfolioCompanyDtos(): Promise<
  PortfolioCompanyDto[]
> {
  const result = await fetchPayload(COLLECTION, {
    searchParams: { "where[status][equals]": "active", depth: "1", limit: "100" },
    tags: [contentCacheTags.portfolio],
  });

  logPayloadOutcome(result, { operation: "listPortfolioCompanies" });

  if (result.status !== "ok") return [];

  const parsed = payloadListEnvelopeSchema(portfolioCompanyDtoSchema).safeParse(
    result.data,
  );

  if (!parsed.success) {
    payloadLogger.degraded({
      operation: "listPortfolioCompanies",
      reason: "validation-failed",
    });
    return [];
  }

  return parsed.data.docs;
}

export async function getPortfolioCompanyDtoBySlug(
  slug: string,
): Promise<PortfolioCompanyDto | null> {
  const result = await fetchPayload(COLLECTION, {
    searchParams: {
      "where[slug][equals]": slug,
      "where[status][equals]": "active",
      depth: "1",
      limit: "1",
    },
    tags: [contentCacheTags.portfolioCompany(slug)],
  });

  logPayloadOutcome(result, { operation: "getPortfolioCompany", slug });

  if (result.status !== "ok") return null;

  const parsed = payloadListEnvelopeSchema(portfolioCompanyDtoSchema).safeParse(
    result.data,
  );

  if (!parsed.success || parsed.data.docs.length === 0) {
    return null;
  }

  return parsed.data.docs[0];
}
