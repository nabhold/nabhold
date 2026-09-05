/**
 * Estate-owned corporate content domain model.
 *
 * Nothing in this file may import from `src/integrations/payload`. Payload
 * DTOs are mapped into these types at the adapter boundary (see
 * `src/integrations/payload/mappers`) so that page and feature code never
 * depends on Payload's response shape.
 */

/** BCP 47 language/region tag, e.g. "en-ZA". Distinct from Market. */
export type Locale = string;

/**
 * Opaque Baobab market identifier (commercial/regulatory/geographic
 * context), e.g. "south-africa" or "uganda". Never conflated with locale.
 */
export type MarketId = string;

export type ContentVisibility =
  | "public"
  | "registered"
  | "client"
  | "premium"
  | "board";

/**
 * Canonical Baobab context carried on every content record. These fields
 * are references into Baobab's own canonical registries (see
 * `nabhold/shared/contracts`); they are never redefined here.
 */
export interface CanonicalContext {
  /** Opaque canonical identifier minted by its authoritative domain. */
  canonicalEntityId?: string;
  /** Canonical legal-entity identifier, e.g. "NABHOLD". */
  organisationId?: string;
  /** Canonical digital-estate identifier for this estate. */
  digitalEstateId?: string;
  /** Markets this content applies to. Empty/absent means "all markets". */
  marketIds?: MarketId[];
  /** Content-resolution locale. */
  locale?: Locale;
  visibility?: ContentVisibility;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: MediaAsset | null;
  /**
   * Editorial canonical-URL override. Never trusted verbatim — the estate
   * validates it resolves to this estate's own origin before use (see
   * `resolveCanonicalUrl` in `src/lib/content/cache.ts`).
   */
  canonicalOverride?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

export interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CallToAction {
  label: string;
  href: string;
}

export interface PortfolioCompanySummary extends CanonicalContext {
  slug: string;
  name: string;
  strapline?: string;
  summary: string;
  sector?: string;
  logo?: MediaAsset | null;
  /**
   * Set only for the visibly-labelled, non-authoritative development
   * fallback (ADR-0002). Always `undefined` for Payload-sourced content,
   * and never `true` in production — see
   * `isDevContentFallbackEnabled` in `src/integrations/payload/config.ts`.
   */
  devFallback?: true;
}

export type PortfolioCompanyStatus = "active" | "dormant" | "exited";

export interface PortfolioCompany extends PortfolioCompanySummary {
  legalName?: string;
  description?: string;
  markets?: string;
  website?: string;
  heroMedia?: MediaAsset | null;
  investmentThesis?: string;
  strategicRole?: string;
  status?: PortfolioCompanyStatus;
  seo?: SeoMetadata;
}

export interface SectorSummary extends CanonicalContext {
  slug: string;
  name: string;
  summary: string;
}

export interface Sector extends SectorSummary {
  description?: string;
  heroMedia?: MediaAsset | null;
  seo?: SeoMetadata;
}

export type InsightContentType =
  | "insight"
  | "research-note"
  | "market-brief"
  | "sector-outlook"
  | "trade-intelligence"
  | "investment-thesis"
  | "regulatory-alert"
  | "white-paper"
  | "annual-review"
  | "press-release";

export interface Author {
  id: string;
  name: string;
  title?: string;
  avatar?: MediaAsset | null;
}

export interface InsightSummary extends CanonicalContext {
  slug: string;
  title: string;
  excerpt?: string;
  contentType: InsightContentType;
  authors: Author[];
  topics: string[];
  sectors?: string[];
  publishedAt: string;
  heroMedia?: MediaAsset | null;
}

/**
 * A single plain-text block extracted from Payload's rich text. Rendering
 * this never requires `dangerouslySetInnerHTML` — see
 * `src/integrations/payload/mappers/rich-text.ts`.
 */
export interface RichTextBlock {
  type: "paragraph" | "heading";
  level?: 1 | 2 | 3;
  text: string;
}

export interface Insight extends InsightSummary {
  body: RichTextBlock[];
  seo?: SeoMetadata;
}

export interface InsightQuery {
  page?: number;
  pageSize?: number;
  contentType?: InsightContentType;
  topic?: string;
  sector?: string;
}

export interface PaginatedInsights {
  items: InsightSummary[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface HomePageContent extends CanonicalContext {
  eyebrow?: string;
  headline: string;
  introduction?: string;
  primaryCta?: CallToAction;
  secondaryCta?: CallToAction;
  featuredPortfolioCompanies: PortfolioCompanySummary[];
  institutionalStatement?: string;
  heroMedia?: MediaAsset | null;
  seo?: SeoMetadata;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface Navigation {
  primary: NavigationItem[];
}

export interface FooterContent {
  statement?: string;
  tagline?: string;
  links: NavigationItem[];
}

export interface SiteSettings {
  siteName: string;
  seoDefaults?: SeoMetadata;
}

export interface GroupProfileContent extends CanonicalContext {
  title: string;
  body: RichTextBlock[];
  seo?: SeoMetadata;
}
