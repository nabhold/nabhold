import { z } from "zod";

import type { InsightContentType } from "./types";

/** BCP 47 language tag, optionally region-qualified, e.g. "en" or "en-ZA". */
export const localeSchema = z
  .string()
  .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/, "Expected a BCP 47 locale (e.g. en-ZA)");

/** Opaque Baobab market identifier. Not a locale — see ADR-0002. */
export const marketIdSchema = z
  .string()
  .min(1)
  .max(128);

export const insightContentTypes = [
  "insight",
  "research-note",
  "market-brief",
  "sector-outlook",
  "trade-intelligence",
  "investment-thesis",
  "regulatory-alert",
  "white-paper",
  "annual-review",
  "press-release",
] as const satisfies readonly InsightContentType[];

export const insightContentTypeSchema = z.enum(insightContentTypes);

export function isInsightContentType(
  value: string,
): value is InsightContentType {
  return (insightContentTypes as readonly string[]).includes(value);
}

/**
 * Validates untrusted query input (e.g. `URLSearchParams` on `/insights`)
 * before it reaches `CorporateContentGateway.listInsights`.
 */
export const insightQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  contentType: insightContentTypeSchema.optional(),
  topic: z.string().min(1).max(128).optional(),
  sector: z.string().min(1).max(128).optional(),
});

export type ValidatedInsightQuery = z.infer<typeof insightQuerySchema>;

/**
 * Narrow revalidation request accepted by `POST /api/revalidate`. Keeping
 * this a closed, discriminated set (rather than "revalidate anything by
 * tag string") means a compromised or misconfigured Payload webhook can
 * only ever invalidate a specific, known content record — never the whole
 * cache — per ADR-0002 §10.
 */
export const revalidateRequestSchema = z.discriminatedUnion("collection", [
  z.object({ collection: z.literal("portfolio-companies"), slug: z.string().min(1) }),
  z.object({ collection: z.literal("sectors"), slug: z.string().min(1) }),
  z.object({ collection: z.literal("insights"), slug: z.string().min(1) }),
  z.object({
    collection: z.literal("pages"),
    contentKey: z.enum([
      "home",
      "navigation",
      "footer",
      "site-settings",
      "group-profile",
    ]),
  }),
]);

export type RevalidateRequest = z.infer<typeof revalidateRequestSchema>;
