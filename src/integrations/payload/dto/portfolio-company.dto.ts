import { z } from "zod";

import {
  canonicalContextDtoSchema,
  mediaDtoSchema,
  seoDtoSchema,
} from "./common.dto";

/**
 * Target contract for a future `portfolio-companies` Payload collection
 * (ADR-0002 — no such collection exists in `baobab-cms` yet). Only `slug`,
 * `name` and `summary` are required; every other field is optional so the
 * mapper degrades gracefully as the upstream schema fills in over time.
 */
export const portfolioCompanyDtoSchema = canonicalContextDtoSchema.extend({
  id: z.string(),
  slug: z.string().min(1),
  name: z.string().min(1),
  legalName: z.string().optional(),
  strapline: z.string().optional(),
  summary: z.string().min(1),
  description: z.string().optional(),
  sector: z.string().optional(),
  markets: z.string().optional(),
  website: z.string().optional(),
  logo: mediaDtoSchema.nullable().optional(),
  heroMedia: mediaDtoSchema.nullable().optional(),
  investmentThesis: z.string().optional(),
  strategicRole: z.string().optional(),
  status: z.enum(["active", "dormant", "exited"]).optional(),
  seo: seoDtoSchema.optional(),
});

export type PortfolioCompanyDto = z.infer<typeof portfolioCompanyDtoSchema>;
