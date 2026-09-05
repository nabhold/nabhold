import type { MediaAsset } from "@/lib/content/types";
import type { MediaDto } from "../dto/common.dto";

export function mapMedia(
  dto: MediaDto | null | undefined,
): MediaAsset | null {
  if (!dto || !dto.url) return null;

  return {
    id: dto.id,
    url: dto.url,
    alt: dto.alt ?? "",
    width: dto.width,
    height: dto.height,
  };
}
