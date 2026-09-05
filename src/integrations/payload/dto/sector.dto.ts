import { z } from "zod";

import {
  canonicalContextDtoSchema,
  mediaDtoSchema,
  seoDtoSchema,
} from "./common.dto";

/**
 * Target contract for a future `sectors` Payload collection (ADR-0002 — not
 * yet present in `baobab-cms`).
 */
export const sectorDtoSchema = canonicalContextDtoSchema.extend({
  id: z.string(),
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  heroMedia: mediaDtoSchema.nullable().optional(),
  seo: seoDtoSchema.optional(),
});

export type SectorDto = z.infer<typeof sectorDtoSchema>;
