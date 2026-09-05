import { payloadListEnvelopeSchema } from "../dto/common.dto";
import { pageDtoSchema, type PageDto } from "../dto/page.dto";
import { fetchPayload, logPayloadOutcome } from "../transport";

const COLLECTION = "pages";

export async function getPageDtoByContentKey(
  contentKey: string,
  tags: string[],
): Promise<PageDto | null> {
  const result = await fetchPayload(COLLECTION, {
    searchParams: {
      "where[contentKey][equals]": contentKey,
      "where[status][equals]": "published",
      depth: "1",
      limit: "1",
    },
    tags,
  });

  logPayloadOutcome(result, { operation: "getPageByContentKey", contentKey });

  if (result.status !== "ok") return null;

  const parsed = payloadListEnvelopeSchema(pageDtoSchema).safeParse(
    result.data,
  );

  if (!parsed.success || parsed.data.docs.length === 0) {
    return null;
  }

  return parsed.data.docs[0];
}
