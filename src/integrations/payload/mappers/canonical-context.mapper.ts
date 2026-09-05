import type { CanonicalContext } from "@/lib/content/types";
import { relationshipId, type CanonicalContextDto } from "../dto/common.dto";

export function mapCanonicalContext(
  dto: CanonicalContextDto,
): CanonicalContext {
  return {
    canonicalEntityId: dto.canonicalEntityId,
    organisationId: relationshipId(dto.organisation),
    digitalEstateId: relationshipId(dto.digitalEstate),
    marketIds: dto.marketRefs?.map((ref) => relationshipId(ref)).filter(
      (id): id is string => Boolean(id),
    ),
    locale: dto.locale,
    visibility: dto.visibility,
  };
}
