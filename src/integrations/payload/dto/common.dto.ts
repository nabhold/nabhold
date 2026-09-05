import { z } from "zod";

/**
 * Payload relationship fields resolve to either a bare id string (depth 0)
 * or a populated object (depth > 0), depending on the query. The adapter
 * always requests a populated depth, but validation stays defensive.
 */
export const relationshipRefSchema = z.union([
  z.string(),
  z.object({ id: z.string() }).passthrough(),
]);

export type RelationshipRefLike = z.infer<typeof relationshipRefSchema>;

export function relationshipId(
  value: RelationshipRefLike | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return typeof value === "string" ? value : value.id;
}

export const mediaDtoSchema = z
  .object({
    id: z.string(),
    url: z.string().optional(),
    alt: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .passthrough();

export type MediaDto = z.infer<typeof mediaDtoSchema>;

export const seoDtoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    openGraphTitle: z.string().optional(),
    openGraphDescription: z.string().optional(),
    openGraphImage: mediaDtoSchema.nullable().optional(),
    canonicalOverride: z.string().optional(),
    robots: z
      .object({
        index: z.boolean().optional(),
        follow: z.boolean().optional(),
      })
      .partial()
      .optional(),
  })
  .partial();

export type SeoDto = z.infer<typeof seoDtoSchema>;

/**
 * Canonical Baobab context fields carried on every content record.
 * Optional throughout: `baobab-cms` may not yet populate every dimension
 * for every collection (ADR-0002).
 */
export const canonicalContextDtoSchema = z
  .object({
    canonicalEntityId: z.string().optional(),
    organisation: relationshipRefSchema.optional(),
    digitalEstate: relationshipRefSchema.optional(),
    /** Canonical Baobab market references. Distinct from a free-text "markets" editorial field. */
    marketRefs: z.array(relationshipRefSchema).optional(),
    locale: z.string().optional(),
    visibility: z
      .enum(["public", "registered", "client", "premium", "board"])
      .optional(),
  })
  .partial();

export type CanonicalContextDto = z.infer<typeof canonicalContextDtoSchema>;

/** Payload's standard REST list envelope shape. */
export function payloadListEnvelopeSchema<Item extends z.ZodTypeAny>(
  item: Item,
) {
  return z
    .object({
      docs: z.array(item),
      totalDocs: z.number(),
      totalPages: z.number(),
      page: z.number(),
      limit: z.number(),
    })
    .passthrough();
}
