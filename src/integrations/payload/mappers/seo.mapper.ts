import type { SeoMetadata } from "@/lib/content/types";
import type { SeoDto } from "../dto/common.dto";

import { mapMedia } from "./media.mapper";

export function mapSeo(dto: SeoDto | undefined): SeoMetadata | undefined {
  if (!dto) return undefined;

  return {
    title: dto.title,
    description: dto.description,
    openGraphTitle: dto.openGraphTitle,
    openGraphDescription: dto.openGraphDescription,
    openGraphImage: mapMedia(dto.openGraphImage),
    canonicalOverride: dto.canonicalOverride,
    robots: dto.robots,
  };
}
