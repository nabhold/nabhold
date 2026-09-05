import { z } from "zod";

import {
  canonicalContextDtoSchema,
  mediaDtoSchema,
  relationshipRefSchema,
  seoDtoSchema,
} from "./common.dto";
import { richTextDtoSchema } from "./rich-text.dto";

const authorDtoSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1),
    title: z.string().optional(),
    avatar: mediaDtoSchema.nullable().optional(),
  })
  .passthrough();

export const insightContentTypeDtoSchema = z
  .enum([
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
  ])
  .default("insight");

/**
 * Target contract for a future `insights` Payload collection (ADR-0002 —
 * not yet present in `baobab-cms`).
 */
export const insightDtoSchema = canonicalContextDtoSchema.extend({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  body: richTextDtoSchema,
  authors: z.array(authorDtoSchema).default([]),
  topics: z.array(z.union([z.string(), relationshipRefSchema])).default([]),
  sectors: z.array(z.union([z.string(), relationshipRefSchema])).optional(),
  contentType: insightContentTypeDtoSchema.optional(),
  publishedAt: z.string(),
  heroMedia: mediaDtoSchema.nullable().optional(),
  seo: seoDtoSchema.optional(),
});

export type InsightDto = z.infer<typeof insightDtoSchema>;
