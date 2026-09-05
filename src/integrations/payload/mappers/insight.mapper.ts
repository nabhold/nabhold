import type { Author, Insight, InsightSummary } from "@/lib/content/types";
import { relationshipId, type RelationshipRefLike } from "../dto/common.dto";
import type { InsightDto } from "../dto/insight.dto";

import { mapCanonicalContext } from "./canonical-context.mapper";
import { mapMedia } from "./media.mapper";
import { extractPlainTextBlocks } from "./rich-text";
import { mapSeo } from "./seo.mapper";

function mapAuthor(dto: InsightDto["authors"][number]): Author {
  return {
    id: dto.id,
    name: dto.name,
    title: dto.title,
    avatar: mapMedia(dto.avatar),
  };
}

function mapLabel(value: string | RelationshipRefLike): string {
  return typeof value === "string" ? value : (relationshipId(value) ?? "");
}

export function toInsightSummary(dto: InsightDto): InsightSummary {
  return {
    ...mapCanonicalContext(dto),
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    contentType: dto.contentType ?? "insight",
    authors: dto.authors.map(mapAuthor),
    topics: dto.topics.map(mapLabel).filter(Boolean),
    sectors: dto.sectors?.map(mapLabel).filter(Boolean),
    publishedAt: dto.publishedAt,
    heroMedia: mapMedia(dto.heroMedia),
  };
}

export function toInsight(dto: InsightDto): Insight {
  return {
    ...toInsightSummary(dto),
    body: extractPlainTextBlocks(dto.body),
    seo: mapSeo(dto.seo),
  };
}
