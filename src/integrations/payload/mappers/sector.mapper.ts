import type { Sector, SectorSummary } from "@/lib/content/types";
import type { SectorDto } from "../dto/sector.dto";

import { mapCanonicalContext } from "./canonical-context.mapper";
import { mapMedia } from "./media.mapper";
import { mapSeo } from "./seo.mapper";

export function toSectorSummary(dto: SectorDto): SectorSummary {
  return {
    ...mapCanonicalContext(dto),
    slug: dto.slug,
    name: dto.name,
    summary: dto.summary,
  };
}

export function toSector(dto: SectorDto): Sector {
  return {
    ...toSectorSummary(dto),
    description: dto.description,
    heroMedia: mapMedia(dto.heroMedia),
    seo: mapSeo(dto.seo),
  };
}
