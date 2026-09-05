import { contentCacheTags } from "@/lib/content/cache";

import { payloadListEnvelopeSchema } from "../dto/common.dto";
import { sectorDtoSchema, type SectorDto } from "../dto/sector.dto";
import { payloadLogger } from "../logger";
import { fetchPayload, logPayloadOutcome } from "../transport";

const COLLECTION = "sectors";

export async function listSectorDtos(): Promise<SectorDto[]> {
  const result = await fetchPayload(COLLECTION, {
    searchParams: { depth: "1", limit: "100" },
    tags: [contentCacheTags.sectors],
  });

  logPayloadOutcome(result, { operation: "listSectors" });

  if (result.status !== "ok") return [];

  const parsed = payloadListEnvelopeSchema(sectorDtoSchema).safeParse(
    result.data,
  );

  if (!parsed.success) {
    payloadLogger.degraded({
      operation: "listSectors",
      reason: "validation-failed",
    });
    return [];
  }

  return parsed.data.docs;
}

export async function getSectorDtoBySlug(
  slug: string,
): Promise<SectorDto | null> {
  const result = await fetchPayload(COLLECTION, {
    searchParams: { "where[slug][equals]": slug, depth: "1", limit: "1" },
    tags: [contentCacheTags.sector(slug)],
  });

  logPayloadOutcome(result, { operation: "getSector", slug });

  if (result.status !== "ok") return null;

  const parsed = payloadListEnvelopeSchema(sectorDtoSchema).safeParse(
    result.data,
  );

  if (!parsed.success || parsed.data.docs.length === 0) {
    return null;
  }

  return parsed.data.docs[0];
}
