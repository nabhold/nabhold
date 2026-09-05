import type {
  FooterContent,
  GroupProfileContent,
  Navigation,
  SiteSettings,
} from "@/lib/content/types";
import type { PageDto } from "../dto/page.dto";

import { mapCanonicalContext } from "./canonical-context.mapper";
import { mapMedia } from "./media.mapper";
import { extractPlainTextBlocks } from "./rich-text";
import { mapSeo } from "./seo.mapper";

/** Home page fields mapped from a `pages` doc, minus company resolution (done in the gateway). */
export interface MappedHomePageFields {
  eyebrow?: string;
  headline?: string;
  introduction?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  institutionalStatement?: string;
  heroMedia: ReturnType<typeof mapMedia>;
  featuredPortfolioCompanySlugs: string[];
  seo: ReturnType<typeof mapSeo>;
  canonical: ReturnType<typeof mapCanonicalContext>;
}

export function toHomePageFields(dto: PageDto): MappedHomePageFields {
  return {
    eyebrow: dto.eyebrow,
    headline: dto.headline,
    introduction: dto.introduction,
    primaryCta: dto.primaryCta,
    secondaryCta: dto.secondaryCta,
    institutionalStatement: dto.institutionalStatement,
    heroMedia: mapMedia(dto.heroMedia),
    featuredPortfolioCompanySlugs: dto.featuredPortfolioCompanies ?? [],
    seo: mapSeo(dto.seo),
    canonical: mapCanonicalContext(dto),
  };
}

export function toNavigation(
  dto: PageDto | null,
  fallback: Navigation,
): Navigation {
  if (!dto?.navigationItems?.length) return fallback;
  return { primary: dto.navigationItems };
}

export function toFooter(dto: PageDto | null, fallback: FooterContent): FooterContent {
  if (!dto) return fallback;

  return {
    statement: dto.statement ?? fallback.statement,
    tagline: dto.tagline ?? fallback.tagline,
    links: dto.footerLinks ?? fallback.links,
  };
}

export function toGroupProfile(
  dto: PageDto | null,
  fallback: GroupProfileContent,
): GroupProfileContent {
  if (!dto) return fallback;

  const body = extractPlainTextBlocks(dto.content);

  return {
    ...mapCanonicalContext(dto),
    title: dto.title ?? fallback.title,
    body: body.length > 0 ? body : fallback.body,
    seo: mapSeo(dto.seo) ?? fallback.seo,
  };
}

export function toSiteSettings(
  dto: PageDto | null,
  fallback: SiteSettings,
): SiteSettings {
  if (!dto) return fallback;

  return {
    siteName: dto.siteName ?? fallback.siteName,
    seoDefaults: mapSeo(dto.seo) ?? fallback.seoDefaults,
  };
}
